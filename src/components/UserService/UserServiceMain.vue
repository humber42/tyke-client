<template>
    <v-container>
        <notification :icon="iconSnack" :info-alert="snackInfo" :type-alert="snackAlertType" :show-snack="showSnackNotification"></notification>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="users" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:item.status="{item}">
                            <v-chip :color="getColorChip(item)" dark>
                                {{getChipName(item)}}
                            </v-chip>
                        </template>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Lista de usuarios</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="cargarDatosTabla" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/> Refrescar
                                </v-btn>
                                <v-dialog v-model="dialogInsertUser" max-width="750px" persistent>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                            <v-icon dark left>add</v-icon>
                                            Nuevo usuario
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-stepper v-model="stepperAddUser">
                                            <v-stepper-header>
                                                <v-stepper-step step="1" :complete="stepperAddUser>1">
                                                    Cuenta
                                                </v-stepper-step>
                                                <v-divider></v-divider>
                                                <v-divider></v-divider>
                                                <v-stepper-step step="2" :complete="stepperAddUser>2">
                                                    Roles y Permisos
                                                </v-stepper-step>
                                                <v-divider></v-divider>
                                                <v-stepper-step step="3">Información del Usuario</v-stepper-step>
                                            </v-stepper-header>

                                            <v-stepper-items style="background-color: rgba(86,195,246,0.84)">
                                                <v-alert :type="typeAlert" v-model="showAlert" dismissible
                                                         transition="scale-transition">{{infoAlert}}
                                                </v-alert>
                                                <v-stepper-content step="1">
                                                    <v-form v-model="isFormNewCuentaValid" lazy-validation
                                                            @submit.prevent="continueInNewUser"
                                                            ref="formNewUserAccount">
                                                        <v-row dense>
                                                            <v-col cols="6">
                                                                <v-card outlined elevation="15">
                                                                    <v-card-title class="font-weight-thin">Datos
                                                                        Generales
                                                                    </v-card-title>
                                                                    <v-layout row class="ma-1">
                                                                        <v-flex xs12>
                                                                            <v-text-field label="Nombre"
                                                                                          prepend-icon="text_fields"
                                                                                          v-model="fullnameNew"
                                                                                          :rules="fullnameRules"
                                                                                          aria-required="true"
                                                                                          aria-autocomplete="list"/>
                                                                        </v-flex>
                                                                    </v-layout>
                                                                    <v-layout row class="ma-1">
                                                                        <v-flex xs12>
                                                                            <v-menu ref="menuDatePicker"
                                                                                    v-model="menuDatePicker"
                                                                                    :close-on-content-click="false"
                                                                                    :return-value.sync="birthDateNew"
                                                                                    transition="scale-transition"
                                                                                    offset-y
                                                                                    max-width="290px"
                                                                                    min-width="auto"
                                                                            >
                                                                                <template v-slot:activator="{on,attrs}">
                                                                                    <v-text-field v-model="birthDateNew"
                                                                                                  label="Fecha de nacimiento"
                                                                                                  readonly
                                                                                                  v-bind="attrs"
                                                                                                  v-on="on"
                                                                                                  prepend-icon="calendar_today"
                                                                                    :rules="dateBirthRules">
                                                                                    </v-text-field>
                                                                                </template>
                                                                                <v-date-picker v-model="birthDateNew"
                                                                                               no-title scrollable>
                                                                                    <v-spacer></v-spacer>
                                                                                    <v-btn text color="blue"
                                                                                           @click="menuDatePicker=false">
                                                                                        Cancelar
                                                                                    </v-btn>
                                                                                    <v-btn text color="blue"
                                                                                           @click="$refs.menuDatePicker.save(birthDateNew)">
                                                                                        Seleccionar
                                                                                    </v-btn>
                                                                                </v-date-picker>
                                                                            </v-menu>
                                                                        </v-flex>
                                                                    </v-layout>
                                                                    <v-layout class="ma-1" row>
                                                                        <v-flex xs12>
                                                                            <h4 class="font-weight-light">Sexo</h4>
                                                                            <v-radio-group v-model="genderNew" row>
                                                                                <v-radio label="Masculino" value="m"
                                                                                         color="blue"/>
                                                                                <v-radio label="Femenino" value="f"
                                                                                         color="blue"></v-radio>
                                                                            </v-radio-group>
                                                                        </v-flex>
                                                                    </v-layout>
                                                                    <v-layout row class="ma-1">
                                                                        <v-flex xs12>
                                                                            <v-text-field type="email" label="Correo"
                                                                                          v-model="emailNew"
                                                                                          :rules="emailRules"
                                                                                          prepend-icon="email"
                                                                                          aria-required="true"
                                                                                          aria-autocomplete="list"/>
                                                                        </v-flex>
                                                                    </v-layout>
                                                                </v-card>
                                                            </v-col>
                                                            <v-col cols="6">
                                                                <v-card outlined elevation="5">
                                                                    <v-card-title class="font-weight-thin">Datos de
                                                                        usuario
                                                                    </v-card-title>
                                                                    <v-layout row class="ma-1">
                                                                        <v-flex xs12>
                                                                            <v-text-field type="text" label="Usuario"
                                                                                          v-model="usernameNew"
                                                                                          :rules="usernameRules"
                                                                                          prepend-icon="account_circle"
                                                                                          aria-autocomplete="list"
                                                                                          aria-required="true"/>
                                                                        </v-flex>
                                                                    </v-layout>
                                                                    <v-layout row class="ma-1">
                                                                        <v-flex xs12>
                                                                            <v-text-field type="password"
                                                                                          label="Contraseña"
                                                                                          v-model="passwordNew"
                                                                                          :rules="passwordRules"
                                                                                          prepend-icon="vpn_key"
                                                                                          aria-required="true"
                                                                                          aria-autocomplete="list"/>
                                                                        </v-flex>
                                                                    </v-layout>
                                                                    <v-layout row class="ma-1">
                                                                        <v-flex xs12>
                                                                            <v-text-field type="password"
                                                                                          label="Confirmar"
                                                                                          v-model="confirmPassNew"
                                                                                          :rules="passwordRules"
                                                                                          prepend-icon="shield"
                                                                                          aria-autocomplete="list"
                                                                                          aria-required="true"/>
                                                                        </v-flex>
                                                                    </v-layout>

                                                                </v-card>
                                                            </v-col>
                                                        </v-row>
                                                        <v-layout row class="ma-1 mt-3">
                                                            <v-flex xs12 class="text-right">
                                                                <v-btn class="mx-1" color="red" dark
                                                                       @click="cancelarButtonDialogInsertUser">Cancelar
                                                                </v-btn>
                                                                <v-btn class="mx-1" color="blue" dark type="submit"
                                                                       :disabled="!isFormNewCuentaValid">Siguiente<v-icon class="arrow_forward"/>
                                                                </v-btn>

                                                            </v-flex>
                                                        </v-layout>
                                                    </v-form>
                                                </v-stepper-content>
                                                <v-stepper-content step="2">
                                                    <v-container>
                                                    <v-row>
                                                        <v-col cols="6">
                                                            <v-card  shaped elevation="5">
                                                                <v-card-title>Roles</v-card-title>
                                                                <v-layout row class="ma-1" v-for="rol in roles" :key="rol.id">
                                                                    <v-flex xs12>
                                                                        <v-checkbox v-model="rolesNew"  :label="rol.roleName" :value="rol"/>
                                                                    </v-flex>
                                                                </v-layout>

                                                            </v-card>
                                                        </v-col>
                                                        <v-col>
                                                            <v-card  outlined elevation="5">
                                                                <v-card-title>Descripción de los permisos</v-card-title>
                                                                <v-card-text v-for="rol in rolesNew" :key="rol.id">- {{rol.description}}</v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                    </v-row>
                                                        <v-layout row class="mt-2" wrap>
                                                            <v-row>
                                                                <v-col cols="3">
                                                                        <v-flex xs12 class="text-left">
                                                                            <v-btn color="blue" dark  @click="backStepperUser">
                                                                                <v-icon left class="arrow_back"/>Atras</v-btn>
                                                                        </v-flex>
                                                                </v-col><v-col cols="9">                                                           <v-flex xs12 class="text-right">
                                                                    <v-btn class="mx-1" color="red" dark @click="cancelarButtonDialogInsertUser">Cancelar</v-btn>
                                                                    <v-btn class="mx-1" color="blue" dark @click="siguienteRolesDialogInsertUser">
                                                                        Siguiente<v-icon right class="arrow_forward"/></v-btn>
                                                                </v-flex>
                                                            </v-col>
                                                            </v-row>
                                                        </v-layout>
                                                    </v-container>
                                                </v-stepper-content>
                                                <v-stepper-content step="3">
                                                    <v-container>
                                                        <v-card shaped elevation="5">
                                                            <v-card-title>Información a guardar</v-card-title>
                                                            <v-divider></v-divider>
                                                            <v-row>
                                                                <v-col cols="6">
                                                                    <v-card-text>Nombre: {{fullnameNew}}</v-card-text>
                                                                    <v-card-text>Usuario: {{usernameNew}}</v-card-text>
                                                                    <v-card-text>Correo: {{emailNew}}</v-card-text>
                                                                    <v-card-text>Fecha de Nacimiento: {{birthDateNew}}</v-card-text>
                                                                </v-col>
                                                                <v-col cols="6">
                                                                    <v-card-text>Genero: {{genderNew==='f'?"Femenino":"Masculino"}}</v-card-text>
                                                                    <v-card-text>Roles:<v-card-text v-for="rol in rolesNew" :key="rol.id"> - {{rol.roleName}}</v-card-text></v-card-text>
                                                                </v-col>
                                                            </v-row>
                                                            <v-divider></v-divider>
                                                            <v-layout row wrap class="ma-1">
                                                                <v-flex class="text-right my-2">
                                                                    <v-btn class="mx-1" color="red" dark @click="cancelarButtonDialogInsertUser">Cancelar</v-btn>
                                                                    <v-btn class="mx-1" color="blue" dark @click="saveUser" :disabled="loading" :loading="loading">
                                                                        <span slot="loader" class="custom-loader">
                                                                            <v-icon dark class="refresh"/>
                                                                        </span>
                                                                        Confirmar</v-btn>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-container>
                                                </v-stepper-content>
                                            </v-stepper-items>
                                        </v-stepper>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title>¿Esta seguro de querer eliminar este usuario?</v-card-title>
                                        <v-card-actions>
                                            <v-btn text @click="deleteItem">Confirmar</v-btn>
                                            <v-btn text @click="dialogDelete=false">Cancelar</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="dialogEdit" max-width="600px" persistent>
                                    <v-card>
                                        <v-card-title class="font-weight-light">Editar datos del usuario</v-card-title>
                                        <v-container fluid>
                                            <v-form v-model="formEditIsValid" lazy-validation @submit.prevent="editDataOfUser" ref="formEditData">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field :rules="fullnameRules" v-model="fullnameEdit" label="Nombre" prepend-icon="text_fields"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field :rules="emailRules" v-model="emailEdit" label="Correo" prepend-icon="email"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-menu ref="menuDatePickerEdit"
                                                                v-model="menuDatePickerEdit"
                                                                :close-on-content-click="false"
                                                                :return-value.sync="birthDateNew"
                                                                transition="scale-transition"
                                                                offset-y
                                                                max-width="290px"
                                                                min-width="auto"
                                                        >
                                                            <template v-slot:activator="{on,attrs}">
                                                                <v-text-field v-model="dobEdit"
                                                                              label="Fecha de nacimiento"
                                                                              readonly
                                                                              v-bind="attrs"
                                                                              v-on="on"
                                                                              prepend-icon="calendar_today"
                                                                              :rules="dateBirthRules">
                                                                </v-text-field>
                                                            </template>
                                                            <v-date-picker  v-model="dobEdit"
                                                                           no-title scrollable>
                                                                <v-spacer></v-spacer>
                                                                <v-btn text color="blue"
                                                                       @click="menuDatePickerEdit=false">
                                                                    Cancelar
                                                                </v-btn>
                                                                <v-btn text color="blue"
                                                                       @click="$refs.menuDatePickerEdit.save(dobEdit)">
                                                                    Seleccionar
                                                                </v-btn>
                                                            </v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <h4 class="font-weight-medium">Sexo</h4>
                                                        <v-radio-group row v-model="sexEdit">
                                                            <v-radio label="Masculino" value="m"
                                                                     color="blue"/>
                                                            <v-radio label="Femenino" value="f"
                                                                     color="blue"></v-radio>
                                                        </v-radio-group>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <h4 class="font-weight-medium">Roles</h4>
                                                        <v-row>
                                                            <v-col v-for="rol in roles" :key="rol.id" :cols="12/roles.length">
                                                                <v-checkbox v-model="rolesEdit"  :value="rol" :label="rol.roleName" color="blue"/>
                                                            </v-col>
                                                        </v-row>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn color="blue" :disabled="!formEditIsValid||loading" :loading="loading" type="submit">
                                                            <span slot="loader" class="custom-loader" dark>
                                                                <v-icon light>refresh</v-icon>
                                                            </span>
                                                            Editar
                                                        </v-btn>
                                                        <v-btn color="red" class="mx-1" @click="dialogEdit=false">Cancelar</v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{item}">
                            <v-icon class="mr-2" @click="editItem(item)" color="orange">
                                edit
                            </v-icon>
                            <v-icon class="mr-2" @click="dialogOpenDelete(item)" color="red">delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {
        URL_DELETE_USER,
        URL_FETCH_ALL_ROLES,
        URL_FETCH_ALL_USERS,
        URL_GET_USER_BY_USERNAME, URL_UPDATE_USER
    } from "../../urlResources";
    import {mapGetters} from "vuex";
    import axios from "axios"
    import Notification from "../utils/Notification";

    export default {
        name: "UserServiceMain",
        components: {Notification},
        data: () => {
            return {
                search:'',
                headers: [
                    {text: "Nombre", value: "fullname", align: 'center'},
                    {text: "Usuario", value: "username", align: 'center'},
                    {text: "Correo", value: "email", align: 'center'},
                    {text: "Estado", value: "status", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                users: [],
                dialogInsertUser: false,
                dialogDelete: false,
                dialogEdit: false,
                stepperAddUser: 1,
                fullnameNew: '',
                usernameNew: '',
                genderNew: '',
                birthDateNew: '',
                passwordNew: '',
                confirmPassNew: '',
                emailNew: '',
                rolesNew: [],
                userNew:null,
                roles:[],
                userToDelete:null,
                fullnameRules: [
                    fullname => !!fullname || "El nombre es requerido",
                    fullname => fullname.length > 8 || "El nombre debe tener al menos 8 caracteres"
                ],
                usernameRules: [
                    username => !!username || "El nombre de usuario es requerido",
                    username => username.length > 4 || "El nombre de usuario necesita al menos 4 caracteres"
                ],
                passwordRules: [
                    password => !!password || "La contraseña es requerida",
                    password => password.length > 6 || "La contraseña debe tener al menos 6 caracteres"
                ],
                emailRules: [
                    email => !!email || "El correo es requerido",
                    email => /.@+./.test(email) || "El correo no es valido"
                ],
                dateBirthRules:[
                    date=>!!date||"La fecha es requerida"
                ],
                menuDatePicker: false,
                menuDatePickerEdit: false,
                isFormNewCuentaValid: true,
                typeAlert: "error",
                showAlert: false,
                infoAlert: '',
                fullnameEdit: '',
                dobEdit:'',
                sexEdit:'',
                emailEdit:'',
                rolesEdit:[],
                formEditIsValid:true,
                userToEdit:[],
                showSnackNotification:false,
                snackAlertType:'',
                snackInfo:'',
                iconSnack:''
            }
        },
        computed: {
            ...mapGetters(['loading','loadingTable','user']),

        },
        methods: {
            cargarDatosTabla() {
                this.$store.commit('setLoadingTable', true);
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_USERS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {

                    let pos=0;
                    let found=false;
                    while (pos<data.length&&!found){
                        if(data[pos].username===this.user.username){
                            found=true;
                        }else{
                            pos++;
                        }
                    }
                    const userDrop = data.splice(pos,1);
                    console.log(userDrop);
                    this.users=data;
                    console.log(data);
                    this.$store.commit('setLoadingTable', false);
                    this.showSnackNotification=true;
                    this.snackAlertType="success";
                    this.snackInfo="Se han cargado los datos de los usuarios con exito";
                    this.iconSnack="info_outline";
                    this.search='';
                }).catch((err) => {
                    this.$store.commit('setLoadingTable', false)
                    console.log(err)
                })
            },
            dialogOpenDelete(item){
                this.dialogDelete=true;
                this.userToDelete = item;
            },
            deleteItem() {
                const token = localStorage.getItem('token')
                let deletedELement = null;
                axios.post(URL_DELETE_USER,this.userToDelete,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data)
                    let pos = this.users.indexOf(this.userToDelete);
                    deletedELement = this.users.splice(pos,1);
                    this.userToDelete=null;
                    this.dialogDelete=false;
                    this.showSnackNotification=true;
                    this.snackAlertType="success";
                    this.snackInfo="Se ha eliminado el usuario con exito";
                    this.iconSnack="info_outline"
                }).catch((err)=>{
                    console.log(err);
                    this.users.push(deletedELement);
                    this.userToDelete=null;
                })
                console.log(this.userToDelete)
            },
            editItem(item) {
                this.fullnameEdit = item.fullname;
                this.dobEdit = item.dob;
                this.sexEdit = item.gender;
                this.emailEdit = item.email;
                this.rolesEdit = item.roles;
                console.log(item)
                this.dialogEdit = true;
                this.userToEdit = item;
            },
            getColorChip(item) {
                if (item.status === 'A') return 'green'
                else if (item.status === 'B') return 'red'
            },
            getChipName(item) {
                if (item.status === 'A') return 'Activo'
                else if (item.status === 'B') return 'Bloqueado'
            },
            backStepperUser(){
              this.stepperAddUser=this.stepperAddUser-1;
            },
            continueInNewUser() {
                if (this.$refs.formNewUserAccount.validate()) {
                    if (this.passwordNew === this.confirmPassNew) {
                        const token = localStorage.getItem('token');
                        axios.get(URL_GET_USER_BY_USERNAME + this.usernameNew, {
                            headers: {
                                "Authorization": "Bearer " + token,
                                "cache-control": "no-cache",
                            }
                        }).then(() => {
                            this.typeAlert = 'error';
                            this.showAlert = true;
                            this.infoAlert = "El nombre de usuario ya existe";
                            this.usernameNew = '';
                        }).catch(() => {
                            this.stepperAddUser = 2
                            this.showAlert=false;
                        })
                    } else {
                        this.typeAlert = 'error';
                        this.showAlert = true;
                        this.infoAlert = 'Las contraseñas deben coincidir'
                        this.passwordNew = '';
                        this.confirmPassNew = '';
                    }
                }
            },
            cargarRoles(){
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_ROLES,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.roles = data;
                    console.log(data)
                }).catch(err=>console.log(err));
            },
            cancelarButtonDialogInsertUser(){
                this.dialogInsertUser=false;
                this.confirmPassNew='';
                this.usernameNew='';
                this.passwordNew='';
                this.birthDateNew='';
                this.rolesNew=[];
                this.emailNew='';
                this.fullnameNew='';
                this.genderNew='';
                this.showAlert=false;
                this.stepperAddUser=1;
            },
            siguienteRolesDialogInsertUser(){
                if(this.rolesNew.length>0){
                    this.stepperAddUser=3;
                    this.showAlert=false;
                }else{
                    this.typeAlert = 'error';
                    this.showAlert = true;
                    this.infoAlert = "Debe seleccionar algún rol para el usuario";
                }
            },
            saveUser(){
                const userNew={
                    dob: this.birthDateNew,
                    email: this.emailNew,
                    fullname: this.fullnameNew,
                    gender: this.genderNew,
                    lang: "es",
                    password: this.passwordNew,
                    roles:this.rolesNew,
                    username: this.usernameNew,
                    status:'A'
                }
                this.$store.dispatch('saveUser',userNew).then(()=>{
                    console.log("exito");
                    this.dialogInsertUser=false;
                    this.confirmPassNew='';
                    this.usernameNew='';
                    this.passwordNew='';
                    this.birthDateNew='';
                    this.rolesNew=[];
                    this.emailNew='';
                    this.fullnameNew='';
                    this.genderNew='';
                    this.showAlert=false;
                    this.stepperAddUser=1;
                    this.users.push(userNew);
                    this.showSnackNotification=true;
                    this.snackAlertType="success";
                    this.snackInfo="Se ha insertado el usuario exitosamente";
                    this.iconSnack="info_outline"
                })
                .catch(err=>{
                    this.typeAlert = 'error';
                    this.showAlert = true;
                    this.infoAlert = err;
                    console.log(err)
                    let pos = this.users.indexOf(userNew);
                    this.users.splice(pos,1);
                })
            },
            editDataOfUser(){
                 const editedUser=
                {
                    dob: this.dobEdit,
                    email: this.emailEdit,
                    fullname: this.fullnameEdit,
                    gender: this.sexEdit,
                    id: this.userToEdit.id,
                    lang: this.userToEdit.lang,
                    loginAttempt: 0,
                    password: this.userToEdit.password,
                    profile_id: 0,
                    roles: this.rolesEdit,
                    status: this.userToEdit.status,
                    username: this.userToEdit.username
                }
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true)
                if(this.$refs.formEditData.validate()){
                    axios.post(URL_UPDATE_USER,editedUser,{
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data})=>{
                        console.log(data);
                        this.dialogEdit=false;
                        this.$store.commit('setLoading',false)
                        const pos = this.users.indexOf(this.userToEdit)
                        this.users.splice(pos,1);
                        this.users.push(editedUser);
                        this.showSnackNotification=true;
                        this.snackAlertType="success";
                        this.snackInfo="Se ha editado correctamente";
                        this.iconSnack="info_outline"
                    }).catch(err=>{
                        console.log(err);
                        this.$store.commit('setLoading',false)
                        this.showSnackNotification=true;
                        this.snackAlertType="error";
                        this.snackInfo="err";
                        this.iconSnack="error_outline";
                    })
                }
            }
        },
        created() {
            this.cargarDatosTabla();
            this.cargarRoles();
        },
        watch:{
            rolesNew(value){
                if(value){
                    console.log(value)
                }
            }


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