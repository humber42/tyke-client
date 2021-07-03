<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="rolesList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Listado de roles profesionales</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                              hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllProfessionalsRols" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-dialog v-model="dialogAddProfesionalRols" max-width="500px" persistent>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                            <v-icon dark left>add</v-icon>
                                            Añadir
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Agregar rol profesional</v-card-title>
                                            <v-form v-model="isFormNewRolProfesionalValid" lazy-validation ref="formNewGift"
                                                    @submit.prevent="saveRolProfesional">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Nombre"
                                                                      v-model="newRolProfesional.nombre"
                                                                      prepend-icon="text_fields"
                                                                      :rules="[desc=>!!desc||'El nombre es requerido']">
                                                        </v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="newRolProfesional.carrera"
                                                                :items="carreraList"
                                                                label="Carrera"
                                                                prepend-icon="school"
                                                                :rules="[asignatura=>!!asignatura||'La carrera es requerida']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="newRolProfesional.tema"
                                                                :items="temaList"
                                                                label="Tema"
                                                                prepend-icon="bookmark"
                                                                :rules="[asignatura=>!!asignatura||'El tema es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>

                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn class="mx-1" color="success"
                                                               style="color: white!important;" type="submit"
                                                               :loading="loading"
                                                               :disabled="!isFormNewRolProfesionalValid||loading">
                                                            <span slot="loader" class="custom-loader">
                                                            <v-icon>refresh</v-icon>
                                                        </span>Confirmar
                                                        </v-btn>
                                                        <v-btn @click="cancelar" class="mx-1" color="red"
                                                               style="color: white!important;">Cancelar
                                                        </v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>
                                <!--Dialog para eliminar-->
                                <v-dialog v-model="dialogDeleteRolProfesional" max-width="500px">
                                    <v-card>
                                        <v-card-title>¿Desea eliminar el rol profesional?</v-card-title>
                                        <v-card-actions>
                                            <v-flex class="text-center">
                                                <v-btn color="success" class="mx-1" style="color: white!important;"
                                                       @click="deleteRolProfesional" :disabled="loading" :loading="loading">
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
                                <span>Eliminar rol profesional</span>
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
    import axios from "axios"
    import {
        URL_DELETE_ROL_PROFESIONAL,
        URL_FETCH_ALL_ROL_PROFESIONAL,
        URL_FETCH_ALL_TEMAS, URL_GET_ALL_CAREERS,
        URL_SAVE_ROL_PROFESIONAL
    } from "../../urlResources";

    export default {
        name: "RolMainService",
        data:()=>{
            return{
                headers:[
                    {text:"Nombre",value:"nombre",align:"center"},
                    {text:"Carrera",value:"carrera.nombre",align:"center"},
                    {text:"Tema",value:"tema.nombre",align: 'center'},
                    {text:"Acciones",value: "actions",align: "center"}
                ],
                rolesList:[],
                search:'',
                dialogAddProfesionalRols:false,
                isFormNewRolProfesionalValid:true,
                newRolProfesional:{
                    nombre:'',
                    carrera:'',
                    tema:''
                },
                carreraList:[],
                carrerasListAllData:[],
                temaList:[],
                temaListAllData:[],
                dialogDeleteRolProfesional:false,
                rolProfesionalToDelete:null

            }
        },
        computed:{
            ...mapGetters(['loadingTable','loading'])
        },
        methods:{
            getAllProfessionalsRols(){
                const token = localStorage.getItem("token");
                this.$store.commit('setLoadingTable',true)
                axios.get(URL_FETCH_ALL_ROL_PROFESIONAL,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    console.log(data)
                    this.rolesList=data;
                    this.$store.commit('setLoadingTable',false)
                }).catch(err=>{
                    console.log(err)
                    this.$store.commit('setLoadingTable',false);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })

            },
            saveRolProfesional(){
                if(this.$refs.formNewGift.validate()) {
                    const token = localStorage.getItem("token");
                    this.$store.commit('setLoading', true)
                    let idCarrera = this.obtenerIdCarrera();
                    let idTema = this.obtenerIdTema();
                    const payload = {
                        idCarrera: idCarrera,
                        idTema: idTema,
                        nombre: this.newRolProfesional.nombre
                    }
                    axios.post(URL_SAVE_ROL_PROFESIONAL, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        },
                    }).then(({data}) => {
                        this.rolesList.push(data);
                        this.dialogAddProfesionalRols = false;
                        this.$store.commit('setLoading', false);
                        this.$refs.formNewGift.reset();
                    }).catch(err => {
                        console.log(err);
                        this.$store.commit('setLoading', false);
                        if(err.response.status===403){
                            this.$router.push("/403");
                        }
                    })
                }
            },
            cancelar(){
                this.dialogAddProfesionalRols=false;
                this.dialogDeleteRolProfesional=false;
                this.$refs.formNewGift.reset();
            },
            deleteRolProfesional(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true)
                axios.delete(URL_DELETE_ROL_PROFESIONAL,{
                    params:{
                        id:this.rolProfesionalToDelete.idRolProfesional
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(()=>{
                    this.dialogDeleteRolProfesional=false;
                    this.$store.commit('setLoading',false)
                    this.getAllProfessionalsRols();
                }).catch(err=>{
                    this.$store.commit('setLoading',false);
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            deleteItem(item){
                console.log(item)
                this.rolProfesionalToDelete=item;
                this.dialogDeleteRolProfesional=true;
            },

            obtenerIdCarrera(){
                let idCarrera=0;
                let i = 0;
                let found =false;
                while(i<this.carrerasListAllData.length&&!found){
                    if(this.carrerasListAllData[i].nombre===this.newRolProfesional.carrera){
                        idCarrera= this.carrerasListAllData[i].id;
                        found=true;
                    }
                    i++;
                }
                return idCarrera;
            },
            obtenerIdTema(){
                let idTema=0;
                let i = 0;
                let found =false;
                while(i<this.temaListAllData.length&&!found){
                    if(this.temaListAllData[i].nombre===this.newRolProfesional.tema){
                        idTema= this.temaListAllData[i].id;
                        found=true;
                    }
                    i++;
                }
                return idTema;
            },
            getAllTemas(){
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_TEMAS,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    this.temaListAllData=data;
                    let i =0;
                    while(i<data.length){
                        this.temaList.push(data[i].nombre)
                        i++;
                    }
                }).catch(err=>{
                    console.log(err);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            getAllCareers(){
                const token = localStorage.getItem('token');
                axios.get(URL_GET_ALL_CAREERS,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    this.carrerasListAllData=data;
                    let i =0;
                    while(i<data.length){
                        this.carreraList.push(data[i].nombre)
                        i++;
                    }
                }).catch(err=>{
                    console.log(err);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            }

        },
        created() {
            this.getAllCareers();
            this.getAllTemas();
            this.getAllProfessionalsRols();
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