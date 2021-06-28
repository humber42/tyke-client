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
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="semestreSelected"
                                                                :items="semestresList"
                                                                label="Semestre"
                                                                prepend-icon="timer"
                                                                :rules="semestreRules"
                                                        ></v-combobox>
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
                                <!--Asignar asignatura a carreras-->
                                <v-dialog v-model="dialogAddCareers" persistent max-width="800px">
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Asignar {{asignaturaToAddCareer.nombre}} a carreras</v-card-title>
                                            <v-row>
                                                <!--Estdudiantes disponibles-->
                                                <v-col cols="5">
                                                    <v-card outlined elevation="8" rounded>
                                                        <div class="text-center pa-3">
                                                            <h3 class="font-weight-regular">Carreras disponibles</h3>
                                                        </div>
                                                        <v-divider/>
                                                        <div v-if="loading" class="text-center mt-3 mb-3">
                                                            <v-progress-circular
                                                                    :size="50"
                                                                    color="blue"
                                                                    indeterminate
                                                            ></v-progress-circular>
                                                        </div>

                                                        <v-list-item-group v-else v-model="careerSelected" color="indigo">
                                                            <v-list-item v-for="career in careersList"
                                                                         :key="career.id" @click="someCareerSelected=true">
                                                                <v-list-item-content>
                                                                    <v-list-item-title>- {{career.nombre}}
                                                                    </v-list-item-title>
                                                                </v-list-item-content>
                                                            </v-list-item>
                                                        </v-list-item-group>
                                                    </v-card>
                                                </v-col>
                                                <!--Botones-->
                                                <v-col cols="2" >
                                                    <div>
                                                        <v-sheet class="align-center ml-8">
                                                            <v-flex class="text-center">
                                                                <v-layout row class="ma-1">
                                                                    <v-btn icon outlined @click="addAllStudentToAssignGroup">
                                                                        <v-icon class="last_page"/>
                                                                    </v-btn>
                                                                </v-layout>
                                                                <v-layout row class="ma-1">
                                                                    <v-btn icon :disabled="!someCareerSelected" outlined
                                                                           @click="addStudentToAssignGroup">
                                                                        <v-icon class="navigate_next"/>
                                                                    </v-btn>
                                                                </v-layout>
                                                                <v-layout row class="ma-1">
                                                                    <v-btn icon outlined :disabled="!someCareerSelectedRigth"
                                                                           @click="removeStudentFromGroup">
                                                                        <v-icon class="navigate_before"/>
                                                                    </v-btn>
                                                                </v-layout>
                                                                <v-layout row class="ma-1">
                                                                    <v-btn icon outlined @click="removeAllStudenFromGroup">
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
                                                            <h3 class="font-weight-regular">Carreras asignadas</h3>
                                                        </div>
                                                        <v-divider/>

                                                        <v-list-item-group v-model="careerToAsignSelected"
                                                                           color="indigo">
                                                            <v-list-item v-for="item in careersToAsign" :key="item.id"
                                                                         @click="someCareerSelectedRigth=true">
                                                                <v-list-item-content>
                                                                    <v-list-item-title>- {{item.nombre}}
                                                                    </v-list-item-title>
                                                                </v-list-item-content>
                                                            </v-list-item>
                                                        </v-list-item-group>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                            <v-card-actions>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn color="green" style="color: white!important;" class="mx-1" @click="assignSignatureToCareer">Asignar</v-btn>
                                                        <v-btn class="mx-1" @click="cancelarDialogAssignSignatures" color="red" style="color: white!important;">Cancelar</v-btn>
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
                                <span>Editar asignatura</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" @click="addToCareer(item)" color="accent">
                                        assignment
                                    </v-icon>
                                </template>
                                <span>Añadir a carrera</span>
                            </v-tooltip>

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
    import {
        URL_ASSIGN_SIGNATURES_TO_CAREERS,
        URL_FETCH_ALL_ASIGNATURAS, URL_GET_ALL_CAREERS,
        URL_GET_SEMESTERS,
        URL_SAVE_ASIGNATURA,
        URL_UPDATE_ASiGNATURA
    } from "../../urlResources";
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
                semestresList:[],
                semestreSelected:'',
                semestreRules:[
                    semestre=>!!semestre||"El semestre es requerido"
                ],
                asignaturaToAddCareer:'',
                careersList:[],
                careersToAsign:[],
                careerSelected:0,
                careerToAsignSelected:0,
                someCareerSelected: false,
                someCareerSelectedRigth:false,
                dialogAddCareers:false
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
                    console.log(data)
                }).catch(err => {
                    console.log(err);
                    this.$store.commit('setLoadingTable', false);
                    this.showSnackNotification = true;
                    this.iconSnack = 'danger';
                    this.snackInfo = "Ha ocurrido un error al cargar las asignaturas";
                    this.snackAlertType = 'error';
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
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
                    nombre: this.asignaturaNameNew,
                    semestre: this.semestreSelected
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
                    if(error.response.status===403){
                        this.$router.push("/403");
                    }

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
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            getAllCareers(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true)
                axios.get(URL_GET_ALL_CAREERS,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.$store.commit('setLoading',false)
                    this.careersList=data;
                }).catch(err=>{
                    console.log(err);
                    this.$store.commit('setLoading',false)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            getAllSemestres(){
                const token = localStorage.getItem('token');
                axios.get(URL_GET_SEMESTERS,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    let i =0;
                    while(i<data.length){
                        this.semestresList.push(data[i].semestre);
                        i++;
                    }
                }).catch(err=>{
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            addToCareer(item){
                console.log(item);
                this.asignaturaToAddCareer=item;
                this.getAllCareers();
                this.dialogAddCareers=true;
            },
            /**
             * Methods to rigth function
             */
            addStudentToAssignGroup() {
                let student = this.careersList.splice(this.careerSelected, 1)
                this.careersToAsign.push(student[0]);
                console.log(this.careersToAsign);
                this.careerSelected = [];
                this.someCareerSelected = false;
            },
            addAllStudentToAssignGroup() {
                this.careersToAsign = this.careersList;
                this.careersList = [];
                this.someCareerSelected = false;
                this.someCareerSelectedRigth = false;
            },
            removeStudentFromGroup() {
                console.log(this.careerToAsignSelected)
                let student = this.careersToAsign.splice(this.careerToAsignSelected, 1);
                this.careersList.push(student[0]);
                console.log(this.careersList);
                this.careerToAsignSelected = [];
                this.someCareerSelectedRigth = false;
            },
            removeAllStudenFromGroup() {
                while (this.careersToAsign.length > 0) {
                    let student2 = this.careersToAsign.pop()
                    this.careersList.push(student2);
                }
                this.careersToAsign = [];
                this.someCareerSelectedRigth = false;
            },
            cancelarDialogAssignSignatures(){
                this.dialogAddCareers=false;
                this.careersList=[];
                this.careersToAsign=[];
                this.someCareerSelected=false;
                this.someCareerSelectedRigth=false;
                this.careerSelected=null;
                this.careerToAsignSelected=null;
            },
            assignSignatureToCareer(){
                let i = 0;
                const token =  localStorage.getItem('token');
                while(i<this.careersToAsign.length){
                    let payload ={
                        idCareer: this.careersToAsign[i].id,
                        idSignature: this.asignaturaToAddCareer.id
                    }
                    axios.post(URL_ASSIGN_SIGNATURES_TO_CAREERS,payload,{
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data})=>{
                        console.log(data)
                    }).catch(err=>{
                        console.log(err)
                        i=this.careersToAsign.length
                        if(err.response.status===403){
                            this.$router.push("/403");
                        }
                    })
                    i++;
                }
                this.dialogAddCareers = false;
            }
        },
        computed: {
            ...mapGetters(['loadingTable', 'loading'])
        },
        created() {
            this.cargarDatosAsignaturas();
            this.getAllSemestres();
            //this.getAllCareers();
        }
    }
</script>

<style scoped>

</style>