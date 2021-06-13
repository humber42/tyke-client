<template>
    <v-container>
        <v-layout row>
            <v-col cols="8">
                <v-card elevation="20" shaped outlined>
                    <v-img height="250" src="http://localhost:9000/img/731" alt="Some image is here"></v-img>
                    <v-card-title>{{user.fullname}}</v-card-title>
                    <v-card-text>
                        <h3>Usuario: {{user.username}}</h3>
                        <h3>Correo: {{user.email}}</h3>
                        <h3>Fecha de Nacimiento: {{user.dob}}</h3>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card elevation="10" shaped>
                    <v-card-title>Acciones</v-card-title>
                    <v-divider></v-divider>
                    <v-container>
                        <v-btn class="my-2" block color="blue" dark @click.stop="dialogEditData=true">
                            <v-icon left>edit</v-icon>
                            Editar datos
                        </v-btn>
                        <v-btn class="my-2" block color="orange" dark @click.stop="dialogEditPassword=true">
                            <v-icon left>lock</v-icon>
                            Cambiar Contraseña
                        </v-btn>
                        <v-btn class="my-2" color="error" dark block @click="signoutUser">
                            <v-icon left>vpn_key</v-icon>
                            Cerrar Sesión
                        </v-btn>
                    </v-container>
                </v-card>
            </v-col>
        </v-layout>

        <!--Dialogo de editar datos-->
        <v-dialog v-model="dialogEditData" persistent max-width="600px">
            <v-card>
                <v-card-title>Editar datos personales</v-card-title>
                <v-container>
                    <v-form v-model="isFormValid" lazy-validation ref="form1" @submit.prevent="handleEditPersonalData">
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field v-model="fullname" :rules="fullnameRules" prepend-icon="text_fields"
                                              type="text" label="Nombre" aria-required="true" aria-autocomplete="list"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field v-model="username" :rules="usernameRules" prepend-icon="account_circle"
                                              type="text" label="Usuario" aria-required="true"
                                              aria-autocomplete="list"/>
                            </v-flex>

                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field v-model="email" :rules="emailRules" prepend-icon="email" type="email"
                                              label="Correo" aria-required="true" aria-autocomplete="list"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-menu ref="menuDatePicker" v-model="menuDatePicker"
                                        :close-on-content-click="false"
                                        :return-value.sync="dob"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="auto"
                                >
                                    <template v-slot:activator="{on,attrs}">
                                        <v-text-field v-model="dob" label="Escoja una fecha"
                                                      readonly v-bind="attrs" v-on="on" prepend-icon="calendar_today">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="dob" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="blue" @click="menuDatePicker=false">Cancelar</v-btn>
                                        <v-btn text color="blue" @click="$refs.menuDatePicker.save(dob)">Seleccionar
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex class="text-right">
                                <v-btn type="submit" :disabled="!isFormValid||loading" color="blue" dark class="mx-2" :loading="loading">
                  <span slot="loader" class="custom-loader">
                    <v-icon light>refresh</v-icon>
                  </span>
                                    Confirmar
                                </v-btn>
                                <v-btn @click="handleCancelDialog" color="red" dark>Cancelar</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEditPassword" persistent max-width="600px">
            <v-card>

                <v-card-title>Cambiar Contraseña</v-card-title>
                <v-container>
                    <v-alert :type="typeAlert" v-model="showSuccess" dismissible transition="scale-transition">{{infoAlert}}</v-alert>
                    <v-form v-model="isFormChangePasswordValid" ref="formCambiar" lazy-validation @submit.prevent="handleEditPassword">
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field v-model="password"  label="Nueva Contraseña" type="password" :rules="passwordRules" prepend-icon="vpn_key"
                                required></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row class="ma-1">
                            <v-flex xs12>
                                <v-text-field v-model="passwordConfirm" required :rules="passwordRules" label="Confirmar Contraseña" type="password"  prepend-icon="lock"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex class="text-right">
                                <v-btn color="blue" dark class="mx-1" @click="handleEditPassword" :disabled="!isFormChangePasswordValid||loading" :loading="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon light>refresh</v-icon>
                                    </span>Confirmar</v-btn>
                                <v-btn @click="handleCancelEditPassword" color="red" dark class="mx-1">Cancelar</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-container>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import {mapGetters} from "vuex";
    export default {
        name: "Profile",

        data: () => {
            return {
                typeAlert:'success',
                infoAlert:'',
                showSuccess: false,
                showAlert: false,
                dialogEditData: false,
                dialogEditPassword: false,
                isFormValid: true,
                isFormChangePasswordValid: true,
                username: '',
                fullname: '',
                email: '',
                dob: '',
                password:'',
                passwordConfirm:'',
                usernameRules: [
                    username => !!username || "El usuario es requerido",
                    username => username.length > 4 || "El usuario debe tener mas de 4 caracteres"
                ],
                fullnameRules: [
                    fullname => !!fullname || "El nombre es requrido",
                    fullname => fullname.length > 6 || "El nombre debe tener al menos 6 caracteres"
                ],
                emailRules: [
                    email => !!email || "El correo es requerido",
                    email => /.@+./.test(email) || "El correo no es valido"
                ],
                passwordRules: [
                    password =>!!password||"La contraseña es requerida",
                    password => password.length>7 || "La contraseña necesita al menos 7 caracteres"
                ],
                menuDatePicker: false

            }
        },
        computed: {
            ...mapGetters(['user', 'loading', 'error']),

        },
        methods: {
            signoutUser() {
                this.$store.dispatch('logoutUser')
            },
            handleEditPersonalData() {
                console.log(this.user)
                this.user.username = this.username;
                this.user.email = this.email;
                this.user.fullname = this.fullname;
                this.user.dob = this.dob;
                if (this.$refs.form1.validate()) {
                    this.$store.dispatch('updateUserPersonalData', {
                        userDouble: this.user
                    });
                    this.username = '';
                    this.email = '';
                    this.fullname = '';
                    this.dob = '';
                    this.dialogEditData = false;
                    this.showSuccess = true;
                }
            },
            handleCancelDialog() {
                this.username = '';
                this.fullname = '';
                this.email = '';
                this.dob = '';
                this.dialogEditData = false;
            },
            handleEditPassword(){
                if(this.$refs.formCambiar.validate()){
                    if(this.password===this.passwordConfirm){
                        this.showSuccess=false;
                        this.user.password=this.password;
                        this.$store.dispatch('changePassword',{
                            userChange:this.user
                        });
                        this.password='';
                        this.passwordConfirm='';
                        this.typeAlert="success";
                        this.infoAlert="Contraseña modificada";
                        this.showSuccess=true;
                    }else{
                        this.showSuccess=true;
                        this.typeAlert='error'
                        this.infoAlert="Las contraseñas no coinciden"
                    }
                }

            },
            handleCancelEditPassword(){



                this.password='';
                this.passwordConfirm='';
                this.dialogEditPassword=false;
            }

        },
        watch: {
            error(value) {
                if (value) {
                    this.showAlert = true;
                }
            }
        }
    };
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
