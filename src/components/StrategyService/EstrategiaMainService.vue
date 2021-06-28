<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="estrategiasList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Listado de estrategias</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                              hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllEstrategias" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-btn v-if="!isStudent" @click="createEstrategia" color="success" class="mb-2 mr-1" dark>
                                    <v-icon class="add" dark/>
                                    Nueva
                                </v-btn>

                                <!--Dialog para eliminar-->
                                <v-dialog v-model="dialogDeleteEstrategia" max-width="500px">
                                    <v-card>
                                        <v-card-title>¿Desea eliminar la estrategia?</v-card-title>
                                        <v-card-actions>
                                            <v-flex class="text-center">
                                                <v-btn color="success" class="mx-1" style="color: white!important;"
                                                       @click="deleteEstrategia" :disabled="loading" :loading="loading">
                                                    <span slot="loader" class="custom-loader"><v-icon>refresh</v-icon></span>Confirmar
                                                </v-btn>
                                                <v-btn color="red" class="mx-1" style="color: white!important;"
                                                       @click="cancelar">Cancelar
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
                                <span>Eliminar la estrategia</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from "vuex";
    import axios from "axios";
    import {URL_ESTRATEGIA_DELETE, URL_FETCH_ALL_STRATEGY} from "../../urlResources";

    export default {
        name: "EstrategiaMainService",
        data:()=>{
            return{
                headers:[
                    {text:"Nombre",value:"nombre",align:"center"},
                    {text:"Puntos",value:"puntos",align: "center"},
                    {text:"Creador",value:"profesor.usuario.fullname"},
                    {text:"Cantidad de temas",value: "temas.length",align: "center"},
                    {text:"Cantidad de preguntas",value: "estrategiaPreguntasByIdEstrategia.length",align: "center"},
                    {text:"Acciones",value: "actions",align: "center"}
                ],
                search:'',
                dialogDeleteEstrategia:false,
                estrategiaToDelete:null,
                estrategiasList:[],
                isStudent:false
            }
        },
        methods:{
            getAllEstrategias(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoadingTable',true);
                axios.get(URL_FETCH_ALL_STRATEGY,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    this.estrategiasList=data;
                    this.$store.commit('setLoadingTable',false);
                }).catch(err=>{
                    console.log(err);
                    this.$store.commit('setLoadingTable',false);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            createEstrategia(){
                this.$router.push("/new-strategy");
            },
            deleteEstrategia(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true);
                axios.delete(URL_ESTRATEGIA_DELETE,{
                    params:{
                        id:this.estrategiaToDelete.idEstrategia
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(()=>{
                    this.$store.commit('setLoading',false);
                    this.dialogDeleteEstrategia=false;
                    this.getAllEstrategias();
                }).catch(err=>{
                    console.log(err)
                    this.$store.commit('setLoading',false);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })

            },
            cancelar(){
                this.dialogDeleteEstrategia=false;
            },
            deleteItem(item){
                this.dialogDeleteEstrategia=true;
                this.estrategiaToDelete=item;
            },
            isUserStudent(){
                let i = 0;
                let found=false;
                while(i<this.user.roles.length&&!found){
                    if(this.user.roles[i].roleName==="Estudiante"){
                        found=true;
                        this.isStudent =true;
                    }
                    i++;
                }
                return !found;
            }
        },
        computed:{
            ...mapGetters(['loadingTable',"loading","user"])
        },
       created() {
            this.getAllEstrategias();
           this.isUserStudent();
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