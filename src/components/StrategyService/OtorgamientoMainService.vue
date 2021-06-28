<template>
    <v-container>
<!--        <notification :icon="iconSnack" :info-alert="snackInfo" :type-alert="snackAlertType"-->
<!--                      :show-snack="showSnackNotification"></notification>-->
        <v-dialog v-model="dialogNewOtorgamiento" persistent max-width="500px">
            <v-card>
                <v-card-title>Nuevo Tipo de Otorgamiento</v-card-title>
                <v-container>
                    <v-form v-model="isFormNewOtorgamientoValid" lazy-validation ref="newOtorgamientoForm" @submit.prevent="saveOtorgamiento">
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field label="Otorgamiento" v-model="otorgamientoNew.otorgamiento" prepend-icon="text_fields"
                                              :rules="rules.otorgamientoRule"
                                              aria-autocomplete="list" aria-required="true"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1 mt-3">
                            <v-flex xs12>
                                <v-slider v-model="otorgamientoNew.cantPuntos" :rules="rules.puntosRules" hint="Cantidad de puntos"
                                label="Puntos" thumb-label="always"
                                ></v-slider>
                            </v-flex>
                        </v-layout>

                        <v-layout row class="ma-1">
                            <v-flex xs12 class="text-right">
                                <v-btn color="blue" type="submit" style="color: white!important;" class="mx-1"
                                       :disabled="!isFormNewOtorgamientoValid||loading" :loading="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon>refresh</v-icon>
                                    </span>
                                    Confirmar
                                </v-btn>
                                <v-btn color="red" style="color: white!important;" class="mx-1"
                                       @click="cancelar">Cancelar
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-container>
            </v-card>

        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="400px">
            <v-card>
                <v-card-title class="font-weight-light">¿Está seguro que desea eliminar el otorgamiento?</v-card-title>
                <v-card-actions>
                    <v-flex class="text-center">
                        <v-btn class="mx-1" color="success" @click="deleteOtorgamiento">Confirmar</v-btn>
                        <v-btn class="mx-1" color="error" @click="dialogDelete=false">Cancelar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEdit" persistent max-width="500px">
            <v-card>
                <v-container>
                    <v-card-title v-if="otorgamientoToEdit!==null">Editar el otorgamiento:
                        {{otorgamientoToEdit.otorgamiento}}</v-card-title>
                    <v-layout row class="ma-1 mt-3">
                        <v-flex xs12>
                            <v-slider v-model="cantPuntos" :rules="rules.puntosRules" hint="Cantidad de puntos"
                                      label="Puntos" thumb-label="always"
                            ></v-slider>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn class="mx-1" color="orange" style="color: white!important;"
                                   @click="editOtorgamiento" :loading="loading" :disabled="loading">
                                <span slot="loader" class="custom-loader">
                                <v-icon>refresh</v-icon>
                            </span>Editar</v-btn>
                            <v-btn class="mx-1" color="red" style="color: white!important;" @click="cancelar">Cancelar</v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col cols="9">
                <h2 class="font-weight-light mb-3">Otorgamiento</h2>
            </v-col>
            <v-col cols="3">
                <v-flex class="text-right">
                    <v-btn color="blue" outlined dark elevation="3" @click="dialogNewOtorgamiento=true">
                        <v-icon>add</v-icon>
                        Añadir
                    </v-btn>
                </v-flex>
            </v-col>
        </v-row>

        <v-row class="mt-3">
            <v-col v-for="tipo in otorgamientoList" :key="tipo.id" cols="3">
                <v-card hover outlined shaped class="mx-1 my-1" style="cursor: default">
                    <div style="background-color: #3f9655">
                        <v-card-title style="color: white">{{tipo.otorgamiento}}</v-card-title>
                    </div>
                    <v-divider/>
                    <v-card-text><b><v-icon class="sports_esports"/> Puntos:</b> {{tipo.cantPuntos}}</v-card-text>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-btn icon @click="editItem(tipo)" v-bind="attrs" v-on="on">
                                        <v-icon color="orange">edit</v-icon>
                                    </v-btn>
                                </template>
                                <span>Editar otorgamiento</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-btn icon @click="deleteItem(tipo)" v-bind="attrs" v-on="on">
                                        <v-icon color="red">delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Eliminar otorgamiento</span>
                            </v-tooltip>
                        </v-flex>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapGetters} from "vuex";
    import {
        URL_DELETE_OTORGAMIENTO,
        URL_EDIT_OTORGAMIENTO,
        URL_FETCH_ALL_OTORGAMIENTO,
        URL_SAVE_OTORGAMIENTO
    } from "../../urlResources";
    import axios from 'axios';

    export default {
        name: "OtorgamientoMainService",
        data(){
            return{
                isFormNewOtorgamientoValid:true,
                rules:{
                    otorgamientoRule:[otorgamiento=>!!otorgamiento||"El nombre del otorgamiento es requerido"],
                    puntosRules:[puntos=>puntos>0||"La cantidad de puntos debe ser mayor de cero"]
                },
                otorgamientoNew:{
                    cantPuntos:0,
                    otorgamiento:''
                },
                dialogDelete:false,
                otorgamientoToEdit:null,
                otorgamientoToDelete:null,
                cantPuntos:0,
                dialogNewOtorgamiento:false,
                otorgamientoList:[],
                dialogEdit:false
            }
        },
        methods:{
            saveOtorgamiento(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true)
                axios.post(URL_SAVE_OTORGAMIENTO,this.otorgamientoNew,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data)
                    this.$store.commit('setLoading',false);
                    this.otorgamientoList.push(data);
                    this.dialogNewOtorgamiento =false;
                    this.$refs.newOtorgamientoForm.reset();
                }).catch(err=>{
                    console.log(err)
                    this.$store.commit('setLoading',false);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            cancelar(){
                this.dialogDelete=false;
                this.dialogNewOtorgamiento=false;
                this.dialogEdit=false;
                this.$refs.newOtorgamientoForm.reset();
            },
            deleteOtorgamiento(){
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_OTORGAMIENTO,{
                    params:{
                        id:this.otorgamientoToDelete.idOtorgamiento
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data);
                    this.dialogDelete=false;
                    this.getAllOtorgamiento();
                }).catch(err=>{
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            editOtorgamiento(){
                const token = localStorage.getItem('token');
                const payload={
                    cantPuntos: this.cantPuntos,
                    idOtorgamiento: this.otorgamientoToEdit.idOtorgamiento,
                    otorgamiento: this.otorgamientoToEdit.otorgamiento
                }
                axios.post(URL_EDIT_OTORGAMIENTO,payload,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data);
                    this.getAllOtorgamiento();
                    this.dialogEdit=false
                }).catch(err=>{
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            editItem(tipo){
                this.dialogEdit=true;
                this.otorgamientoToEdit=tipo;
                this.cantPuntos=tipo.cantPuntos;
            },
            deleteItem(tipo){
                this.dialogDelete=true;
                this.otorgamientoToDelete=tipo;
            },
            getAllOtorgamiento(){
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_OTORGAMIENTO,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.otorgamientoList=data;
                }).catch(err=> {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            }

        },
        computed:{
            ...mapGetters(['loading'])
        },
        created() {
            this.getAllOtorgamiento();
        }
    }
</script>

<style scoped>
    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }

    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>