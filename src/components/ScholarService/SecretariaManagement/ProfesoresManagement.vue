<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="profesoresList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Lista de profesores</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                              hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllProfesors" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-dialog v-model="dialogInsertarProfesor" max-width="450px" persistent>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                            <v-icon dark left>add</v-icon>
                                            Añadir Profesor
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Añadir Profesor</v-card-title>
                                            <v-form lazy-validation v-model="isFormInsertarValid"
                                                    ref="insertFormProfesor" @submit.prevent="saveProfesor">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="userProfesorSelected"
                                                                :items="usersProfesorsList"
                                                                label="Usuario"
                                                                prepend-icon="face"
                                                                :rules="[facultad=> !!facultad||'El usuario es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="facultad"
                                                                :items="facultadList"
                                                                label="Facultad"
                                                                prepend-icon="apartment"
                                                                :rules="[facultad=> !!facultad||'La facultad es requerida']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="gradoCientifico"
                                                                :items="gradoCientificoList"
                                                                label="Grado científico"
                                                                prepend-icon="school"
                                                                :rules="[facultad=> !!facultad||'La facultad es requerida']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="gradoDocente"
                                                                :items="categoriasDocentesList"
                                                                label="Grado docente"
                                                                prepend-icon="book"
                                                                :rules="gradoDocenteRules"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="telefono"
                                                                      :rules="telefonoRules"
                                                                      label="Teléfono"
                                                                      aria-required="true" aria-autocomplete="list"
                                                                      counter="8"
                                                                      maxlength="8"
                                                                      prepend-icon="phone"/>
                                                    </v-flex>
                                                </v-layout>


                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn type="submit" class="mx-1" color="primary"
                                                               style="color: white!important;"
                                                               :loading="loading"
                                                               :disabled="!isFormInsertarValid||loading">
                                                            <span class="custom-loader" slot="loader">
                                                            <v-icon>refresh</v-icon>
                                                        </span>Confirmar
                                                        </v-btn>
                                                        <v-btn class="mx-1" color="red" style="color: white!important;"
                                                               @click="cancelarDialog">Cancelar
                                                        </v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="dialogEdit" persistent max-width="500px">
                                    <v-card>
                                        <v-container>
                                            <v-card-title v-if="profesorToEdit!=null">Editar Profesor
                                                {{profesorToEdit.usuario.fullname}}
                                            </v-card-title>
                                            <v-form lazy-validation v-model="isFormEditValid"
                                                    ref="editFormProfesor" @submit.prevent="editProfesor">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="editFacultad"
                                                                :items="facultadList"
                                                                label="Facultad"
                                                                prepend-icon="apartment"
                                                                :rules="[facultad=> !!facultad||'La facultad es requerida']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="editCategoriaCientifica"
                                                                :items="gradoCientificoList"
                                                                label="Grado científico"
                                                                prepend-icon="school"
                                                                :rules="[facultad=> !!facultad||'La facultad es requerida']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="editCategoriaDocente"
                                                                :items="categoriasDocentesList"
                                                                label="Grado docente"
                                                                prepend-icon="book"
                                                                :rules="gradoDocenteRules"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="editTelefono"
                                                                      :rules="telefonoRules"
                                                                      label="Teléfono"
                                                                      aria-required="true" aria-autocomplete="list"
                                                                      counter="8"
                                                                      maxlength="8"
                                                                      prepend-icon="phone"/>
                                                    </v-flex>
                                                </v-layout>


                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn type="submit" class="mx-1" color="primary"
                                                               style="color: white!important;"
                                                               :loading="loading"
                                                               :disabled="!isFormEditValid||loading">
                                                            <span class="custom-loader" slot="loader">
                                                            <v-icon>refresh</v-icon>
                                                        </span>Confirmar
                                                        </v-btn>
                                                        <v-btn class="mx-1" color="red" style="color: white!important;"
                                                               @click="cancelarEditDialog">Cancelar
                                                        </v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="dialogToDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title>¿Desea eliminar este profesor?</v-card-title>
                                        <v-card-actions>
                                            <v-flex class="text-center">
                                                <v-btn color="success" class="mx-1" style="color: white!important;"
                                                       @click="deleteProfesor" :disabled="loading" :loading="loading">
                                                    <span slot="loader" class="custom-loader">
                                                    <v-icon>refresh</v-icon>
                                                </span>Confirmar
                                                </v-btn>
                                                <v-btn color="red" class="mx-1" style="color: white!important;"
                                                       @click="dialogToDelete=false">Cancelar
                                                </v-btn>
                                            </v-flex>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogAsignSignatureAndGroups" persistent width="700px">
                                    <v-card>
                                        <v-container>
                                            <v-card-title v-if="profesorToAddAsign!==null">Asignar asignaturas a
                                                {{profesorToAddAsign.usuario.fullname}}
                                            </v-card-title>
                                            <v-alert type="error" dismissible v-model="alertShow"
                                                     transition="scale-transition">
                                                {{infoAlert}}
                                            </v-alert>
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-layout>
                                                        <v-flex>
                                                            <v-combobox
                                                                    v-model="carreraSelected"
                                                                    :items="carrerasList"
                                                                    label="Carreras"
                                                                    prepend-icon="school"
                                                                    :rules="[asignatura=>!!asignatura||'La carrera es requerida']"
                                                                    @change="updateData"
                                                            ></v-combobox>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-layout>
                                                        <v-flex>
                                                            <v-combobox
                                                                    v-model="asignaturaSelected"
                                                                    :items="asignaturasList"
                                                                    label="Asignaturas"
                                                                    prepend-icon="chrome_reader_mode"
                                                                    :rules="[asignatura=>!!asignatura||'La asignatura es requerida']"
                                                                    :disabled="asignaturasList.length===0"
                                                            ></v-combobox>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-col>
                                            </v-row>

                                            <!--Grupos to select-->
                                            <v-row>
                                                <!--Estdudiantes disponibles-->
                                                <v-col cols="5">
                                                    <v-card outlined elevation="8" rounded>
                                                        <div class="text-center pa-3">
                                                            <h3 class="font-weight-regular">Grupos disponibles</h3>
                                                        </div>
                                                        <v-divider/>
                                                        <div v-if="loading" class="text-center mt-3">
                                                            <v-progress-circular
                                                                    :size="50"
                                                                    color="blue"
                                                                    indeterminate
                                                            ></v-progress-circular>
                                                        </div>

                                                        <v-list-item-group v-else v-model="grupoListSelected"
                                                                           color="indigo">
                                                            <v-list-item v-for="grupos in gruposList"
                                                                         :key="grupos.id"
                                                                         @click="isGrupoLeftSelected=true">
                                                                <v-list-item-content>
                                                                    <v-list-item-title>- {{grupos.grupo}}
                                                                    </v-list-item-title>
                                                                </v-list-item-content>
                                                            </v-list-item>
                                                        </v-list-item-group>
                                                    </v-card>
                                                </v-col>
                                                <!--Botones-->
                                                <v-col cols="2">
                                                    <div>
                                                        <v-sheet class="align-center ml-8">
                                                            <v-flex class="text-center">
                                                                <v-layout row class="ma-1">
                                                                    <v-btn icon outlined
                                                                           @click="addAllStudentToAssignGroup"
                                                                           :disabled="gruposList.length===0">
                                                                        <v-icon class="last_page"/>
                                                                    </v-btn>
                                                                </v-layout>
                                                                <v-layout row class="ma-1">
                                                                    <v-btn icon :disabled="!isGrupoLeftSelected"
                                                                           outlined
                                                                           @click="addStudentToAssignGroup">
                                                                        <v-icon class="navigate_next"/>
                                                                    </v-btn>
                                                                </v-layout>
                                                                <v-layout row class="ma-1">
                                                                    <v-btn icon outlined
                                                                           :disabled="!isGrupoRigthSelected"
                                                                           @click="removeStudentFromGroup">
                                                                        <v-icon class="navigate_before"/>
                                                                    </v-btn>
                                                                </v-layout>
                                                                <v-layout row class="ma-1">
                                                                    <v-btn icon outlined
                                                                           :disabled="gruposToAsignList.length===0"
                                                                           @click="removeAllStudenFromGroup">
                                                                        <v-icon class="first_page"/>
                                                                    </v-btn>
                                                                </v-layout>
                                                            </v-flex>
                                                        </v-sheet>
                                                    </div>
                                                </v-col>
                                                <!--Estdudiantes annadidos-->
                                                <v-col cols="5">
                                                    <v-card outlined elevation="8" rounded>
                                                        <div class="text-center pa-3">
                                                            <h3 class="font-weight-regular">Grupos asignados</h3>
                                                        </div>
                                                        <v-divider/>

                                                        <v-list-item-group v-model="grupoToAsignSelected"
                                                                           color="indigo">
                                                            <v-list-item v-for="item in gruposToAsignList"
                                                                         :key="item.id"
                                                                         @click="isGrupoRigthSelected=true">
                                                                <v-list-item-content>
                                                                    <v-list-item-title>- {{item.grupo}}
                                                                    </v-list-item-title>
                                                                </v-list-item-content>
                                                            </v-list-item>
                                                        </v-list-item-group>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                            <v-card-actions>
                                                <v-layout row class="ma-1">
                                                    <v-flex class="text-right">
                                                        <v-btn color="success" style="color: white!important;"
                                                               class="mx-1" :loading="loading" :disabled="loading"
                                                               @click="assignToSignaturesProfesor">
                                                                        <span slot="loader" class="custom-loader">
                                                                            <v-icon>refresh</v-icon>
                                                                        </span>
                                                            Asignar
                                                        </v-btn>
                                                        <v-btn style="color: white!important;" color="error"
                                                               class="mx-1"
                                                               @click="cancelarAssign">Cancelar
                                                        </v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-actions>
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
                                <span>Editar profesor</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="addToSignature(item)"
                                            color="accent">
                                        assignment
                                    </v-icon>
                                </template>
                                <span>Asignar a asignatura y a grupo</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)" color="red">
                                        delete
                                    </v-icon>
                                </template>
                                <span>Eliminar profesor</span>
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
        URL_DELETE_PROFESOR,
        URL_FETCH_ALL_PROFESSORS, URL_FETCH_GET_SIGNATURES_BY_CAREER_NAME,
        URL_GET_ALL_FACULTIES, URL_GET_CAREERS_BY_FACULTY_NAME, URL_GET_GRUPOS_BY_CAREER,
        URL_GET_USERS_PROFESORS,
        URL_SAVE_PROFESOR, URL_TO_ASSIGN_PROFESORS_TO_SIGNATURES, URL_UPDATE_PROFESOR
    } from "../../../urlResources";

    export default {
        name: "ProfesoresManagement",
        data() {
            return {
                profesoresList: [],
                headers: [
                    {text: "Nombre", value: "usuario.fullname", align: "center"},
                    {text: "Telefono", value: 'telefono', align: 'center'},
                    {text: "Correo", value: 'usuario.email', align: 'center'},
                    {text: "Facultad", value: "facultadByIdFacultad.facultad", align: 'center'},
                    {text: "Grado Científico", value: "gradoCientifico", align: "center"},
                    {text: "Grado Docente", value: "gradoDocente", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"}
                ],
                search: '',
                dialogInsertarProfesor: false,
                gradoCientifico: '',
                gradoDocente: '',
                telefono: '',
                facultad: '',
                facultadList: [],
                isFormInsertarValid: true,
                usersProfesorsList: [],
                userProfesorSelected: '',
                gradoDocenteRules: [
                    grado => !!grado || "El grado docente es requerido"
                ],
                gradoCientificoRules: [
                    grado => !!grado || "El grado científico es requerido"
                ],
                telefonoRules: [
                    telefono => !!telefono || "El telefono es requerido",
                    telefono => telefono.length === 8 || "El telefono debe tener 8 digitos"
                ],
                gradoCientificoList: ['Ingeniero', 'Licenciado', 'Máster', 'Doctor'],
                categoriasDocentesList: ["Profesor Titular",
                    "Profesor Auxiliar",
                    "Profesor Asistente",
                    "Instructor",
                    "Axiliar Técnico",
                    "Profesor Emérito",
                    "Profesor Invitado",
                    "Profesor Consultante"],
                editTelefono: '',
                editCategoriaCientifica: '',
                editCategoriaDocente: '',
                editFacultad: '',
                dialogEdit: false,
                profesorToEdit: null,
                isFormEditValid: true,
                profesorToDelete: null,
                profesorToAddAsign: null,
                dialogToDelete: false,
                dialogAsignSignatureAndGroups: false,
                datosDeCarreraCompletos: [],


                carrerasList: [],
                carreraSelected: '',
                asignaturasList: [],
                asignaturaSelected: '',
                gruposList: [],
                grupoListSelected: '',
                gruposToAsignList: [],
                grupoToAsignSelected: '',
                isGrupoRigthSelected: false,
                isGrupoLeftSelected: false,
                infoAlert: '',
                alertShow: false,

            }
        },
        methods: {
            getAllProfesors() {
                const token = localStorage.getItem('token');
                this.$store.commit('setLoadingTable', true);
                axios.get(URL_FETCH_ALL_PROFESSORS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.profesoresList = data;
                    this.$store.commit('setLoadingTable', false);
                }).catch(err => {
                    console.log(err);
                    this.$store.commit('setLoadingTable', false);
                })
            },
            getAllFacultad() {
                const token = localStorage.getItem('token');
                axios.get(URL_GET_ALL_FACULTIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    let i = 0;
                    this.facultadList = [];
                    while (i < data.length) {
                        this.facultadList.push(data[i].facultad);
                        i++;
                    }
                }).catch(err => {
                    this.facultadList.push("Ocurrio un error no hay datos");
                    console.log(err);
                })
            },
            getUserProfessors() {
                const token = localStorage.getItem('token');
                axios.get(URL_GET_USERS_PROFESORS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    let i = 0;
                    console.log(data)
                    while (i < data.length) {
                        this.usersProfesorsList.push(data[i].fullname);
                        i++;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            saveProfesor() {
                if (this.$refs.insertFormProfesor.validate()) {
                    this.$store.commit('setLoading', true)
                    const token = localStorage.getItem('token');
                    const payload = {
                        facultad: this.facultad,
                        gradoCientifico: this.gradoCientifico,
                        gradoDocente: this.gradoDocente,
                        telefono: this.telefono,
                        usuario: this.userProfesorSelected
                    }
                    axios.post(URL_SAVE_PROFESOR, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.$store.commit('setLoading', false)
                        console.log(data)
                        this.getAllProfesors();
                        this.$refs.insertFormProfesor.reset();
                        this.dialogInsertarProfesor = false
                    }).catch(err => {
                        this.$store.commit('setLoading', false)
                        console.log(err)
                    })
                }
            },
            editItem(item) {
                this.profesorToEdit = item;
                this.editTelefono = item.telefono;
                this.editFacultad = item.facultadByIdFacultad.facultad
                this.editCategoriaDocente = item.gradoDocente;
                this.editCategoriaCientifica = item.gradoCientifico
                this.dialogEdit = true;
                console.log(item)
            },
            deleteItem(item) {
                this.dialogToDelete = true;
                this.profesorToDelete = item;
                console.log(item)
            },
            addToSignature(item) {
                this.dialogAsignSignatureAndGroups = true;
                this.profesorToAddAsign = item;
                console.log(item)
                this.getCarrerasByFaculty(item);
            },
            cancelarDialog() {
                this.dialogInsertarProfesor = false;
                this.$refs.insertFormProfesor.reset();

            },
            cancelarEditDialog() {
                this.$refs.editFormProfesor.reset();
                this.dialogEdit = false;
            },
            editProfesor() {
                const token = localStorage.getItem('token');
                const payload = {
                    id: this.profesorToEdit.id,
                    facultad: this.editFacultad,
                    gradoCientifico: this.editCategoriaCientifica,
                    gradoDocente: this.editCategoriaDocente,
                    telefono: this.editTelefono
                }
                this.$store.commit('setLoading', true)
                axios.post(URL_UPDATE_PROFESOR, payload, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.getAllProfesors()
                    this.$store.commit('setLoading', false);
                    this.dialogEdit = false;
                    this.$refs.editFormProfesor.reset();
                }).catch(err => {
                    console.log(err);
                    this.$store.commit('setLoading', false)
                })

            },
            deleteProfesor() {
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading', true)
                axios.delete(URL_DELETE_PROFESOR, {
                    params: {
                        id: this.profesorToDelete.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.getAllProfesors();
                    this.dialogToDelete = false;
                    this.$store.commit('setLoading', false)
                }).catch(err => {
                    console.log(err);
                    this.$store.commit('setLoading', false)
                })
            },
            getCarrerasByFaculty(profesor) {
                const facultadName = profesor.facultadByIdFacultad.facultad;
                const token = localStorage.getItem('token');
                axios.get(URL_GET_CAREERS_BY_FACULTY_NAME, {
                    params: {
                        faculty: facultadName
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.datosDeCarreraCompletos = data;
                    let i = 0;
                    while (i < data.length) {
                        this.carrerasList.push(data[i].nombre);
                        i++;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            updateData() {
                this.getAllAsignaturasForACareer();
                this.getAllGroupsByACareer()
            },
            getAllAsignaturasForACareer() {
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_GET_SIGNATURES_BY_CAREER_NAME, {
                    params: {
                        career: this.carreraSelected
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    let i = 0;
                    while (i < data.length) {
                        this.asignaturasList.push(data[i].nombre);
                        i++;
                    }
                }).catch(err => console.log(err));
            },
            getAllGroupsByACareer() {
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading', true);
                axios.get(URL_GET_GRUPOS_BY_CAREER, {
                    params: {
                        carrera: this.carreraSelected,
                        idProfesor: this.profesorToAddAsign.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.$store.commit('setLoading', false);
                    this.gruposList = data;
                }).catch(err => {
                    this.$store.commit('setLoading', false);
                    console.log(err)
                })
            },
            addStudentToAssignGroup() {
                let student = this.gruposList.splice(this.grupoListSelected, 1)
                this.gruposToAsignList.push(student[0]);
                this.grupoListSelected = [];
                this.isGrupoLeftSelected = false;
            },
            addAllStudentToAssignGroup() {
                this.gruposToAsignList = this.gruposList;
                this.gruposList = [];
                this.isGrupoLeftSelected = false;
                this.isGrupoRigthSelected = false;
            },
            removeStudentFromGroup() {
                let student = this.gruposToAsignList.splice(this.grupoToAsignSelected, 1);
                this.gruposList.push(student[0]);
                this.grupoToAsignSelected = [];
                this.isGrupoRigthSelected = false;
            },
            removeAllStudenFromGroup() {
                while (this.gruposToAsignList.length > 0) {
                    let student2 = this.gruposToAsignList.pop()
                    this.gruposList.push(student2);
                }
                this.gruposToAsignList = [];
                this.isGrupoLeftSelected = false;
                this.isGrupoRigthSelected = false;
            },
            assignToSignaturesProfesor() {
                if (this.carreraSelected === '') {
                    this.alertShow = true;
                    this.infoAlert = "Se debe seleccionar la carrera";
                } else if (this.asignaturaSelected === '') {
                    this.alertShow = true;
                    this.infoAlert = "Se debe seleccionar la asignatura";
                } else if (this.gruposToAsignList.length === 0) {
                    this.alertShow = true;
                    this.infoAlert = "Se deben asignar grupos al profesor";
                } else {
                    this.$store.commit('setLoading', true);
                    const token = localStorage.getItem('token');
                    const payload = {
                        asingnatura: this.asignaturaSelected,
                        gruposList: this.gruposToAsignList,
                        idProfesor: this.profesorToAddAsign.id
                    };
                    axios.post(URL_TO_ASSIGN_PROFESORS_TO_SIGNATURES, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.$store.commit('setLoading', false);
                        this.dialogAsignSignatureAndGroups = false
                        console.log(data);
                    }).catch(err => {
                        this.alertShow = true;
                        this.infoAlert = err
                        console.log(err)
                        this.$store.commit('setLoading', false);
                    })
                }
            },
            cancelarAssign() {
                this.dialogAsignSignatureAndGroups=false;
                this.carrerasList = [];
                this.carreraSelected = '';
                this.asignaturasList = [];
                this.asignaturaSelected = '';
                this.gruposList = [];
                this.grupoListSelected = '';
                this.gruposToAsignList = [];
                this.grupoToAsignSelected = '';
                this.isGrupoRigthSelected = false;
                this.isGrupoLeftSelected = false;
            }

        },
        computed: {
            ...mapGetters(['loadingTable', 'loading'])
        },
        created() {
            this.getAllProfesors();
            this.getUserProfessors();
            this.getAllFacultad();
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