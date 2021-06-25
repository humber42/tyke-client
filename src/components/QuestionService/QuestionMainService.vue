<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="preguntasList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Listado de preguntas</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                              hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllQuestions" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-btn color="success" @click="insertarPregunta" class="mb-2 mr-1" dark>Nueva pregunta</v-btn>
                                <!--Dialog para eliminar-->
                                <v-dialog v-model="dialogDeletePregunta" max-width="500px">
                                    <v-card>
                                        <v-card-title>¿Desea eliminar esta pregunta?</v-card-title>
                                        <v-card-actions>
                                            <v-flex class="text-center">
                                                <v-btn color="success" class="mx-1" style="color: white!important;"
                                                       @click="deletePregunta" :disabled="loading" :loading="loading">
                                                    <span slot="loader" class="custom-loader"><v-icon>refresh</v-icon></span>Confirmar
                                                </v-btn>
                                                <v-btn color="red" class="mx-1" style="color: white!important;"
                                                       @click="dialogDeletePregunta=false">Cancelar
                                                </v-btn>
                                            </v-flex>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                            </v-toolbar>
                        </template>

                        <template v-slot:item.actions="{item}">
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)" color="red">
                                        delete
                                    </v-icon>
                                </template>
                                <span>Eliminar pregunta</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import axios from "axios";
    import {URL_DELETE_QUESTION, URL_FETCH_ALL_QUESTIONS} from "../../urlResources";
    export default {
        name: "QuestionMainService",
        data(){
            return{
                headers:[
                    {text:"Titulo",value:"tituloPregunta",align:"center"},
                    {text:"Asignatura",value: "asignaturaObject.nombre",align: "center"},
                    {text:"Cantidad de respuestas",value:"respuestasById.length",align: "center"},
                    {text:"Puntuación",value:"cantPuntosCompletarCorrectamente",align:"center"},
                    {text: "Cantidad de pistas",value: "pistasById.length",align: "center"},
                    {text:"Tiempo para responder",value: "tiempoEnSegundos",align: "center"},
                    {text:"Acciones",value: "actions",align: "center"}
                ],
                preguntasList:[],
                search:'',
                dialogDeletePregunta:false,
                dialogEditPregunta:false,

                preguntaToDelete:null

            }
        },
        computed:{
            ...mapGetters(['loading','loadingTable'])
        },
        methods:{
            getAllQuestions(){
                this.$store.commit('setLoadingTable',true);
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_QUESTIONS,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data)
                    this.preguntasList=data;
                    this.$store.commit('setLoadingTable',false);
                }).catch((err)=>{
                    console.log(err)
                    this.$store.commit('setLoadingTable',false);
                });
            },
            insertarPregunta(){
                this.$router.push("/question-new-service")
            },
            deletePregunta(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true);
                axios.delete(URL_DELETE_QUESTION,{
                    params:{
                        id:this.preguntaToDelete.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                    this.$store.commit('setLoading',false);
                    this.dialogDeletePregunta=false;
                    this.getAllQuestions()
                }).catch(err=> {
                    this.$store.commit('setLoading',true);
                    console.log(err)
                })
            },
            cancelar(){

            },
            deleteItem(item){
                this.preguntaToDelete=item;
                this.dialogDeletePregunta=true;
            }
        },
        created() {
            this.getAllQuestions();
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