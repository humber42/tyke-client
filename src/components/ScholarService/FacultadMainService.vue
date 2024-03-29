<template>
    <v-container>
        <notification :icon="iconSnack" :info-alert="snackInfo" :type-alert="snackAlertType"
                      :show-snack="showSnackNotification"></notification>
        <v-dialog v-model="dialogNewFaculty" persistent max-width="400">
            <v-card>
                <v-container>
                    <v-card-title>{{this.textCardSaveOrEdit}}</v-card-title>
                    <v-form v-model="isFormNewValid" lazy-validation ref="formNewFaculty" @submit.prevent="saveFaculty">
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field prepend-icon="apartment" label="Nombre" v-model="facultadNameNew"
                                              :rules="facultadNameRules"
                                              aria-required="true" aria-autocomplete="list"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field prepend-icon="text_fields" label="Siglas" v-model="facultadSiglasNew"
                                              :rules="facultadSiglasRules"
                                              aria-required="true" aria-autocomplete="list"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-file-input accept="image/*" label="Imagen" v-model="file">
                                </v-file-input>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12 class="text-right">
                                <v-btn color="success" class="mx-1" style="color: white!important;" type="submit"
                                       :disabled="!isFormNewValid||loading" :loading="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon>refresh</v-icon>
                                    </span>Confirmar
                                </v-btn>
                                <v-btn color="error" class="mx-1" style="color: white!important;" @click="cancelar">
                                    Cancelar
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" persistent max-width="400px">
            <v-card>
                <v-card-title class="font-weight-light">¿Desea eliminar esta facultad?</v-card-title>
                <v-card-actions>
                    <v-flex class="text-center">
                        <v-btn class="mx-1" color="success" @click="deleteFaculty">Confirmar</v-btn>
                        <v-btn class="mx-1" color="error" @click="dialogDelete=false">Cancelar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-row>
            <v-col cols="9">
                <h1>Facultades</h1>
            </v-col>
            <v-col cols="3">
                <v-btn outlined color="blue" @click="dialogNewFaculty=true">
                    <v-icon>add</v-icon>
                    Añadir
                </v-btn>
            </v-col>
        </v-row>
        <v-container>
            <v-row v-if="loadingTable">
                <v-col cols="4">
                    <v-skeleton-loader v-bind="attrs" type="card-avatar, article, actions"></v-skeleton-loader>
                </v-col>
                <v-col cols="4">
                    <v-skeleton-loader v-bind="attrs" type="card-avatar, article, actions"></v-skeleton-loader>
                </v-col>
                <v-col cols="4">
                    <v-skeleton-loader v-bind="attrs" type="card-avatar, article, actions"></v-skeleton-loader>
                </v-col>
                <v-col cols="4">
                    <v-skeleton-loader v-bind="attrs" type="card-avatar, article, actions"></v-skeleton-loader>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="3" v-for="faculty in facultiesList" :key="faculty.id">
                    <v-card outlined hover shaped style="cursor: default!important;">
                        <v-img :src="faculty.imagen" aspect-ratio="1.2" height="200" contain></v-img>
                        <v-divider/>
                        <div style="background-color: #8dcf9c">
                            <v-card-title class="font-weight-regular">
                                <v-icon class="apartment"/>
                                {{faculty.facultad}}
                            </v-card-title>
                            <v-card-subtitle style="color:black;">Siglas: {{faculty.siglas}}</v-card-subtitle>
                            <h4 class="font-weight-light ml-4" v-if="(!(faculty.carrerasById.length===0))">Carreras</h4>
                            <div v-for="career in faculty.carrerasById" :key="career.id" class="ml-4">
                                <h4>
                                    <v-icon class="school"/>
                                    {{career.nombre}}
                                </h4>
                            </div>

                        <v-card-actions>
                            <v-flex class="text-right">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn icon color="orange" @click="openDialogEdit(faculty)" v-bind="attrs"
                                               v-on="on">
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Editar facultad</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn icon color="red" @click="deleteDialogOpen(faculty)" v-bind="attrs"
                                               v-on="on">
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Eliminar facultad</span>
                                </v-tooltip>
                            </v-flex>
                        </v-card-actions>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>


    </v-container>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from 'vuex'

    import {
        URL_DELETE_FACULTY,
        URL_GET_ALL_FACULTIES,
        URL_POST_IMAGE,
        URL_SAVE_FACULTY,
        URL_UPDATE_FACULTY
    } from "../../urlResources";
    import Notification from "../utils/Notification";

    export default {
        name: "FacultadMainService",
        components: {Notification},
        data() {
            return {
                facultiesList: [],
                attrs: {
                    class: 'mb-6',
                    boilerplate: true,
                    elevation: 2,
                },
                dialogNewFaculty: false,
                dialogEditFaculty: false,
                isFormNewValid: true,
                facultadNameNew: '',
                facultadSiglasNew: '',
                facultadNameRules: [
                    facultadName => !!facultadName || "El nombre de la facultad es requerida",
                    facultadName => facultadName.length > 3 || "El nombre de la facultad debe ser mayor de tres caracteres"
                ],
                facultadSiglasRules: [
                    facultadSiglas => !!facultadSiglas || "Las siglas son requeridas",
                    facultadSiglas => facultadSiglas.length === 3 || "Las siglas deben ser de 3 caracteres"
                ],
                isValidFormEdit: true,
                facultyToEdit: null,
                editing: false,
                textCardSaveOrEdit: "Nueva facultad",
                facultyToDelete: null,
                dialogDelete: false,
                iconSnack: '',
                snackInfo: '',
                snackAlertType: '',
                showSnackNotification: false,
                file: null
            }
        },
        computed: {
            ...mapGetters(['loadingTable', 'loading'])
        },
        methods: {
            getAllFaculties() {
                const token = localStorage.getItem('token');
                this.$store.commit('setLoadingTable', true)
                axios.get(URL_GET_ALL_FACULTIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.$store.commit('setLoadingTable', false)
                    this.facultiesList = data;
                    // this.showSnackNotification = true;
                    // this.snackAlertType = "success";
                    // this.snackInfo = "Se han cargado los datos de las facultades con exito";
                    // this.iconSnack = "info_outline"
                }).catch(err => {
                    console.log(err)
                    this.showSnackNotification = true;
                    this.snackAlertType = "error";
                    this.snackInfo = "Ha habido un problema al cargar los datos de las facultades";
                    this.iconSnack = "error_outline"
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            saveFaculty() {
                this.showSnackNotification = false;
                console.log(this.file);
                let formData = new FormData();
                formData.append('file', this.file)
                if (this.$refs.formNewFaculty.validate()) {
                    if (!this.editing) {
                        const token = localStorage.getItem('token');
                        this.$store.commit('setLoading', true)
                        axios.post(URL_POST_IMAGE, formData, {
                            headers: {
                                "Authorization": "Bearer " + token,
                                "cache-control": "no-cache",
                                "Content-Type": "multipart/form-data"
                            },
                        }).then(({data}) => {
                                console.log(data)
                                const dataUri = data.fileDownloadUri;
                                const payload = {
                                    facultad: this.facultadNameNew,
                                    siglas: this.facultadSiglasNew,
                                    imagen: dataUri
                                }
                                axios.post(URL_SAVE_FACULTY, payload, {
                                    headers: {
                                        "Authorization": "Bearer " + token,
                                        "cache-control": "no-cache",
                                    },
                                }).then(({data}) => {
                                    this.$store.commit('setLoading', false)
                                    console.log(data);
                                    this.facultiesList = this.getAllFaculties()
                                    this.dialogNewFaculty = false;
                                    this.facultadNameNew = '';
                                    this.facultadSiglasNew = '';
                                    this.editing = false;
                                    this.showSnackNotification = true;
                                    this.snackAlertType = "success";
                                    this.snackInfo = "Se ha insertedo una nueva facultad con exito";
                                    this.iconSnack = "info_outline"
                                    //this.$refs.formNewFaculty.reset();
                                    this.$refs.formNewFaculty.reset();
                                }).catch(err => {
                                    console.log(err)
                                    this.$store.commit('setLoading', false)
                                    this.showSnackNotification = true;
                                    this.snackAlertType = "error";
                                    this.snackInfo = "Ha ocurrido un error al insertar la facultad";
                                    this.iconSnack = "error_outline"
                                    if(err.response.status===403){
                                        this.$router.push("/403");
                                    }
                                })
                            }
                        ).catch(err => {
                                console.log(err, "Problema al subir file :(")
                            if(err.response.status===403){
                                this.$router.push("/403");
                            }
                            }
                        )

                    } else {
                        const token = localStorage.getItem('token');
                        const facultyToSave = {
                            id: this.facultyToEdit.id,
                            facultad: this.facultadNameNew,
                            siglas: this.facultadSiglasNew,
                            carrerasById: null
                        }
                        this.$store.commit('setLoading', true)
                        console.log(facultyToSave)
                        axios.post(URL_UPDATE_FACULTY, facultyToSave, {
                            headers: {
                                "Authorization": "Bearer " + token,
                                "cache-control": "no-cache",
                            }
                        }).then(({data}) => {
                            console.log(data);
                            console.log("Im there")
                            this.facultiesList = this.getAllFaculties()
                            this.facultyToEdit = null;
                            this.dialogNewFaculty = false;
                            this.editing = false;
                            this.textCardSaveOrEdit = "Nueva facultad"
                            this.$store.commit('setLoading', false)
                            this.showSnackNotification = true;
                            this.snackAlertType = "success";
                            this.snackInfo = "Se ha editado los datos de la facultad con exito";
                            this.iconSnack = "info_outline"
                        }).catch(err => {
                            this.$store.commit('setLoading', false)
                            console.log(err)
                            this.showSnackNotification = true;
                            this.snackAlertType = "error";
                            this.snackInfo = "Ha ocurrido un error al actualizar";
                            this.iconSnack = "error_outline"
                            if(err.response.status===403){
                                this.$router.push("/403");
                            }
                        });
                    }
                }
            },
            openDialogEdit(item) {
                this.showSnackNotification = false;
                this.dialogNewFaculty = true;
                this.facultyToEdit = item;
                this.textCardSaveOrEdit = "Editar facultad"
                this.editing = true;
                this.facultadSiglasNew = item.siglas;
                this.facultadNameNew = item.facultad;
            },

            cancelar() {
                this.showSnackNotification = false;
                this.editing = false;
                this.textCardSaveOrEdit = "Nueva facultad"
                this.dialogNewFaculty = false;
                this.facultadNameNew = '';
                this.facultadSiglasNew = '';
                this.facultyToEdit = null;
                this.dialogEditFaculty = false;
                this.$refs.formNewFaculty.reset();
            },
            deleteDialogOpen(item) {
                this.showSnackNotification = false;
                this.facultyToDelete = item;
                this.dialogDelete = true;
            },
            deleteFaculty() {
                this.showSnackNotification = false;
                const token = localStorage.getItem('token')
                axios.delete(URL_DELETE_FACULTY, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                    params: {
                        id: this.facultyToDelete.id
                    }
                }).then(({data}) => {
                    //const pos =this.facultiesList.indexOf(data);
                    console.log(data)
                    this.facultiesList = this.getAllFaculties()
                    this.dialogDelete = false;
                    this.showSnackNotification = true;
                    this.snackAlertType = "success";
                    this.snackInfo = "Se ha eliminado la facultad con exito";
                    this.iconSnack = "info_outline"
                })
                    .catch(err => {
                        this.showSnackNotification = true;
                        this.snackAlertType = "error";
                        this.snackInfo = "Ha ocurrido un error al eliminar la facultad";
                        this.iconSnack = "error_outline"
                        console.log(err)
                        if(err.response.status===403){
                            this.$router.push("/403");
                        }
                    })

            },

        },
        created() {
            this.getAllFaculties();
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