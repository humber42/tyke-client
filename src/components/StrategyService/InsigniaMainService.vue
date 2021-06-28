<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="insigniasList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Listado de insignias</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                              hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllInsignias" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-dialog v-model="dialogAddInsignia" max-width="500px" persistent>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                            <v-icon dark left>add</v-icon>
                                            Añadir
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Agregar insignia</v-card-title>
                                            <v-form v-model="isFormNewInsigniaValid" lazy-validation ref="formNewInsignia"
                                                    @submit.prevent="saveInsignia">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Nombre"
                                                                      v-model="newInsignia.nombre"
                                                                      prepend-icon="text_fields"
                                                                      :rules="[desc=>!!desc||'El nombre es requerido']">
                                                        </v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="newInsignia.rol"
                                                                :items="rolesList"
                                                                label="Rol profesional"
                                                                prepend-icon="work"
                                                                :rules="[asignatura=>!!asignatura||'El rol profesional es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1 mt-5">
                                                    <v-flex xs12>
                                                        <v-slider v-model="newInsignia.puntosAvance"
                                                        label="Puntos de Avance" hint="Cantidad de puntos" thumb-label="always" :rules="[rule=>rule>0||'Los puntos de avance deben ser mayor que cero']">
                                                        </v-slider>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1 mt-5">
                                                    <v-flex xs12>
                                                        <v-slider v-model="newInsignia.puntosOtorgar"
                                                                  label="Puntos a otorgar" hint="Cantidad de puntos" thumb-label="always" :rules="[rule=>rule>0||'Los puntos a otorgar deben ser mayor que cero']">
                                                        </v-slider>
                                                    </v-flex>
                                                </v-layout>

                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn class="mx-1" color="success"
                                                               style="color: white!important;" type="submit"
                                                               :loading="loading"
                                                               :disabled="!isFormNewInsigniaValid||loading">
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
                                <v-dialog v-model="dialogEditInsignia" persistent max-width="500px">
                                    <v-card>
                                        <v-container>
                                            <v-card-title v-if="insigniaToEdit!==null">Editar insignia: {{insigniaToEdit.nombre}}</v-card-title>
                                            <v-form v-model="isFormEditInsigniaValid" lazy-validation ref="formEditInsignia"
                                            @submit.prevent="editarInsignia"
                                            >
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="editInsignia.rol"
                                                                :items="rolesList"
                                                                label="Rol profesional"
                                                                prepend-icon="work"
                                                                :rules="[asignatura=>!!asignatura||'El rol profesional es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1 mt-5">
                                                    <v-flex xs12>
                                                        <v-slider v-model="editInsignia.puntosAvance"
                                                                  label="Puntos de Avance" hint="Cantidad de puntos" thumb-label="always" :rules="[rule=>rule>0||'Los puntos de avance deben ser mayor que cero']">
                                                        </v-slider>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1 mt-5">
                                                    <v-flex xs12>
                                                        <v-slider v-model="editInsignia.puntosOtorgar"
                                                                  label="Puntos a otorgar" hint="Cantidad de puntos" thumb-label="always" :rules="[rule=>rule>0||'Los puntos a otorgar deben ser mayor que cero']">
                                                        </v-slider>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn class="mx-1" color="success"
                                                               style="color: white!important;" type="submit"
                                                               :loading="loading"
                                                               :disabled="!isFormEditInsigniaValid||loading">
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
                                <v-dialog v-model="dialogDeleteInsignia" max-width="500px">
                                    <v-card>
                                        <v-card-title>¿Desea eliminar la insignia?</v-card-title>
                                        <v-card-actions>
                                            <v-flex class="text-center">
                                                <v-btn color="success" class="mx-1" style="color: white!important;"
                                                       @click="deleteInsignia" :disabled="loading" :loading="loading">
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
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)" color="orange">
                                        edit
                                    </v-icon>
                                </template>
                                <span>Editar la insignia</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)" color="red">
                                        delete
                                    </v-icon>
                                </template>
                                <span>Eliminar la insignia</span>
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
    import {
        URL_DELETE_INSIGNIA, URL_EDIT_INSIGNIA,
        URL_FETCH_ALL_INSIGNIA,
        URL_FETCH_ALL_ROL_PROFESIONAL,
        URL_SAVE_INSIGNIA,

    } from "../../urlResources";

    export default {
        name: "InsigniaMainService",
        data(){
            return{
                headers:[
                    {text:"Nombre",value:"nombre",align:"center"},
                    {text:"Rol profesional",value:"rolProfesional.nombre",align:"center"},
                    {text:"Puntos a otorgar",value:"puntosOtorgar",align:"center"},
                    {text:"Puntos de avance",value:"puntosAvance",align:"center"},
                    {text:"Acciones",value:"actions",align:"center"},
                ],
                insigniasList:[],
                dialogAddInsignia: false,
                search:"",
                isFormNewInsigniaValid:true,
                newInsignia:{
                    rol:'',
                    nombre:'',
                    puntosAvance:0,
                    puntosOtorgar:0
                },
                editInsignia:{
                    rol:'',
                    puntosAvance:0,
                    puntosOtorgar:0
                },
                dialogDeleteInsignia:false,
                dialogEditInsignia:false,
                rolesList:[],
                roleListAllData:[],
                insigniaToDelete:null,
                insigniaToEdit:null,
                isFormEditInsigniaValid:true
            }
        },
        computed:{
            ...mapGetters(['loading',"loadingTable"])
        },
        methods:{
            getAllInsignias(){
                const token = localStorage.getItem("token");
                this.$store.commit('setLoadingTable',true)
                axios.get(URL_FETCH_ALL_INSIGNIA,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    console.log(data)
                    this.insigniasList=data;
                    this.$store.commit('setLoadingTable',false)
                }).catch(err=>{
                    console.log(err)
                    this.$store.commit('setLoadingTable',false);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            saveInsignia(){
                if(this.$refs.formNewInsignia.validate()) {
                    const token = localStorage.getItem("token");
                    this.$store.commit('setLoading', true)
                    let idRol = this.obtenerIdRol(this.newInsignia.rol);
                    const payload = {
                        idRolProfesional: idRol,
                        nombre: this.newInsignia.nombre,
                        puntosAvance: this.newInsignia.puntosAvance,
                        puntosOtorgar: this.newInsignia.puntosOtorgar
                    }
                    console.log(payload);
                    axios.post(URL_SAVE_INSIGNIA, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        },
                    }).then(() => {
                        this.getAllInsignias()
                        this.dialogAddInsignia = false;
                        this.$store.commit('setLoading', false);
                        this.$refs.formNewInsignia.reset();
                    }).catch(err => {
                        console.log(err);
                        this.$store.commit('setLoading', false);
                        if(err.response.status===403){
                            this.$router.push("/403");
                        }
                    })
                }
            },
            deleteInsignia(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true)
                axios.delete(URL_DELETE_INSIGNIA,{
                    params:{
                        id:this.insigniaToDelete.idInsignia
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(()=>{
                    this.dialogDeleteInsignia=false;
                    this.$store.commit('setLoading',false)
                    this.getAllInsignias();
                }).catch(err=>{
                    this.$store.commit('setLoading',false);
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            cancelar(){
                this.dialogAddInsignia=false;
                this.dialogDeleteInsignia=false;
                this.$refs.formNewInsignia.reset();
            },
            deleteItem(item){
                this.insigniaToDelete = item;
                this.dialogDeleteInsignia=true;
            },
            editItem(item){
                this.insigniaToEdit=item;
                this.editInsignia.rol = item.rolProfesional.nombre;
                this.editInsignia.puntosAvance = item.puntosAvance;
                this.editInsignia.puntosOtorgar= item.puntosOtorgar;
                this.dialogEditInsignia=true
                console.log(item)
            },
            getAllRolsList(){
                const token = localStorage.getItem("token");
                axios.get(URL_FETCH_ALL_ROL_PROFESIONAL,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    this.roleListAllData=data;
                    let i = 0;
                    while(i<data.length){
                        this.rolesList.push(data[i].nombre)
                        i++;
                    }
                }).catch(err=>{
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            obtenerIdRol(rol){
                let idRol=0;
                let i = 0;
                let found =false;
                while(i<this.roleListAllData.length&&!found){
                    if(this.roleListAllData[i].nombre===rol){
                        idRol= this.roleListAllData[i].idRolProfesional;
                        found=true;
                    }
                    i++;
                }
                console.log(idRol)
                return idRol;
            },
            editarInsignia(){
                if(this.$refs.formEditInsignia.validate()) {
                    const token = localStorage.getItem("token");
                    this.$store.commit('setLoading', true)
                    let idRol = this.obtenerIdRol(this.editInsignia.rol);
                    const payload = {
                        idInsignia: this.insigniaToEdit.idInsignia,
                        nombre: this.insigniaToEdit.nombre,
                        puntosAvance: this.editInsignia.puntosAvance,
                        puntosOtorgar: this.editInsignia.puntosOtorgar,
                        rolProfesional: {
                            idRolProfesional: idRol,
                        }
                    }
                    console.log(payload);
                    axios.post(URL_EDIT_INSIGNIA, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        },
                    }).then(() => {
                        this.getAllInsignias()
                        this.dialogEditInsignia = false;
                        this.$store.commit('setLoading', false);
                        this.$refs.formEditInsignia.reset();
                    }).catch(err => {
                        console.log(err);
                        this.$store.commit('setLoading', false);
                        if(err.response.status===403){
                            this.$router.push("/403");
                        }
                    })
                }
            }

        },
        created() {
            this.getAllRolsList();
            this.getAllInsignias();
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