<template>
    <v-container class="text-center mt-5 pt-5">
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>

                <v-card width="600px" shaped  elevation="18">
                    <v-tabs
                            right
                            slider-color="success"
                            v-model="modelTabs"
                            color="success"
                    >
                        <v-tab :href="`#tabLogin`">
                            Iniciar Sesión
                        </v-tab>
                        <v-tab :href="`#tabRegister`">
                            Registrarse
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="modelTabs">
                        <v-tab-item :value="`tabLogin`">
                            <v-card outlined>
                                <v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex>
                                            <h2 class="font-weight-thin">Bienvenido de nuevo</h2>
                                        </v-flex>
                                        <v-container>
                                            <v-alert type="danger" v-model="alertRegister" dismissible transition="scale-transition">{{error}}</v-alert>
                                            <v-form v-model="isFormValid" lazy-validation ref="formLogin" @submit.prevent="handleSigninUser">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="username" :rules="usernameRules"
                                                        prepend-icon="account_circle" label="Usuario" aria-autocomplete="list"
                                                                      aria-required="true" type="text"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="password" type="password" label="Contraseña"
                                                        :rules="passwordRules" prepend-icon="vpn_key" aria-required="true" aria-autocomplete="list"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-btn color="primary" :disabled="!isFormValid||loading" :loading="loading" type="submit">
                                                            <span slot="loader" class="custom-loader">
                                                                <v-icon light>refresh</v-icon>
                                                            </span>
                                                            Iniciar Sesión
                                                        </v-btn>
                                                        <v-card-text>¿No tiene cuenta? <a style="color: dodgerblue" @click="modelTabs=`tabRegister`">Registrarse</a></v-card-text>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-layout>
                                </v-layout>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item :value="`tabRegister`">
                            <v-card outlined>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <h1 class="font-weight-thin">Plataforma Tyke</h1>
                                    </v-flex>
                                </v-layout>
                                <v-container>
                                    <v-alert :type="typeAlert" v-model="alertRegister" dismissible transition="scale-transition">{{infoAlert}}</v-alert>
                                    <v-form ref="formRegister" v-model="isFormRegisterValid" lazy-validation @submit.prevent="handleSignupUser">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field v-model="usernameRegister" :rules="usernameRules" label="Usuario" type="text"
                                                              prepend-icon="account_circle" aria-autocomplete="list" aria-required="true"/>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field v-model="fullnameRegister" label="Nombre" type="text" :rules="fullnameRules" prepend-icon="text_fields"
                                                aria-required="true" aria-autocomplete="list"/>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field v-model="emailRegister" :rules="emailRules" prepend-icon="email" label="Correo" type="email"
                                                aria-autocomplete="list" aria-required="true"/>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-combobox
                                                        v-model="selectedFaculty"
                                                        :items="facultyList"
                                                        label="Facultad"
                                                        prepend-icon="apartment"
                                                        :rules="facultyRules"
                                                ></v-combobox>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex>
                                                <v-text-field v-model="passwordRegister" prepend-icon="vpn_key" label="Contraseña" type="password" :rules="passwordRules"
                                                aria-required="true" aria-autocomplete="list"/>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field v-model="passwordConfirmRegister" prepend-icon="lock" label="Confirmar" type="password" :rules="passwordRules"
                                                aria-autocomplete="list" aria-required="true"/>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-btn :disabled="!isFormRegisterValid||loading" :loading="loading" color="primary" type="submit">
                                                    <span slot="loader" class="custom-loader">
                                                        <v-icon light>refresh</v-icon>
                                                    </span>
                                                    Registrarse
                                                </v-btn>
                                                <v-card-text>¿Ya tiene cuenta? <a style="color: dodgerblue" @click="modelTabs=`tabLogin`">Iniciar Sesión</a></v-card-text>
                                            </v-flex>
                                        </v-layout>
                                    </v-form>
                                </v-container>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import {mapGetters} from "vuex";
    import axios from "axios"
    import {URL_GET_ALL_FACULTIES, URL_GET_USER_BY_USERNAME} from "../../urlResources";


    export default {
        name: "Login",
        data: () => {
            return {
                username: "",
                usernameRegister:"",
                password: "",
                passwordRegister:"",
                passwordConfirmRegister:"",
                fullnameRegister:"",
                emailRegister:"",
                modelTabs: 'tabLogin',
                isFormValid: true,
                isFormRegisterValid: true,
                alertRegister: false,
                typeAlert:'',
                infoAlert:'',
                usernameRules: [
                    (username) => !!username || "El nombre de usuario es requerido",
                    (username) =>
                        username.length > 4 ||
                        "El nombre de usuario necesita al menos 4 caracteres",
                ],
                passwordRules: [
                    (password) => !!password || "La contraseña es requerida",
                    (password) =>
                        password.length > 5 ||
                        "La contraseña debe tener al menos 6 caracteres",
                ],
                fullnameRules:[
                    (fullname)=>!!fullname||"El nombre es requerido",
                    (fullname)=>fullname.length>8 || "El nombre necesita la menos 8 caracteres"
                ],
                emailRules: [
                    email => !!email || "El correo es requerido",
                    email => /.@+./.test(email) || "El correo no es válido"
                ],
                facultyRules:[
                  faculty=>!!faculty||"La facultad es requerida"
                ],
                selectedFaculty:'',
                facultyList:[]
            };
        },
        methods: {
            handleSigninUser() {
                if (this.$refs.formLogin.validate()) {
                    this.$store.dispatch("signinUser", {
                        password: this.password,
                        userCredential: this.username,
                    });
                }
            },
            handleSignupUser(){
                if (this.$refs.formRegister.validate()){
                    if(this.passwordConfirmRegister===this.passwordRegister){
                        axios.get(URL_GET_USER_BY_USERNAME+this.usernameRegister).then(({data})=>{
                              console.log(data);
                              if(data){
                                  this.alertRegister=true;
                                  this.infoAlert="Ya existe un usuario con ese nombre, puede que sea tu gemelo malvado :)";
                                  this.typeAlert='error';
                                  this.usernameRegister='';
                              }
                          }).catch(()=>{
                              console.log("prueba pasada");
                              this.$store.dispatch('registerUser',{
                                  username:this.usernameRegister,
                                  password:this.passwordRegister,
                                  email:this.emailRegister,
                                  fullname:this.fullnameRegister,
                                  faculty:this.selectedFaculty
                              });
                        });

                    }else{
                        this.alertRegister=true;
                        this.infoAlert="Las contraseñas no coinciden";
                        this.typeAlert='error';
                        this.passwordRegister='';
                        this.passwordConfirmRegister='';
                    }
                }
            },
            getAllFacultys(){
                axios.get(URL_GET_ALL_FACULTIES).then(({data})=>{
                    let i =0;
                    while(i<data.length){
                        this.facultyList.push(data[i].facultad);
                        i++;
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            }

        },
        computed: {
            ...mapGetters(["user", "loading", "error"]),
        },
        watch: {
            user(value) {
                if (value) {
                    this.$router.push("/");
                }
            },
        },
        created() {
            this.getAllFacultys();
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
