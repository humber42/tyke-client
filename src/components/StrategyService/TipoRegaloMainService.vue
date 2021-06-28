<template>
    <v-container>
<!--        <notification :icon="iconSnack" :info-alert="snackInfo" :type-alert="snackAlertType"-->
<!--                      :show-snack="showSnackNotification"></notification>-->
        <v-dialog v-model="dialogNewTypeGift" persistent max-width="500px">
            <v-card>
                <v-card-title>Nuevo Tipo de regalo</v-card-title>
                <v-container>
                    <v-form v-model="isFormNewGiftTypeValid" lazy-validation ref="newTypeGiftForm" @submit.prevent="saveTypeGift">
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field label="Tipo de regalo" v-model="tipoRegaloNew.nombre" prepend-icon="text_fields"
                                              :rules="rules.ruleTipoGift"
                                              aria-autocomplete="list" aria-required="true"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12 class="text-right">
                                <v-btn color="blue" type="submit" style="color: white!important;" class="mx-1"
                                       :disabled="!isFormNewGiftTypeValid||loading" :loading="loading">
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
                <v-card-title class="font-weight-light">¿Está seguro que desea eliminar el tipo de regalo?</v-card-title>
                <v-card-actions>
                    <v-flex class="text-center">
                        <v-btn class="mx-1" color="success" @click="deleteTypeGift">Confirmar</v-btn>
                        <v-btn class="mx-1" color="error" @click="cancelar">Cancelar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col cols="9">
                <h2 class="font-weight-light mb-3">Tipo de regalo</h2>
            </v-col>
            <v-col cols="3">
                <v-flex class="text-right">
                    <v-btn color="blue" outlined dark elevation="3" @click="dialogNewTypeGift=true">
                        <v-icon>add</v-icon>
                        Añadir
                    </v-btn>
                </v-flex>
            </v-col>
        </v-row>

        <v-row class="mt-3">
            <v-col v-for="tipo in tipoRegaloList" :key="tipo.id" cols="3">
                <v-card hover outlined shaped class="mx-1 my-1" style="cursor: default">
                    <div style="background-color: #3f9655">
                        <v-card-title style="color: white">Tipo de regalo</v-card-title>
                    </div>

                    <v-divider/>
                    <h2 class="ml-4 font-weight-regular"><v-icon class="app_registration" light/> {{tipo.nombre}}</h2>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-btn icon @click="deleteTipoRegalo(tipo)" v-bind="attrs" v-on="on">
                                        <v-icon color="red">delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Eliminar tipo de regalo</span>
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
    import axios from "axios"
    import {URL_DELETE_TIPO_REGALO, URL_FETCH_ALL_TIPO_REGALO, URL_SAVE_TIPO_REGALO} from "../../urlResources";

    export default {
        name: "TipoRegaloMainService",
        data(){
            return{
                dialogNewTypeGift:false,
                isFormNewGiftTypeValid:true,
                rules:{
                    ruleTipoGift:[gift=>!!gift||"El tipo de regalo es requerido"]
                },
                tipoRegaloNew:{
                    nombre:''
                },
                dialogDelete:false,
                tipoRegaloList:[],
                tipoRegaloToDelete:null
            }
        },
        methods:{
            saveTypeGift(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true);
                axios.post(URL_SAVE_TIPO_REGALO,this.tipoRegaloNew,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data);
                    this.$store.commit('setLoading',false);
                    this.dialogNewTypeGift=false;
                    this.$refs.newTypeGiftForm.reset();
                    this.getAllGiftType();
                }).catch(err=>{
                    console.log(err);
                    this.$store.commit('setLoading',false);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            cancelar(){
                this.dialogNewTypeGift=false
                this.tipoRegaloNew.nombre=''
                this.dialogDelete=false;
            },
            deleteTypeGift(){
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_TIPO_REGALO,{
                    params:{
                        id:this.tipoRegaloToDelete.idTipoRegalo
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data)
                    this.dialogDelete=false;
                    this.getAllGiftType();
                }).catch(err=>{
                    console.log(err);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            deleteTipoRegalo(tipo){
                this.tipoRegaloToDelete=tipo;
                this.dialogDelete=true;
            },
            getAllGiftType(){
                const token = localStorage.getItem('token')
                axios.get(URL_FETCH_ALL_TIPO_REGALO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.tipoRegaloList=data;
                }).catch(err=> {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            }
        },
        computed:{
            ...mapGetters(['loading'])
        },
        created() {
            this.getAllGiftType();
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