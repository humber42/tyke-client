<template>
    <v-container>
        <v-card outlined elevation="10">
            <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
            </v-skeleton-loader>
            <v-data-table v-else :headers="headers"
            :items="groupsList"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="id"
            show-expand
            :search="search">
                <template v-slot:top>
                    <v-toolbar>
                        <v-toolbar-title>Listado de grupos</v-toolbar-title>
                        <v-spacer/>
                        <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                      hide-details></v-text-field>
                        <v-spacer/>
                        <v-switch v-model="singleExpand" label="Abrir uno solo" class="mt-5 mr-2"/>
                        <v-btn color="orange" dark @click="getAllGroups" class="mr-2">Refrescar</v-btn>
                        <v-btn color="primary" @click="annadirGrupo" dark>Añadir Grupo</v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:expanded-item="{headers,item}">
                    <td>
                        <h3 class="font-weight-regular">Curso: {{item.estudianteGruposById[0].cursoByIdCurso.curso}}</h3>
                    </td>
                    <td>
                        <h3 class="font-weight-regular">Cantidad de alumnos: {{item.estudianteGruposById.length}}</h3>
                    </td>
                </template>
                <template v-slot:item.actions="{item}">
                    <v-tooltip bottom>
                        <template v-slot:activator="{on,attrs}">
                            <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)" color="red">
                                delete
                            </v-icon>
                        </template>
                        <span>Eliminar grupo</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialogDeleteGrupo" max-width="500px">
            <v-card>
                <v-card-title>¿Desea eliminar este grupo?</v-card-title>
                <v-card-actions>
                    <v-flex class="text-center">
                        <v-btn color="success" class="mx-1" style="color: white!important;"
                               @click="deleteGrupoByID" :loading="loading" :disabled="loading"><span slot="loader" class="custom-loader">
                            <v-icon class="refresh"/>
                        </span>Confirmar
                        </v-btn>
                        <v-btn color="red" class="mx-1" style="color: white!important;"
                               @click="dialogDeleteGrupo=false">Cancelar
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'
    import axios from 'axios'
    import {URL_DELETE_GRUPO_BY_ID, URL_FETCH_ALL_GROUPS} from "../../urlResources";

    export default {
        name: "GrupoMainService",
        data(){
            return{
                headers:[
                    {text:"Grupo",value:"grupo",align:""},
                    {text:"Acciones",value: 'actions',align: 'center'}
                ],
                singleExpand:false,
                groupsList:[],
                expanded:[],
                dialogInsertarGrupo:false,
                dialogEditGrupo:false,
                dialogDeleteGrupo:false,
                search:'',
                grupoToDelete:''

            }
        },
        computed:{
            ...mapGetters(['loadingTable','loading'])
        },
        methods:{
            getAllGroups(){
                this.$store.commit('setLoadingTable', true);
                const token = localStorage.getItem('token')
                axios.get(URL_FETCH_ALL_GROUPS,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    this.$store.commit('setLoadingTable', false);
                    console.log(data);
                    this.groupsList =data;
                }).catch((err)=>{
                    this.$store.commit('setLoadingTable', false);
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            annadirGrupo(){
                this.$router.push("/new-group-service")
            },
            deleteGrupoByID(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true);
                axios.delete(URL_DELETE_GRUPO_BY_ID,{
                    params:{
                        id:this.grupoToDelete.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.$store.commit('setLoading',false);
                    console.log(data);
                    this.getAllGroups()
                    this.grupoToDelete=null;
                    this.dialogDeleteGrupo=false
                }).catch(err=>{
                    this.$store.commit('setLoading',false);
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })

            },
            deleteItem(item){
                this.grupoToDelete=item;
                this.dialogDeleteGrupo=true;
            }
        },
        created() {
            this.getAllGroups()
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