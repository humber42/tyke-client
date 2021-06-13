<template>
    <v-container>
        <notification :icon="iconSnack" :info-alert="snackInfo" :type-alert="snackAlertType"
                      :show-snack="showSnackNotification"></notification>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="asignaturasList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:item.activo="{item}">
                            <v-chip :color="getColorChip(item)" dark>
                                {{getChipName(item)}}
                            </v-chip>
                        </template>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Lista de asignaturas</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="cargarDatosAsignaturas" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-dialog v-model="dialogInsertAsignatura" max-width="450px" persistent>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                            <v-icon dark left>add</v-icon>
                                            Nueva Asignatura
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Añadir Asignatura</v-card-title>
                                            <v-form lazy-validation v-model="isFormInsertarValid"
                                                    ref="insertFormAsignatura" @submit.prevent="saveAsignatura">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="asignaturaNameNew"
                                                                      :rules="asiganturaNameRules"
                                                                      prepend-icon="text_fields" label="Nombre"
                                                                      aria-required="true" aria-autocomplete="list"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn type="submit" class="mx-1" color="primary"
                                                               style="color: white!important;"
                                                               :disabled="!isFormInsertarValid">Confirmar
                                                        </v-btn>
                                                        <v-btn class="mx-1" color="red" style="color: white!important;"
                                                               @click="dialogInsertAsignatura=false">Cancelar
                                                        </v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card>

                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="dialogEdit" max-width="400px" persistent>

                                    <v-card>
                                        <v-container>
                                            <v-card-title>Editar asignatura</v-card-title>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field v-model="nameAsigEdit"
                                                                  :rules="asiganturaNameRules"
                                                                  prepend-icon="text_fields" label="Nombre"
                                                                  aria-autocomplete="list" aria-required="true"/>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-radio-group row v-model="stateAsigEdit">
                                                        <v-radio label="Activo" :value="true"
                                                                 color="blue"/>
                                                        <v-radio label="Inactivo" :value="false"
                                                                 color="blue"></v-radio>
                                                    </v-radio-group>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex class="text-right">
                                                    <v-btn class="mx-1" color="orange" style="color: white!important;"
                                                           @click="editAsignatura">Editar
                                                    </v-btn>
                                                    <v-btn class="mx-1" color="red" style="color: white!important;"
                                                           @click="dialogEdit=false">Cancelar
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card>

                                </v-dialog>
                            </v-toolbar>
                        </template>

                        <template v-slot:item.actions="{item}">
                            <v-icon class="mr-2" @click="editItem(item)" color="orange">
                                edit
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import axios from 'axios';
    import {URL_FETCH_ALL_ASIGNATURAS, URL_SAVE_ASIGNATURA, URL_UPDATE_ASiGNATURA} from "../../urlResources";
    import Notification from "../utils/Notification";

    export default {
        name: "AsignaturaMainService",
        components: {Notification},
        data() {
            return {
                search:'',
                asignaturasList: [],
                dialogEdit: false,
                dialogDelete: false,
                dialogInsertAsignatura: false,
                iconSnack: '',
                snackInfo: '',
                snackAlertType: '',
                showSnackNotification: false,
                headers: [
                    {text: "Nombre", value: "nombre", align: 'center'},
                    {text: "Estado", value: "activo", align: 'center'},
                    {text: "Acción", value: "actions", align: 'center'}
                ],
                asignaturaNameNew: '',
                asiganturaNameRules: [
                    asignatura => !!asignatura || "El nombre es requerido"
                ],
                isFormInsertarValid: true,
                asignaturaNameEdit: '',
                asignaturaActive: false,
                editDialogShow: false,
                asignaturaToEdit: {},
                stateAsigEdit:false,
                nameAsigEdit:'',
            }
        },
        methods: {
            editItem(item) {
                console.log(item);
                this.dialogEdit = true;
                this.asignaturaToEdit = item;
                this.nameAsigEdit=this.asignaturaToEdit.nombre;
                this.stateAsigEdit = this.asignaturaToEdit.activo;
            },
            dialogOpenDelete(item) {
                console.log(item);
            },
            cargarDatosAsignaturas() {
                this.$store.commit('setLoadingTable', true);
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_ASIGNATURAS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.$store.commit('setLoadingTable', false);
                    this.asignaturasList = data;
                    this.asignaturaNameNew = '';
                    this.showSnackNotification = true;
                    this.iconSnack = 'success';
                    this.snackInfo = "Se cargaron los datos de las asignaturas con exito";
                    this.snackAlertType = 'success';
                    this.search ='';
                }).catch(err => {
                    console.log(err);
                    this.$store.commit('setLoadingTable', false);
                    this.showSnackNotification = true;
                    this.iconSnack = 'danger';
                    this.snackInfo = "Ha ocurrido un error al cargar las asignaturas";
                    this.snackAlertType = 'error';
                })
            },
            getColorChip(item) {
                if (item.activo) return 'green'
                else return 'red'
            },
            getChipName(item) {
                if (item.activo) return 'Activo'
                else return 'No Activa'
            },
            saveAsignatura() {
                this.showSnackNotification = false;
                const token = localStorage.getItem('token');
                const payload = {
                    activo: true,
                    nombre: this.asignaturaNameNew
                };
                axios.post(URL_SAVE_ASIGNATURA, payload, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.asignaturasList.push(data);
                    this.showSnackNotification = true;
                    this.dialogInsertAsignatura = false
                    this.asignaturaNameNew = '';
                    this.iconSnack = 'success';
                    this.snackInfo = "Asignatura insertada con exito";
                    this.snackAlertType = 'success';

                }).catch(error => {
                    console.log(error);
                    this.showSnackNotification = true;
                    this.iconSnack = 'error';
                    this.snackInfo = "La asignatura no fue insertada";
                    this.snackAlertType = 'error';

                })
            },
            editAsignatura() {
                this.asignaturaToEdit.nombre=this.nameAsigEdit;
                this.asignaturaToEdit.activo=this.stateAsigEdit;
                this.showSnackNotification = true;
                const token = localStorage.getItem('token');
                axios.post(URL_UPDATE_ASiGNATURA, this.asignaturaToEdit, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    // const pos = this.asignaturasList.indexOf(this.asignaturaToEdit)
                    // this.asignaturasList.splice(pos, 1);
                    // this.asignaturasList.push(data);
                    this.asignaturaToEdit=data;
                    this.asignaturaToEdit = {};
                    this.showSnackNotification = true;
                    this.iconSnack = 'success';
                    this.snackInfo = "Asignatura modificada con exito";
                    this.snackAlertType = 'success';
                    this.dialogEdit=false;
                }).catch(err => {
                    console.log(err)
                    this.showSnackNotification = true;
                    this.iconSnack = 'error';
                    this.snackInfo = "La asignatura no fue modificada";
                    this.snackAlertType = 'error';
                })

            }
        },
        computed: {
            ...mapGetters(['loadingTable', 'loading'])
        },
        created() {
            this.cargarDatosAsignaturas();
        }
    }
</script>

<style scoped>

</style>