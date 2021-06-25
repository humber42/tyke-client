<template>
    <v-container>
        <notification :icon="iconSnack" :info-alert="snackInfo" :type-alert="snackAlertType"
                      :show-snack="showSnackNotification"></notification>
        <v-dialog v-model="dialogNewTypeQuestion" persistent max-width="500px">
            <v-card>
                <v-card-title>Nuevo Tipo de pregunta</v-card-title>
                <v-container>
                    <v-form v-model="isFormNewQuestionTypeValid" lazy-validation ref="newTypeQuestionForm" @submit.prevent="saveTypeQuestion">
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field label="Tipo de pregunta" v-model="typeQuestionName" prepend-icon="text_fields"
                                              :rules="typeNameRules"
                                              aria-autocomplete="list" aria-required="true"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12 class="text-right">
                                <v-btn color="blue" type="submit" style="color: white!important;" class="mx-1"
                                       :disabled="!isFormNewQuestionTypeValid||loading" :loading="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon>refresh</v-icon>
                                    </span>
                                    Confirmar
                                </v-btn>
                                <v-btn color="red" style="color: white!important;" class="mx-1"
                                       @click="dialogNewTypeQuestion=false">Cancelar
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-container>
            </v-card>

        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="400px">
            <v-card>
                <v-card-title class="font-weight-light">¿Está seguro que desea eliminar el tipo de pregunta?</v-card-title>
                <v-card-actions>
                    <v-flex class="text-center">
                        <v-btn class="mx-1" color="success" @click="deleteTypeQuestion">Confirmar</v-btn>
                        <v-btn class="mx-1" color="error" @click="dialogDelete=false">Cancelar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col cols="9">
                <h2 class="font-weight-light mb-3">Tipo de pregunta</h2>
            </v-col>
            <v-col cols="3">
                <v-flex class="text-right">
                    <v-btn color="blue" outlined dark elevation="3" @click="dialogNewTypeQuestion=true">
                        <v-icon>add</v-icon>
                        Añadir
                    </v-btn>
                </v-flex>
            </v-col>
        </v-row>

        <v-row class="mt-3">
            <v-col v-for="tipo in tipoPreguntasList" :key="tipo.id" cols="3">
                <v-card hover outlined shaped class="mx-1 my-1" style="cursor: default">
                    <div style="background-color: #3f9655">
                        <v-card-title style="color: white">Tipo de pregunta</v-card-title>
                    </div>

                    <v-divider/>
                    <h2 class="ml-4 font-weight-regular">{{tipo.tipo}}</h2>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-btn icon @click="deleteTipoPregunta(tipo)" v-bind="attrs" v-on="on">
                                        <v-icon color="red">delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Eliminar tipo de pregunta</span>
                            </v-tooltip>
                        </v-flex>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import axios from 'axios';
    import {URL_DELETE_TIPO_PREGUNTA, URL_FETCH_ALL_TIPO_PREGUNTA, URL_SAVE_TIPO_PREGUNTA} from "../../urlResources";
    export default {
        name: "QuestionTypeService",
        data(){
            return{
                iconSnack:'',
                snackInfo:'',
                snackAlertType:'',
                showSnackNotification:false,
                isFormNewQuestionTypeValid:false,
                typeQuestionName:'',
                typeNameRules:[
                    tipoRules=>!!tipoRules||"El tipo de pregunta es requerido"
                ],
                dialogNewTypeQuestion:false,
                dialogDelete:false,
                tipoPreguntasList:[],
                elementToDelete:null
            }
        },
        methods:{
            saveTypeQuestion(){
                if(this.$refs.newTypeQuestionForm.validate()){
                    this.$store.commit('setLoading',true);
                    const payload ={
                        tipo:this.typeQuestionName
                    }
                    const token = localStorage.getItem('token');
                    axios.post(URL_SAVE_TIPO_PREGUNTA,payload,{
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data})=>{
                        this.tipoPreguntasList.push(data);
                        this.$store.commit('setLoading',false);
                        this.dialogNewTypeQuestion=false;
                        this.$refs.newTypeQuestionForm.reset()
                    }).catch(err=>{
                        console.log(err);
                        this.$store.commit('setLoading',false);
                    })
                }
            },
            deleteTypeQuestion(){
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_TIPO_PREGUNTA,{
                    params:{
                        id: this.elementToDelete.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data);
                    this.getAllTypeQuestion();
                    this.dialogDelete=false;
                }).catch(err=>{
                    console.log(err);
                })
            },
            deleteTipoPregunta(rol){
                console.log(rol);
                this.elementToDelete=rol;
                this.dialogDelete=true;
            },
            getAllTypeQuestion(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true);
                axios.get(URL_FETCH_ALL_TIPO_PREGUNTA,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.tipoPreguntasList=data;
                    this.$store.commit('setLoading',false);
                }).catch(err=>{
                    console.log(err);
                    this.$store.commit('setLoading',false);
                })
            }

        },
        computed:{
            ...mapGetters(['loading'])
        },
        created() {
            this.getAllTypeQuestion();
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