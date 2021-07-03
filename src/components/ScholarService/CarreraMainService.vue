<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="carrerasList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:item.facultad="{item}">
                            {{getFacultyName(item)}}
                        </template>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Lista de carrerras</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                              hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllCareers" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-dialog v-model="dialogInsertarCarrera" max-width="450px" persistent>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn color="primary" dark class="mb-2" @click="getFacultyList" v-bind="attrs" v-on="on">
                                            <v-icon dark left>add</v-icon>
                                            Nueva Carrera
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Añadir Carrera</v-card-title>
                                            <v-form lazy-validation v-model="isFormInsertarValid"
                                                    ref="insertFormAsignatura" @submit.prevent="saveCarrera">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="selectFaculty"
                                                                :items="itemsFacultyList"
                                                                label="Facultad"
                                                                placeholder="Seleccione la Facultad"
                                                                prepend-icon="apartment"
                                                                :rules="facultadRules"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="carreraName"
                                                                      :rules="carreraNameRules"
                                                                      prepend-icon="school" label="Nombre"
                                                                      aria-required="true" aria-autocomplete="list"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="carreraSiglas"
                                                                      :rules="carreraSiglasRules"
                                                                      prepend-icon="text_fields" label="Siglas"
                                                                      aria-autocomplete="list" aria-required="true"/>
                                                    </v-flex>
                                                </v-layout>

                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn type="submit" class="mx-1" color="primary"
                                                               style="color: white!important;"
                                                               :disabled="!isFormInsertarValid||loading"
                                                               :loading="loading">
                                                            <span slot="loader" class="custom-loader">
                                                                <v-icon>refresh</v-icon>
                                                            </span>
                                                            Confirmar
                                                        </v-btn>
                                                        <v-btn class="mx-1" color="red" style="color: white!important;"
                                                               @click="cancelar">Cancelar
                                                        </v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>
                                <!--Dialog para eliminar-->
                                <v-dialog v-model="dialogDeleteCarrera" max-width="500px">
                                    <v-card>
                                        <v-card-title>¿Desea eliminar esta carrera?</v-card-title>
                                        <v-card-actions>
                                            <v-flex class="text-center">
                                                <v-btn color="success" class="mx-1" style="color: white!important;"
                                                       @click="deleteCarrera">Confirmar
                                                </v-btn>
                                                <v-btn color="red" class="mx-1" style="color: white!important;"
                                                       @click="cancelar">Cancelar
                                                </v-btn>
                                            </v-flex>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="dialogEditCarrera" max-width="400px" persistent>

                                    <v-card>
                                        <v-container>
                                            <v-card-title>Editar carrera</v-card-title>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox
                                                            v-model="facultadEditCareer"
                                                            :items="itemsFacultyList"
                                                            label="Facultad"
                                                            placeholder="Seleccione la Facultad"
                                                            prepend-icon="apartment"
                                                            :rules="facultadRules"
                                                    ></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field v-model="nameEditCareer"
                                                                  :rules="carreraNameRules"
                                                                  prepend-icon="school" label="Nombre"
                                                                  aria-required="true" aria-autocomplete="list"/>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field v-model="siglasEditCareer"
                                                                  :rules="carreraSiglasRules"
                                                                  prepend-icon="text_fields" label="Siglas"
                                                                  aria-autocomplete="list" aria-required="true"/>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex class="text-right">
                                                    <v-btn class="mx-1" color="orange" style="color: white!important;"
                                                           @click="editCarrera">Editar
                                                    </v-btn>
                                                    <v-btn class="mx-1" color="red" style="color: white!important;"
                                                           @click="cancelar">Cancelar
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>

                        <template v-slot:item.actions="{item}">
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"
                                            color="orange">
                                        edit
                                    </v-icon>
                                </template>
                                <span>Editar carrera</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)" color="red">
                                        delete
                                    </v-icon>
                                </template>
                                <span>Eliminar carrera</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from 'vuex'
    import {
        URL_DELETE_CAREER,
        URL_GET_ALL_CAREERS,
        URL_GET_ALL_FACULTIES,
        URL_SAVE_CAREER,
        URL_UPDATE_CAREER
    } from "../../urlResources";

    export default {
        name: "CarreraMainService",
        data() {
            return {
                carrerasList: [],
                carreraToDelete: null,
                carreraToEdit: null,
                headers: [
                    {text: "Nombre", value: "nombre", align: "center"},
                    {text: "Siglas", value: "siglas", align: "center"},
                    {text: "Facultad", value: "facultad", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"}
                ],
                search: '',
                isFormInsertarValid: true,
                carreraName: '',
                carreraSiglas: '',
                carreraFacultyInt: [],
                carreraNameRules: [
                    carrera => !!carrera || "El nombre de la carrera es requerida"
                ],
                carreraSiglasRules: [
                    siglas => !!siglas || "Las siglas son requeridas"
                ],
                facultadRules: [
                    facultad => !!facultad || "La facultad es requerida"
                ],
                dialogInsertarCarrera: false,
                dialogEditCarrera: false,
                dialogDeleteCarrera: false,
                selectFaculty: '',
                itemsFacultyList: [],
                nameEditCareer: '',
                siglasEditCareer: '',
                facultadEditCareer: ''
            }
        },
        computed: {
            ...mapGetters(['loadingTable', 'loading'])
        },
        methods: {
            getAllCareers() {
                this.$store.commit('setLoadingTable', true)
                const token = localStorage.getItem('token');
                axios.get(URL_GET_ALL_CAREERS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.$store.commit('setLoadingTable', false);
                    this.carrerasList = data;
                }).catch(err => {
                    console.log(err)
                    this.$store.commit('setLoadingTable', false)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            getFacultyName(item) {
                return item.facultad.facultad
            },
            editItem(item) {
                this.carreraToEdit = item;
                this.dialogEditCarrera = true;
                this.nameEditCareer = item.nombre;
                this.siglasEditCareer = item.siglas;
                this.facultadEditCareer = item.facultad.facultad;
                console.log(item)
            },
            deleteItem(item) {
                this.carreraToDelete = item;
                this.dialogDeleteCarrera = true;
                console.log(item)
            },
            saveCarrera() {
                if(this.$refs.insertFormAsignatura.validate()) {
                    this.$store.commit('setLoading', true)
                    const payload = {
                        facultad: this.selectFaculty,
                        siglas: this.carreraSiglas,
                        nombre: this.carreraName
                    }
                    const token = localStorage.getItem('token');
                    axios.post(URL_SAVE_CAREER, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.$store.commit('setLoading', false)
                        this.carrerasList.push(data);
                        this.dialogInsertarCarrera = false;
                        this.selectFaculty = [];
                        this.carreraName = '';
                        this.carreraSiglas = '';
                        this.$refs.insertFormAsignatura.reset();
                    }).catch(err => {
                        console.log(err)
                        this.$store.commit('setLoading', false);
                        if(err.response.status===403){
                            this.$router.push("/403");
                        }
                    })
                }

            },
            editCarrera() {
                const token = localStorage.getItem('token');
                const carrera={
                    facultad:{
                        facultad:this.facultadEditCareer
                    },
                    nombre:this.nameEditCareer,
                    siglas:this.siglasEditCareer
                }
                axios.post(URL_UPDATE_CAREER,carrera,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.getAllCareers()
                    this.dialogEditCarrera = false;
                    this.nameEditCareer = '';
                    this.siglasEditCareer = '';
                    this.facultadEditCareer = ''
                    console.log(data)
                }).catch((err)=>{
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            deleteCarrera() {
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_CAREER, {
                    params: {
                        id: this.carreraToDelete.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.carrerasList = this.getAllCareers();
                    this.dialogDeleteCarrera = false;
                    this.carreraToDelete = null;
                }).catch(err => {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            getFacultyList() {
                const token = localStorage.getItem('token');
                axios.get(URL_GET_ALL_FACULTIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data)
                    let i = 0;
                    while (i < data.length) {
                        this.itemsFacultyList.push(data[i].facultad);
                        i++;
                    }
                }).catch(err => {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            cancelar() {
                this.dialogDeleteCarrera = false;
                this.carreraToDelete = null;
                this.dialogInsertarCarrera = false;
                this.selectFaculty = '';
                this.carreraName = '';
                this.carreraSiglas = '';
                this.dialogEditCarrera = false;
                this.nameEditCareer = '';
                this.siglasEditCareer = '';
                this.facultadEditCareer = ''
                this.$refs.insertFormAsignatura.reset();
            }

        },
        created() {
            this.getAllCareers();
            this.getFacultyList();
        },

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