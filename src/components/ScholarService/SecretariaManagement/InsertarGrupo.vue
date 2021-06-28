<template>
    <v-container>
        <v-row>
            <v-col cols="10">
                <h1 class="font-weight-thin">Crear grupo</h1>
            </v-col>
            <v-col cols="2">
                <v-btn color="red" class="mt-2" dark @click="cancelar">
                    <v-icon class="close"/>
                    Cancelar
                </v-btn>
            </v-col>
        </v-row>
        <v-container fluid>
            <v-card elevation="10" width="990">
                <v-stepper v-model="stepperStep">
                    <v-stepper-header>
                        <v-stepper-step :complete="stepperStep>1" step="1">
                            Datos del Grupo
                        </v-stepper-step>
                        <v-divider/>
                        <v-stepper-step :complete="stepperStep>2" step="2">
                            Estudiantes
                        </v-stepper-step>
                        <v-divider/>
                        <v-stepper-step step="3">
                            Información
                        </v-stepper-step>
                    </v-stepper-header>
                    <v-stepper-items>
                        <!--Step 1 datos del grupo-->
                        <v-stepper-content step="1">
                            <v-card>
                                <v-card-title>Datos del grupo</v-card-title>
                                <v-alert type="error" dismissible v-model="alertShow" transition="scale-transition">
                                    {{infoAlert}}
                                </v-alert>
                                <v-row>
                                    <v-col cols="6">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field prepend-icon="people" label="Grupo" v-model="nombreGrupo"
                                                              type="text" clearable :rules="groupNameRules"/>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field prepend-icon="format_list_number" label="Año"
                                                              v-model="annoGrupo"
                                                >
                                                    <template v-slot:append>
                                                        <v-icon class="remove" @click="disminuirValorSpinner"/>
                                                        <v-icon class="add" @click="aumentarValorSpinner"></v-icon>
                                                    </template>
                                                </v-text-field>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-combobox
                                                        v-model="courseSelected"
                                                        :items="courseList"
                                                        label="Curso"
                                                        prepend-icon="date_range"
                                                        :rules="courseRules"
                                                ></v-combobox>
                                            </v-flex>
                                        </v-layout>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-combobox
                                                        v-model="facultySelected"
                                                        :items="facultadesList"
                                                        label="Facultad"
                                                        prepend-icon="apartment"
                                                        :rules="facultadRules"
                                                        @change="getCareersByFacultyName"
                                                ></v-combobox>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-combobox
                                                        v-model="carreraSelected"
                                                        :items="carrerasList"
                                                        label="Carreras"
                                                        prepend-icon="school"
                                                        :rules="[carrera=>!!carrera||'La carrera es requerida']"

                                                ></v-combobox>
                                            </v-flex>
                                        </v-layout>

                                    </v-col>
                                </v-row>
                                <v-card-actions>
                                    <v-layout row class="ma-1">
                                        <v-flex class="text-right">
                                            <v-btn fab dark color="green" @click="nextFirstStep">
                                                <v-icon class="navigate_next"/>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>

                                </v-card-actions>
                            </v-card>
                        </v-stepper-content>

                        <!--Step 2 estudiantes disponibles-->
                        <v-stepper-content step="2">
                            <v-card>
                                <v-alert type="error" dismissible v-model="alertShow" transition="scale-transition">
                                    {{infoAlert}}
                                </v-alert>
                                <v-card-title>Añadir estudiantes</v-card-title>
                                <v-row>
                                    <!--Estdudiantes disponibles-->
                                    <v-col cols="5">
                                        <v-card outlined elevation="8" rounded>
                                            <div class="text-center pa-3">
                                                <h3 class="font-weight-regular">Estudiantes disponibles</h3>
                                            </div>
                                            <v-divider/>
                                            <div v-if="loading" class="text-center mt-3">
                                                <v-progress-circular
                                                        :size="50"
                                                        color="blue"
                                                        indeterminate
                                                ></v-progress-circular>
                                            </div>

                                            <v-list-item-group v-else v-model="estudiantesSelected" color="indigo">
                                                <v-list-item v-for="estudiante in estdiantesFacultad"
                                                             :key="estudiante.id" @click="someStudentIsSelected=true">
                                                    <v-list-item-content>
                                                        <v-list-item-title>- {{estudiante.usuario.fullname}}
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
                                                        <v-btn icon :disabled="!someStudentIsSelected" outlined
                                                               @click="addStudentToAssignGroup">
                                                            <v-icon class="navigate_next"/>
                                                        </v-btn>
                                                    </v-layout>
                                                    <v-layout row class="ma-1">
                                                        <v-btn icon outlined :disabled="!someStudentIsSelectedRigth"
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
                                                <h3 class="font-weight-regular">Estudiantes asignados</h3>
                                            </div>
                                            <v-divider/>

                                            <v-list-item-group v-model="estudiantesSelectedAdded"
                                                               color="indigo">
                                                <v-list-item v-for="item in estudiantesParaGrupo" :key="item.id"
                                                             @click="someStudentIsSelectedRigth=true">
                                                    <v-list-item-content>
                                                        <v-list-item-title>- {{item.usuario.fullname}}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-card-actions>
                                    <v-layout row class="ma-1">
                                    <v-flex class="text-left">
                                            <v-btn fab color="success" @click="backStep">
                                                <v-icon class="navigate_before"/>
                                            </v-btn>
                                        </v-flex>
                                        <v-flex class=" text-right">
                                            <v-btn fab color="success" @click="nextStepForSecondStep">
                                                <v-icon class="navigate_next"/>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-card-actions>
                            </v-card>
                        </v-stepper-content>

                        <!--Step informacion-->
                        <v-stepper-content step="3">
                            <v-card>
                                <v-container>
                                <v-card-title>Información del grupo</v-card-title>
                                <v-row class="ml-1">
                                    <v-col cols="3">
                                        <h3 class="font-weight-regular"><b>Grupo:</b> {{nombreGrupo}}</h3>
                                    </v-col>
                                    <v-col cols="2">
                                        <h3 class="font-weight-regular"><b>Año:</b> {{annoGrupo}}</h3>
                                    </v-col>
                                    <v-col cols="3">
                                        <h3 class="font-weight-regular"><b>Facultad:</b> {{facultySelected}}</h3>
                                    </v-col>
                                    <v-col cols="4">
                                        <h3 class="font-weight-regular"><b>Carrera:</b> {{carreraSelected}}</h3>
                                    </v-col>
                                </v-row>
                                <h3 class="mt-4 ml-4 mb-3 font-weight-medium">Estudiantes:</h3>
                                <v-row>
                                    <v-col cols="6" v-for="estudiante in estudiantesParaGrupo" :key="estudiante.id">
                                        <v-card outlined hover style="cursor: default">
                                            <v-card-title>{{estudiante.usuario.fullname}}</v-card-title>
                                            <v-card-subtitle>Correo: {{estudiante.usuario.email}}</v-card-subtitle>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                    <v-card-actions>
                                        <v-layout row class="ma-1">
                                            <v-flex class="text-left">
                                                <v-btn fab color="success" @click="backLastStep">
                                                    <v-icon class="navigate_before"/>
                                                </v-btn>
                                            </v-flex>
                                            <v-flex class=" text-right">
                                                <v-btn class="mt-2" color="blue" style="color: white!important;" @click="saveGroup" :disabled="loading" :loading="loading">
                                                    <span slot="loader" class="custom-loader">
                                                    <v-icon>refresh</v-icon>
                                                </span>
                                                    <v-icon class="check"/> Listo
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-actions>


                                </v-container>
                            </v-card>
                        </v-stepper-content>

                    </v-stepper-items>
                </v-stepper>
            </v-card>
        </v-container>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from 'vuex'
    import {
        URL_FETCH_ALL_COURSES,
        URL_GET_ALL_FACULTIES,
        URL_GET_ALL_STUDENTS_BY_FACULTY, URL_GET_FACULTY_BY_NAME,
        URL_SAVE_GRUPO
    } from "../../../urlResources";

    export default {
        name: "InsertarGrupo",
        data() {
            return {
                facultadesList: [],
                estdiantesFacultad: [],
                courseList: [],
                facultySelected: '',
                estudiantesParaGrupo: [],
                stepperStep: 1,
                nombreGrupo: '',
                annoGrupo: 1,
                courseSelected: '',
                groupNameRules: [
                    groupName => !!groupName || "El grupo es requerido",
                    groupName => groupName.length > 3 || "El nombre del grupo necesita mas de 3 caracteres"
                ],
                facultadRules: [
                    facultad => !!facultad || "La facultad es requerida"
                ],
                courseRules: [
                    course => !!course || "El curso es requerido"
                ],
                infoAlert: '',
                alertShow: false,
                estudiantesSelected: [],
                estudiantesSelectedAdded: [],
                someStudentIsSelected: false,
                someStudentIsSelectedRigth: false,
                carrerasList:[],
                carreraSelected:''

            }
        },
        computed: {
            ...mapGetters(['loading'])
        },
        methods: {
            cancelar() {
                this.$router.back();
            },
            getFacultyList() {
                const token = localStorage.getItem('token');
                axios.get(URL_GET_ALL_FACULTIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    console.log(data);
                    let i = 0;
                    while (i < data.length) {
                        this.facultadesList.push(data[i].facultad);
                        i++;
                    }
                }).catch(err => {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            getCourses() {
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_COURSES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    let i = 0;
                    while (i < data.length) {
                        if (data[i].activo) {
                            this.courseList.push(data[i].curso);
                        }
                        i++;
                    }
                    console.log(this.courseList);
                }).catch(err => {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            getCareersByFacultyName(){
                const token = localStorage.getItem('token')
                this.carreraSelected='';
                this.carrerasList=[];
                axios.get(URL_GET_FACULTY_BY_NAME,{
                    params:{
                        name: this.facultySelected
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    let i = 0;
                    while(i<data.carrerasById.length){
                        this.carrerasList.push(data.carrerasById[i].nombre);
                        i++;
                    }
                }).catch(err=>{
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            aumentarValorSpinner() {
                if (this.annoGrupo < 5) {
                    this.annoGrupo++
                }
            },
            disminuirValorSpinner() {
                if (this.annoGrupo > 1) {
                    this.annoGrupo--;
                }
            },
            nextFirstStep() {
                if (this.groupName === '' || this.facultySelected === '' || this.courseSelected === "") {
                    this.alertShow = true;
                    this.infoAlert = "Existen campos requeridos en blanco"
                } else {
                    this.getEstudiantesDeFacultad()
                    this.stepperStep = 2;
                }
            },
            backStep() {
                this.stepperStep--;
                this.estudiantesParaGrupo = [];
                this.alertShow=false;
            },
            backLastStep() {
                this.stepperStep--;
                this.alertShow=false;
            },
            getEstudiantesDeFacultad() {
                const token = localStorage.getItem('token')
                this.$store.commit('setLoading', true)
                axios.get(URL_GET_ALL_STUDENTS_BY_FACULTY, {
                    params: {
                        nameFaculty: this.facultySelected,
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    console.log(data)
                    this.$store.commit('setLoading', false)
                    this.estdiantesFacultad = data;
                }).catch((err) => {
                    console.log(err)
                    this.$store.commit('setLoading', false)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            addStudentToAssignGroup() {

                let student = this.estdiantesFacultad.splice(this.estudiantesSelected, 1)
                this.estudiantesParaGrupo.push(student[0]);
                console.log(this.estudiantesParaGrupo);
                this.estudiantesSelected = [];
                this.someStudentIsSelected = false;


            },
            addAllStudentToAssignGroup() {
                this.estudiantesParaGrupo = this.estdiantesFacultad;
                this.estdiantesFacultad = [];
                this.someStudentIsSelected = false;
                this.someStudentIsSelectedRigth = false;
            },
            removeStudentFromGroup() {
                console.log(this.estudiantesSelectedAdded)
                let student = this.estudiantesParaGrupo.splice(this.estudiantesSelectedAdded, 1);
                this.estdiantesFacultad.push(student[0]);
                console.log(this.estdiantesFacultad);
                this.estudiantesSelectedAdded = [];
                this.someStudentIsSelectedRigth = false;
            },
            removeAllStudenFromGroup() {
                while (this.estudiantesParaGrupo.length > 0) {
                    let student2 = this.estudiantesParaGrupo.pop()
                    this.estdiantesFacultad.push(student2);
                }
                this.estudiantesParaGrupo = [];
                this.someStudentIsSelected = false;
                this.someStudentIsSelectedRigth = false;
            },
            nextStepForSecondStep(){
                if(this.estudiantesParaGrupo.length===0){
                    this.alertShow=true;
                    this.infoAlert="Debe añadir estudiantes al grupo";
                }else{
                    this.stepperStep=3;
                }
            },
            saveGroup(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true);
                const payload = {
                    anno:this.annoGrupo,
                    curso:this.courseSelected,
                    estudiantes:this.estudiantesParaGrupo,
                    grupo: this.nombreGrupo,
                    carrera:this.carreraSelected

                }
                console.log(payload);
                axios.post(URL_SAVE_GRUPO,payload,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    this.$store.commit('setLoading',false)
                    console.log(data)
                    this.$router.back();
                }).catch((err)=> {
                    console.log(err);
                    this.$store.commit('setLoading',false)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });

            }
        },
        created() {
            this.getFacultyList();
            this.getCourses();
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