<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="regalosList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Listado de regalos</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                              hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllGifts" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-dialog v-model="dialogAddGift" max-width="500px" persistent>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                            <v-icon dark left>add</v-icon>
                                            Nuevo regalo
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Agregar regalo</v-card-title>
                                            <v-form v-model="isFormNewGiftValid" lazy-validation ref="formNewGift"
                                                    @submit.prevent="saveGift">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="regaloNew.idTipoRegalo"
                                                                :items="tipoRegaloList"
                                                                label="Tipo regalo"
                                                                prepend-icon="app_registration"
                                                                :rules="[asignatura=>!!asignatura||'El tipo de regalo es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="regaloNew.idOtorgamiento"
                                                                :items="otorgamientoList"
                                                                label="Otorgamiento"
                                                                prepend-icon="card_membership"
                                                                :rules="[asignatura=>!!asignatura||'El otorgamiento es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Descripción"
                                                                      v-model="regaloNew.descripcion" counter="45"
                                                                      maxlength="45"
                                                                      prepend-icon="text_fields"
                                                                      :rules="[desc=>!!desc||'La descripción es requerida']">
                                                        </v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn class="mx-1" color="success"
                                                               style="color: white!important;" type="submit"
                                                               :loading="loading"
                                                               :disabled="!isFormNewGiftValid||loading">
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
                                <v-dialog v-model="dialogEditGift" persistent max-width="500px">
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Editar regalo</v-card-title>
                                            <v-form v-model="isFormEditValid" lazy-validation ref="formEditGift"
                                                    @submit.prevent="editGift">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="editingGift.idTipoRegalo"
                                                                :items="tipoRegaloList"
                                                                label="Tipo regalo"
                                                                prepend-icon="app_registration"
                                                                :rules="[asignatura=>!!asignatura||'El tipo de regalo es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="editingGift.idOtorgamiento"
                                                                :items="otorgamientoList"
                                                                label="Otorgamiento"
                                                                prepend-icon="card_membership"
                                                                :rules="[asignatura=>!!asignatura||'El otorgamiento es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Descripción"
                                                                      v-model="editingGift.descripcion" counter="45"
                                                                      maxlength="45"
                                                                      prepend-icon="text_fields"
                                                                      :rules="[desc=>!!desc||'La descripción es requerida']">
                                                        </v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn class="mx-1" color="success"
                                                               style="color: white!important;" type="submit"
                                                               :loading="loading" :disabled="!isFormEditValid||loading">
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
                                <v-dialog v-model="dialogDeleteRegalo" max-width="500px">
                                    <v-card>
                                        <v-card-title>¿Desea eliminar este regalo?</v-card-title>
                                        <v-card-actions>
                                            <v-flex class="text-center">
                                                <v-btn color="success" class="mx-1" style="color: white!important;"
                                                       @click="deleteGift" :disabled="loading" :loading="loading">
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
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"
                                            color="orange">
                                        edit
                                    </v-icon>
                                </template>
                                <span>Editar regalo</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)" color="red">
                                        delete
                                    </v-icon>
                                </template>
                                <span>Eliminar regalo</span>
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
        URL_DELETE_GIFT, URL_EDIT_GIFT,
        URL_FETCH_ALL_GIFTS,
        URL_FETCH_ALL_OTORGAMIENTO,
        URL_FETCH_ALL_TIPO_REGALO,
        URL_SAVE_GIFT
    } from "../../urlResources";

    export default {
        name: "RegaloMainService",
        data: () => {
            return {
                headers: [
                    {text: "Tipo de regalo", value: "tipoRegalo.nombre", align: "center"},
                    {text: "Otorgamiento", value: "otorgamiento.otorgamiento", align: "center"},
                    {text: "Descripción", value: "descripcion", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"}
                ],
                regalosList: [],
                search: '',
                dialogAddGift: false,
                dialogDeleteRegalo: false,
                giftToDelete: null,
                giftToEdit: null,
                tipoRegaloList: [],
                regaloNew: {
                    descripcion: "",
                    idOtorgamiento: '',
                    idTipoRegalo: ''
                },
                isFormNewGiftValid: true,
                otorgamientoList: [],
                dialogEditGift: false,
                isFormEditValid: true,
                editingGift: {
                    descripcion: "",
                    idOtorgamiento: '',
                    idTipoRegalo: ''
                }
            }
        },
        methods: {
            getAllGifts() {
                const token = localStorage.getItem('token');
                this.$store.commit('setLoadingTable', true);
                axios.get(URL_FETCH_ALL_GIFTS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    console.log(data)
                    this.regalosList = data;
                    this.$store.commit('setLoadingTable', false);
                }).catch(error => {
                    console.log(error);
                    this.$store.commit('setLoadingTable', false);
                    if(error.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            deleteGift() {
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_GIFT, {
                    params: {
                        id: this.giftToDelete.idRegalo
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(() => {
                    this.getAllGifts();
                    this.dialogDeleteRegalo = false
                }).catch(err => {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            deleteItem(item) {
                this.dialogDeleteRegalo = true;
                this.giftToDelete = item;
            },
            editItem(item) {
                this.giftToEdit = item;
                this.dialogEditGift = true;
                this.editingGift.descripcion = item.descripcion;
                this.editingGift.idOtorgamiento = item.otorgamiento.otorgamiento;
                this.editingGift.idTipoRegalo = item.tipoRegalo.nombre;
            },
            saveGift() {
                if (this.$refs.formNewGift.validate()) {
                    const token = localStorage.getItem('token');
                    this.$store.commit('setLoading', true);
                    axios.post(URL_SAVE_GIFT, this.regaloNew, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        },
                    }).then(() => {
                        this.$store.commit('setLoading', false);
                        this.getAllGifts()
                        this.dialogAddGift = false;
                        this.$refs.formNewGift.reset();
                    }).catch(err => {
                        console.log(err)
                        this.$store.commit('setLoading', false);
                        if(err.response.status===403){
                            this.$router.push("/403");
                        }
                    })
                }
            },
            editGift() {
                const token = localStorage.getItem('token');
                const payload = {
                    descripcion: this.editingGift.descripcion,
                    idOtorgamiento: this.editingGift.idOtorgamiento,
                    idRegalo: this.giftToEdit.idRegalo,
                    idTipoRegalo: this.editingGift.idTipoRegalo
                };
                axios.post(URL_EDIT_GIFT, payload, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    this.getAllGifts();
                    console.log(data);
                    this.dialogEditGift = false;
                }).catch(err => {
                    console.log(err)
                    this.$store.commit('setLoading', false);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            cancelar() {
                this.dialogDeleteRegalo = false;
                this.dialogAddGift = false;
                this.dialogEditGift = false;
                this.$refs.formNewGift.reset();
            },
            getAllGiftTypes() {
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_TIPO_REGALO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    let i = 0;
                    while (i < data.length) {
                        this.tipoRegaloList.push(data[i].nombre);
                        i++
                    }
                }).catch(err => {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            getAllOtorgamiento() {
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_OTORGAMIENTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    let i = 0;
                    while (i < data.length) {
                        this.otorgamientoList.push(data[i].otorgamiento);
                        i++
                    }
                }).catch(err => {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            }
        },
        computed: {
            ...mapGetters(['loading', 'loadingTable'])
        },
        created() {
            this.getAllGifts();
            this.getAllOtorgamiento();
            this.getAllGiftTypes();
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