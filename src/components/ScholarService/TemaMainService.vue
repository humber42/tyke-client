<template>
    <v-container>
        <v-card outlined elevation="20">
            <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
            </v-skeleton-loader>
            <v-data-table v-else :headers="headers"
                          :items="temasList" :items-per-page="5" class="elevation-1"
                          :search="search"
            >
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Lista de Temas</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                      hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn @click="getAllTemas" color="orange" class="mb-2 mr-1" dark>
                            <v-icon class="refresh" dark/>
                            Refrescar
                        </v-btn>
                        <v-dialog v-model="dialogInsertarTema" max-width="450px" persistent>
                            <template v-slot:activator="{on,attrs}">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                    <v-icon dark left>add</v-icon>
                                    Nuevo Tema
                                </v-btn>
                            </template>
                            <v-card>
                                <v-container>
                                    <v-card-title>Añadir Tema</v-card-title>
                                    <v-form lazy-validation v-model="isFormInsertarValid"
                                            ref="insertFormTema" @submit.prevent="saveTema">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-combobox
                                                        v-model="selectAsignaturas"
                                                        :items="itemsAsignaturasList"
                                                        label="Asignaturas"
                                                        placeholder="Seleccione la asignatura"
                                                        prepend-icon="chrome_reader_mode"
                                                        multiple
                                                ></v-combobox>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field v-model="newTemaNombre"
                                                              :rules="temaNombreRules"
                                                              prepend-icon="bookmark" label="Nombre"
                                                              aria-required="true" aria-autocomplete="list"/>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-textarea v-model="newTemaDescription"
                                                            :rules="temaDescriptionRules"
                                                            prepend-icon="text_fields" label="Descripcion"
                                                            aria-autocomplete="list" aria-required="true"
                                                            counter="255"
                                                            maxlength="255"/>
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
                        <v-dialog v-model="dialogEliminarTema" max-width="500px">
                            <v-card>
                                <v-card-title>¿Desea eliminar este tema?</v-card-title>
                                <v-card-actions>
                                    <v-flex class="text-center">
                                        <v-btn color="success" class="mx-1" style="color: white!important;"
                                               @click="deleteTema">Confirmar
                                        </v-btn>
                                        <v-btn color="red" class="mx-1" style="color: white!important;"
                                               @click="cancelar">Cancelar
                                        </v-btn>
                                    </v-flex>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogEditarTema" max-width="400px" persistent>

                            <v-card>
                                <v-container>
                                    <v-card-title>Editar Tema</v-card-title>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox
                                                    v-model="asignaturaSelectsEdit"
                                                    :items="itemsAsignaturasList"
                                                    label="Asignaturas"
                                                    placeholder="Seleccione la asignatura"
                                                    prepend-icon="chrome_reader_mode"
                                                    multiple
                                            ></v-combobox>
                                        </v-flex>
                                    </v-layout>

                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field v-model="nombreTemaEdit"
                                                          :rules="temaNombreRules"
                                                          prepend-icon="bookmark" label="Nombre"
                                                          aria-required="true" aria-autocomplete="list"/>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea v-model="descripcionTemaEdit"
                                                        :rules="temaDescriptionRules"
                                                        prepend-icon="text_fields" label="Descripcion"
                                                        aria-autocomplete="list" aria-required="true"
                                                        counter="255"/>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex class="text-right">
                                            <v-btn class="mx-1" color="orange" style="color: white!important;"
                                                   @click="updateTema">Editar
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
                        <span>Editar tema</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{on,attrs}">
                            <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)" color="red">
                                delete
                            </v-icon>
                        </template>
                        <span>Eliminar tema</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from 'vuex'
    import {
        URL_DELETE_TEMA,
        URL_FETCH_ALL_ASIGNATURAS,
        URL_FETCH_ALL_TEMAS,
        URL_SAVE_TEMA,
        URL_UPDATE_TEMA
    } from "../../urlResources";

    export default {
        name: "TemaMainService",
        data() {
            return {
                newTemaDescription: '',
                newTemaNombre: '',
                temasList: [],
                headers: [
                    {text: "Tema", value: "nombre", allign: 'center'},
                    {text: "Descripción", value: "description", allign: 'center'},
                    {text: "Acciones", value: 'actions', allign: 'center'}
                ],
                search: '',
                dialogInsertarTema: false,
                dialogEditarTema: false,
                dialogEliminarTema: false,
                isFormInsertarValid: true,
                temaToDelete: null,
                temaToEdit: null,
                temaNombreRules: [
                    tema => !!tema || "El nombre del tema es requerido"
                ],
                temaDescriptionRules: [
                    descript => !!descript || "La descripcion es requerida",
                    descript => descript.length < 255 || "La descripcion no debe exceder los 255 caracteres"
                ],
                asignaturaRules: [
                    asignaturas => !!asignaturas || "Se necesita al menos una asignatura"
                ],
                selectAsignaturas: [],
                itemsAsignaturasList: [],
                nombreTemaEdit: '',
                descripcionTemaEdit: '',
                asignaturaSelectsEdit: ''

            }
        },
        computed: {
            ...mapGetters(['loadingTable', "loading"])
        },
        methods: {
            getAllTemas() {
                this.$store.commit('setLoadingTable', true);
                const token = localStorage.getItem('token')
                axios.get(URL_FETCH_ALL_TEMAS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                })
                    .then(({data}) => {
                        this.$store.commit('setLoadingTable', false);
                        console.log(data);
                        this.temasList = data;
                    })
                    .catch(error => {
                        this.$store.commit('setLoadingTable', false);
                        console.log(error)
                    })
            },
            getAsignaturas() {
                this.$store.commit('setLoadingTable', true);
                const token = localStorage.getItem('token')
                axios.get(URL_FETCH_ALL_ASIGNATURAS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    console.log(data)
                    let i = 0;
                    while (i < data.length) {
                        this.itemsAsignaturasList.push(data[i].nombre)
                        i++;
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            saveTema() {
                if (this.$refs.insertFormTema.vaidate()) {
                    const token = localStorage.getItem('token');
                    const payload = {
                        asignaturas: this.selectAsignaturas,
                        description: this.newTemaDescription,
                        nombre: this.newTemaNombre
                    }
                    this.$store.commit('setLoading', true)
                    axios.post(URL_SAVE_TEMA, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        },
                    }).then(({data}) => {
                        this.temasList.push(data);
                        this.$store.commit('setLoading', false);
                        this.dialogInsertarTema = false;
                        this.newTemaDescription = '';
                        this.newTemaNombre = '';
                        this.selectAsignaturas = [];
                    }).catch(err => {
                        console.log(err)
                        this.$store.commit('setLoading', false)
                    })
                    console.log("Hola")
                }
            },
            updateTema() {
                const token = localStorage.getItem('token')
                const payload = {
                    asignaturas: this.asignaturaSelectsEdit,
                    description: this.descripcionTemaEdit,
                    nombre: this.nombreTemaEdit,
                    id: this.temaToEdit.id
                }
                axios.post(URL_UPDATE_TEMA, payload, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    this.getAllTemas();
                    console.log(data);
                    this.nombreTemaEdit = '';
                    this.descripcionTemaEdit = '';
                    this.asignaturaSelectsEdit = [];
                    this.temaToEdit = null;
                    this.dialogEditarTema = false;
                }).catch((err) => {
                    console.log(err);
                })

                console.log("update")
            },
            deleteTema() {
                const token = localStorage.getItem('token')
                console.log("delete");
                axios.delete(URL_DELETE_TEMA, {
                    params: {
                        id: this.temaToDelete.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    this.getAllTemas()
                    console.log(data);
                    this.dialogEliminarTema = false;
                }).catch((err) => {
                    console.log(err);
                })

            },
            editItem(item) {
                this.dialogEditarTema = true
                this.temaToEdit = item;
                this.nombreTemaEdit = item.nombre
                this.descripcionTemaEdit = item.description
                let arrayAsignaturas = [];
                let i = 0;
                while (i < item.asignaturaTemasById.length) {
                    console.log(item.asignaturaTemasById[i].asignaturaByIdAsignatura.nombre)
                    arrayAsignaturas.push(item.asignaturaTemasById[i].asignaturaByIdAsignatura.nombre)
                    i++;
                }
                this.asignaturaSelectsEdit = arrayAsignaturas;

            },
            deleteItem(item) {
                this.dialogEliminarTema = true
                this.temaToDelete = item;
            },
            cancelar() {
                this.dialogInsertarTema = false;
                this.dialogEditarTema = false;
                this.dialogEliminarTema = false;
                this.newTemaDescription = '';
                this.newTemaNombre = '';
                this.selectAsignaturas = [];
                this.nombreTemaEdit = '';
                this.descripcionTemaEdit = '';
                this.asignaturaSelectsEdit = [];
                this.temaToDelete = null;
                this.temaToEdit = null;
            }

        },
        created() {
            this.getAllTemas();
            this.getAsignaturas();
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