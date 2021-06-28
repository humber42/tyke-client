<template>
    <v-container>
        <notification :icon="iconSnack" :info-alert="snackInfo" :type-alert="snackAlertType"
                      :show-snack="showSnackNotification"></notification>
        <v-dialog v-model="dialogNewClueType" persistent max-width="500px">
            <v-card>
                <v-card-title>Nuevo Tipo de pista</v-card-title>
                <v-container>
                    <v-form v-model="isFormNewClueTypeValid" lazy-validation ref="newClueTypeForm" @submit.prevent="saveClueType">
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field label="Tipo de pista" v-model="typePistaName" prepend-icon="text_fields"
                                              :rules="typeNameRules"
                                              aria-autocomplete="list" aria-required="true"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field prepend-icon="sports_esports" label="Puntos de juego"
                                              v-model="puntosJuego"
                                >
                                    <template v-slot:append>
                                        <v-icon class="remove" @click="disminuirValorSpinnerPuntosJuego"/>
                                        <v-icon class="add" @click="aumentarValorSpinnerPuntosJuego"></v-icon>
                                    </template>
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field prepend-icon="emoji_objects" label="Puntos de pista"
                                              v-model="puntosPista"
                                >
                                    <template v-slot:append>
                                        <v-icon class="remove" @click="disminuirValorSpinnerPuntosPista"/>
                                        <v-icon class="add" @click="aumentarValorSpinnerPuntosPista"></v-icon>
                                    </template>
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12 class="text-right">
                                <v-btn color="blue" type="submit" style="color: white!important;" class="mx-1"
                                       :disabled="!isFormNewClueTypeValid||loading" :loading="loading">
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
                <v-card-title class="font-weight-light">¿Está seguro que desea eliminar el tipo de pista?</v-card-title>
                <v-card-actions>
                    <v-flex class="text-center">
                        <v-btn class="mx-1" color="success" @click="deleteTypeClue">Confirmar</v-btn>
                        <v-btn class="mx-1" color="error" @click="dialogDelete=false">Cancelar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEdit" persistent max-width="500px">
            <v-card>
                <v-container>
                    <v-card-title v-if="tipoPistaToEdit!==null">Editar el tipo de pista: {{tipoPistaToEdit.tipo}}</v-card-title>
                    <v-layout row class="ma-1">
                        <v-flex xs12>
                            <v-text-field prepend-icon="sports_esports" label="Puntos de juego"
                                          v-model="puntosJuego"
                            >
                                <template v-slot:append>
                                    <v-icon class="remove" @click="disminuirValorSpinnerPuntosJuego"/>
                                    <v-icon class="add" @click="aumentarValorSpinnerPuntosJuego"></v-icon>
                                </template>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row class="ma-1">
                        <v-flex xs12>
                            <v-text-field prepend-icon="emoji_objects" label="Puntos de pista"
                                          v-model="puntosPista"
                            >
                                <template v-slot:append>
                                    <v-icon class="remove" @click="disminuirValorSpinnerPuntosPista"/>
                                    <v-icon class="add" @click="aumentarValorSpinnerPuntosPista"></v-icon>
                                </template>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn class="mx-1" color="orange" style="color: white!important;"
                                   @click="editTipoPistaService" :loading="loading" :disabled="loading">
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
                <h2 class="font-weight-light mb-3">Tipo de pista</h2>
            </v-col>
            <v-col cols="3">
                <v-flex class="text-right">
                    <v-btn color="blue" outlined dark elevation="3" @click="dialogNewClueType=true">
                        <v-icon>add</v-icon>
                        Añadir
                    </v-btn>
                </v-flex>
            </v-col>
        </v-row>

        <v-row class="mt-3">
            <v-col v-for="tipo in tipoPistaList" :key="tipo.id" cols="3">
                <v-card hover outlined shaped class="mx-1 my-1" style="cursor: default">
                    <div style="background-color: #3f9655">
                        <v-card-title style="color: white">{{tipo.tipo}}</v-card-title>
                    </div>
                    <v-divider/>
                    <v-card-text><b><v-icon class="sports_esports"/> Puntos de juego:</b> {{tipo.puntosJuego}}</v-card-text>
                    <v-card-text><b><v-icon class="emoji_objects"/> Puntos de pista:</b> {{tipo.puntosPista}}</v-card-text>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-btn icon @click="editTipoPista(tipo)" v-bind="attrs" v-on="on">
                                        <v-icon color="orange">edit</v-icon>
                                    </v-btn>
                                </template>
                                <span>Editar tipo de pista</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-btn icon @click="deleteTipoPista(tipo)" v-bind="attrs" v-on="on">
                                        <v-icon color="red">delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Eliminar tipo de pista</span>
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
    import axios from "axios";
    import {
        URL_DELETE_TIPO_PISTA,
        URL_EDIT_TIPO_PISTA,
        URL_FETCH_ALL_TIPO_PISTA,
        URL_SAVE_TIPO_PISTA
    } from "../../urlResources";

    export default {
        name: "ClueTypeService",
        data(){
            return{
                iconSnack:'',
                snackInfo:"",
                snackAlertType:'',
                showSnackNotification:false,
                dialogNewClueType:false,
                isFormNewClueTypeValid:true,
                typePistaName:'',
                typeNameRules:[type=>!!type||"El nombre del tipo de pista es requerido"],
                puntosJuego:0,
                puntosPista:0,
                dialogDelete:false,
                tipoPistaList:[],
                tipoPistaToDelete:null,
                tipoPistaToEdit:null,
                dialogEdit:false,
            }
        },
        methods:{
            saveClueType(){
                if(this.$refs.newClueTypeForm.validate()) {
                    const token = localStorage.getItem('token');
                    const payload = {
                        puntosJuego: this.puntosJuego,
                        puntosPista: this.puntosPista,
                        tipo: this.typePistaName
                    };
                    this.$store.commit('setLoading', true);
                    axios.post(URL_SAVE_TIPO_PISTA, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.typePistaName='';
                        this.puntosJuego=0;
                        this.puntosPista=0;
                        this.$store.commit('setLoading',false);
                        this.tipoPistaList.push(data);
                        this.dialogNewClueType=false;
                    }).catch(err=>{
                        console.log(err)
                        this.$store.commit('setLoading',false);
                        if(err.response.status===403){
                            this.$router.push("/403");
                        }
                    })
                }
            },
            editTipoPista(tipo){
                this.tipoPistaToEdit=tipo;
                this.puntosJuego= tipo.puntosJuego;
                this.puntosPista=tipo.puntosPista;
                this.dialogEdit =true;
            },
            disminuirValorSpinnerPuntosJuego(){
                if (this.puntosJuego > 1) {
                    this.puntosJuego--;
                }
            },
            aumentarValorSpinnerPuntosJuego(){
                this.puntosJuego++
            },
            disminuirValorSpinnerPuntosPista(){
                if (this.puntosPista > 1) {
                    this.puntosPista--;
                }
            },
            aumentarValorSpinnerPuntosPista(){
                this.puntosPista++
            },
            editTipoPistaService(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true);
                const payload ={
                    id: this.tipoPistaToEdit.id,
                    puntosJuego: this.puntosJuego,
                    puntosPista: this.puntosPista,
                    tipo: this.tipoPistaToEdit.tipo
                };
                axios.post(URL_EDIT_TIPO_PISTA,payload,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                    this.$store.commit('setLoading',false);
                    this.dialogEdit=false;
                    this.getAllTipoPista();
                    this.puntosPista=0;
                    this.puntosJuego=0;
                }).catch(err=>{
                    console.log(err);
                    this.$store.commit('setLoading',false)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            deleteTypeClue(){
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_TIPO_PISTA,{
                    params:{
                        id:this.tipoPistaToDelete.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                    this.dialogDelete=false;
                    this.getAllTipoPista()
                }).catch(err=>{
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            cancelar(){
                this.puntosJuego=0;
                this.puntosPista=0
                this.typePistaName='';
                this.dialogEdit=false;
                this.dialogNewClueType=false;
            },
            deleteTipoPista(tipo){
                this.dialogDelete=true;
                this.tipoPistaToDelete=tipo;
            },
            getAllTipoPista(){
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_TIPO_PISTA,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.tipoPistaList=data;
                }).catch(err=>{
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            }
        },
        computed:{
            ...mapGetters(["loading"])
        },
        created() {
            this.getAllTipoPista();
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