<template>
    <v-container>
        <notification :icon="iconSnack" :info-alert="snackInfo" :type-alert="snackAlertType"
                      :show-snack="showSnackNotification"></notification>
        <v-dialog v-model="dialogNewRol" persistent max-width="500px">
            <v-card>
                <v-card-title>Nuevo Rol</v-card-title>
                <v-container>
                    <v-form v-model="isFormNewRolValid" lazy-validation ref="newRolForm" @submit.prevent="saveNewRol">
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field label="Rol" v-model="rolNameNew" prepend-icon="text_fields"
                                              :rules="roleNameRules"
                                              aria-autocomplete="list" aria-required="true"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-textarea v-model="rolDescriptionNew" :rules="roleDescriptionRules"
                                            label="Description" counter="255"
                                            prepend-icon="description"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12 class="text-right">
                                <v-btn color="blue" type="submit" style="color: white!important;" class="mx-1"
                                       :disabled="!isFormNewRolValid||loading" :loading="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon>refresh</v-icon>
                                    </span>
                                    Confirmar
                                </v-btn>
                                <v-btn color="red" style="color: white!important;" class="mx-1"
                                       @click="dialogNewRol=false">Cancelar
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-container>
            </v-card>

        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="400px">
            <v-card>
                <v-card-title class="font-weight-light">¿Está seguro que desea eliminar el rol?</v-card-title>
                <v-card-actions>
                    <v-flex class="text-center">
                        <v-btn class="mx-1" color="success" @click="deleteRolItem">Confirmar</v-btn>
                        <v-btn class="mx-1" color="error" @click="dialogDelete=false">Cancelar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col cols="9">
                <h2 class="font-weight-light mb-3">Roles y permisos</h2>
            </v-col>
            <v-col cols="3">
                <v-flex class="text-right">
                    <v-btn color="blue" outlined dark elevation="3" @click="saveDialogLoad">
                        <v-icon>add</v-icon>
                        Añadir
                    </v-btn>
                </v-flex>
            </v-col>
        </v-row>

        <v-row class="mt-3">
            <v-col v-for="rol in rolesList" :key="rol.id" cols="3">
                <v-card hover outlined shaped class="mx-1 my-1">
                    <div style="background-color: #3f9655">
                        <v-card-title style="color: white">{{rol.roleName}}</v-card-title>
                    </div>

                    <v-divider/>
                    <v-card-text>{{rol.description}}</v-card-text>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn icon @click="deleteRol(rol)">
                                <v-icon color="red">delete</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {URL_DELETE_ROL, URL_FETCH_ALL_ROLES, URL_SAVE_ROL} from "../../urlResources";
    import axios from 'axios';
    import {mapGetters} from 'vuex';
    import Notification from "../utils/Notification";

    export default {
        name: "RolServiceMain",
        components: {Notification},
        data() {
            return {
                rolesList: [],
                rolNameNew: '',
                rolDescriptionNew: '',
                dialogNewRol: '',
                isFormNewRolValid: true,
                roleNameRules: [
                    roleName => !!roleName || "El rol es requerido",
                    roleName => roleName.length > 4 || "El rol necesita cuatro caracteres"
                ],
                roleDescriptionRules: [
                    roleDescription => !!roleDescription || "La descripción es requerida",
                    roleDescription => roleDescription.length < 255 || "La descripción solo admite 255 caracteres"
                ],
                showSnackNotification: false,
                snackAlertType: '',
                snackInfo: '',
                iconSnack: '',
                rolToDelete: '',
                dialogDelete: false
            }
        },
        computed: {
            ...mapGetters(['loading'])
        },
        methods: {
            cargarRoles() {
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_ROLES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data);
                    this.rolesList = data;
                    this.showSnackNotification = true;
                    this.snackAlertType = "success";
                    this.snackInfo = "Se han cargado los datos de los roles con exito";
                    this.iconSnack = "info_outline"
                }).catch(err => {
                    console.log(err)
                })
            },
            editRol(rol) {
                console.log(rol);
            },
            deleteRol(rol) {
                this.dialogDelete = true;
                this.rolToDelete = rol;
                console.log(rol)
            },
            saveDialogLoad() {
                this.showSnackNotification = false;
                this.dialogNewRol = true;
            },
            saveNewRol() {
                if (this.$refs.newRolForm.validate()) {
                    const token = localStorage.getItem('token');
                    const payload = {
                        description: this.rolDescriptionNew,
                        roleName: this.rolNameNew,
                        id: 0
                    }
                    this.$store.commit('setLoading', true)
                    axios.post(URL_SAVE_ROL, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        console.log(data);
                        this.$store.commit('setLoading', false)
                        this.rolesList.push(payload);
                        this.dialogNewRol = false;
                        this.rolNameNew = '';
                        this.rolDescriptionNew = '';
                        this.showSnackNotification = true;
                        this.snackAlertType = "success";
                        this.snackInfo = "Se ha creado el rol con exito";
                        this.iconSnack = "info_outline"
                    }).catch(err => {
                        console.log(err);
                        this.$store.commit('setLoading', false)
                    })
                }
            },
            deleteRolItem() {
                this.showSnackNotification = false;
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_ROL + this.rolToDelete.id, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data)
                    const pos = this.rolesList.indexOf(this.rolToDelete)
                    this.rolesList.splice(pos, 1)
                    this.showSnackNotification = true;
                    this.snackAlertType = "success";
                    this.snackInfo = "Se ha eliminado el rol con exito";
                    this.iconSnack = "info_outline"
                    this.dialogDelete = false;
                }).catch(
                    err => {
                        console.log(err);
                    }
                );
            }
        },
        created() {
            this.cargarRoles()
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