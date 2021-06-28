<template>
    <v-container>
        <v-row>
            <v-col cols="10">
                <h1 class="font-weight-thin">Crear estrategia</h1>
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
                            Datos de la estrategia
                        </v-stepper-step>
                        <v-divider/>
                        <v-stepper-step :complete="stepperStep>2" step="2">
                            Conformar estrategia
                        </v-stepper-step>
                        <v-divider/>
                        <v-stepper-step :complete="stepperStep>3" step="3">
                            Agregar preguntas
                        </v-stepper-step>
                        <v-divider/>
                        <v-stepper-step step="4">
                            Resumen de la estrategia
                        </v-stepper-step>
                    </v-stepper-header>
                    <v-stepper-items>
                        <!--Step 1 datos de la estrategia-->
                        <v-stepper-content step="1">
                            <v-card>
                                <v-container>
                                    <v-form v-model="isFormValidStepOne" ref="formStepOne" lazy-validation
                                            @submit.prevent="nextStepOne">
                                        <v-card-title>Información general de la estrategia</v-card-title>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field prepend-icon="text_fields"
                                                                      label="Nombre de la estrategia"
                                                                      v-model="informacionEstrategia.nombre"
                                                                      :rules="[titulo=>!!titulo||'El nombre de la estrategia es requerido']"
                                                                      aria-required="true" aria-autocomplete="list"/>

                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-checkbox v-model="informacionEstrategia.habilitada"
                                                            label="Habilitada"/>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-slider prepend-icon="score"
                                                                  v-model="informacionEstrategia.puntos"
                                                                  label="Puntos" thumb-label="always"
                                                                  min="10" max="80"
                                                                  hint="Cantidad de puntos al completar estrategia"></v-slider>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-checkbox v-model="informacionEstrategia.evaluada"
                                                                label="Evaluada"/>
                                                </v-layout>
                                            </v-col>
                                        </v-row>
                                        <v-card-actions>
                                            <v-layout row class="ma-1">
                                                <v-flex class="text-right" xs12>
                                                    <v-btn type="submit" :disabled="!isFormValidStepOne" color="success"
                                                           fab>
                                                        <v-icon class="navigate_next"/>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-actions>
                                    </v-form>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <!--Step 2 Conformar estrategia-->
                        <v-stepper-content step="2">
                            <v-card>
                                <v-container>
                                    <v-card-title>Tipo de pregunta y respuestas</v-card-title>
                                    <v-alert type="error" dismissible v-model="alertShow" transition="scale-transition">
                                        {{infoAlert}}
                                    </v-alert>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox
                                                    :loading="cargandoAsignaturas"
                                                    v-model="informacionEstrategia.asignatura"
                                                    :items="profesorAsignaturasList.asignaturas"
                                                    label="Asignaturas"
                                                    hide-selected
                                                    prepend-icon="chrome_reader_mode"
                                                    :rules="[asignatura=>!!asignatura||'La asignatura es requerida']"
                                                    @change="changeTemasAndGroups"
                                            ></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <div v-if="informacionEstrategia.asignatura!==''">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-combobox
                                                        :loading="cargandoTemas"
                                                        v-model="informacionEstrategia.temas"
                                                        :items="temasListComboBox"
                                                        label="Temas"
                                                        prepend-icon="bookmark"
                                                        multiple
                                                        chips
                                                        clearable
                                                        :rules="[asignatura=>!!asignatura||'El tema es requerido']"
                                                ></v-combobox>
                                            </v-flex>
                                        </v-layout>
                                        <v-row>
                                            <v-row>
                                                <!--Grupos disponibles-->
                                                <v-col cols="6">
                                                    <v-card outlined elevation="8" rounded>
                                                        <div class="text-center pa-3">
                                                            <h3 class="font-weight-regular">Grupos disponibles
                                                                <v-btn class="ml-3" icon outlined
                                                                       @click="addAllStudentToAssignGroup"
                                                                       :disabled="gruposList.length===0">
                                                                    <v-icon class="last_page"/>
                                                                </v-btn>
                                                            </h3>
                                                        </div>
                                                        <v-divider/>
                                                        <div v-if="cargandoGrupos" class="text-center mt-3">
                                                            <v-progress-circular
                                                                    :size="50"
                                                                    color="blue"
                                                                    indeterminate
                                                            ></v-progress-circular>
                                                        </div>
                                                        <v-virtual-scroll :items="gruposList" v-else height="250"
                                                                          item-height="64">
                                                            <template v-slot:default="{item}">
                                                                <v-list-item :key="item.id">
                                                                    <v-list-item-content>
                                                                        <v-list-item-title>{{item.grupo}}
                                                                        </v-list-item-title>
                                                                    </v-list-item-content>
                                                                    <v-list-item-action>
                                                                        <v-btn icon
                                                                               @click="passToTheAssignedGroups(item)">
                                                                            <v-icon class="navigate_next"/>
                                                                        </v-btn>
                                                                    </v-list-item-action>
                                                                </v-list-item>
                                                            </template>
                                                        </v-virtual-scroll>
                                                    </v-card>
                                                </v-col>
                                                <!--Grupos annadidos-->
                                                <v-col cols="6">
                                                    <v-card outlined elevation="8" rounded>
                                                        <div class="text-center pa-3">
                                                            <h3 class="font-weight-regular">
                                                                <v-btn icon outlined class="mr-3"
                                                                       :disabled="informacionEstrategia.gruposAssigned.length===0"
                                                                       @click="removeAllStudenFromGroup">
                                                                    <v-icon class="first_page"/>
                                                                </v-btn>
                                                                Grupos asignados
                                                            </h3>
                                                        </div>
                                                        <v-divider/>
                                                        <v-virtual-scroll :items="informacionEstrategia.gruposAssigned"
                                                                          height="250" item-height="64">
                                                            <template v-slot:default="{item}">
                                                                <v-list-item :key="item.id">
                                                                    <v-list-item-action>
                                                                        <v-btn icon @click="passToTheListGroups(item)">
                                                                            <v-icon class="navigate_before"/>
                                                                        </v-btn>
                                                                    </v-list-item-action>
                                                                    <v-list-item-content>
                                                                        <v-list-item-title>{{item.grupo}}
                                                                        </v-list-item-title>
                                                                    </v-list-item-content>
                                                                </v-list-item>
                                                            </template>
                                                        </v-virtual-scroll>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-row>
                                    </div>
                                    <v-row class="mt-3">
                                        <v-layout row class="ma-1 mt-2">
                                            <v-flex class="text-left" @click="backToStepOne">
                                                <v-btn color="success" fab elevation="0">
                                                    <v-icon class="navigate_before"/>
                                                </v-btn>
                                            </v-flex>
                                            <v-flex class="text-right">
                                                <v-btn color="success" elevation="0" @click="nextStepTwo" fab>
                                                    <v-icon class="navigate_next"/>
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <!--Step preguntas-->
                        <v-stepper-content step="3">
                            <v-card>
                                <v-container>
                                    <v-card-title>Agregar preguntas a la estrategia</v-card-title>
                                    <v-alert type="error" dismissible v-model="alertShow" transition="scale-transition">
                                        {{infoAlert}}
                                    </v-alert>
                                    <v-row>
                                        <!--Preguntas disponibles-->
                                        <v-col cols="6">
                                            <v-card outlined elevation="8" rounded>
                                                <div class="text-center pa-3">
                                                    <h3 class="font-weight-regular">Preguntas disponibles
                                                        <v-btn class="ml-3" icon outlined
                                                               @click="addAllToAssignedQuestions"
                                                               :disabled="preguntasAllData.length===0">
                                                            <v-icon class="last_page"/>
                                                        </v-btn>
                                                    </h3>
                                                </div>
                                                <v-divider/>
                                                <div v-if="cargandoPreguntas" class="text-center mt-3">
                                                    <v-progress-circular
                                                            :size="50"
                                                            color="blue"
                                                            indeterminate
                                                    ></v-progress-circular>
                                                </div>
                                                <v-virtual-scroll :items="preguntasAllData" v-else height="300"
                                                                  item-height="64">
                                                    <template v-slot:default="{item}">
                                                        <v-list-item :key="item.id">
                                                            <v-list-item-content>
                                                                <v-list-item-title>{{item.tituloPregunta}}
                                                                </v-list-item-title>
                                                                <v-list-item-subtitle>
                                                                    {{item.tipoPreguntaByIdTipoPregunta.tipo}}
                                                                </v-list-item-subtitle>
                                                            </v-list-item-content>
                                                            <v-list-item-action>
                                                                <v-btn icon @click="passToTheAssignedQuestions(item)">
                                                                    <v-icon class="navigate_next"/>
                                                                </v-btn>
                                                            </v-list-item-action>
                                                        </v-list-item>
                                                    </template>
                                                </v-virtual-scroll>
                                            </v-card>
                                        </v-col>
                                        <!--Grupos annadidos-->
                                        <v-col cols="6">
                                            <v-card outlined elevation="8" rounded>
                                                <div class="text-center pa-3">
                                                    <h3 class="font-weight-regular">
                                                        <v-btn icon outlined class="mr-3"
                                                               :disabled="informacionEstrategia.preguntas.length===0"
                                                               @click="addAllQuestionsList">
                                                            <v-icon class="first_page"/>
                                                        </v-btn>
                                                        Preguntas asignadas
                                                    </h3>
                                                </div>
                                                <v-divider/>
                                                <v-virtual-scroll :items="informacionEstrategia.preguntas" height="300"
                                                                  item-height="64">
                                                    <template v-slot:default="{item}">
                                                        <v-list-item :key="item.id">
                                                            <v-list-item-action>
                                                                <v-btn icon @click="passToTheListQuestions(item)">
                                                                    <v-icon class="navigate_before"/>
                                                                </v-btn>
                                                            </v-list-item-action>
                                                            <v-list-item-content>
                                                                <v-list-item-title>{{item.tituloPregunta}}
                                                                </v-list-item-title>
                                                                <v-list-item-subtitle>
                                                                    {{item.tipoPreguntaByIdTipoPregunta.tipo}}
                                                                </v-list-item-subtitle>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </template>
                                                </v-virtual-scroll>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-layout row class="ma-1 mt-2">
                                        <v-flex class="text-left" @click="backToStepTwo">
                                            <v-btn color="success" fab>
                                                <v-icon class="navigate_before"/>
                                            </v-btn>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn color="success" @click="nextStepThree" fab>
                                                <v-icon class="navigate_next"/>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <!--Step informacion-->
                        <v-stepper-content step="4">
                            <v-card>
                                <v-container>
                                    <v-card-title>Resumen de la estrategia</v-card-title>
                                    <v-alert type="error" dismissible v-model="alertShow" transition="scale-transition">
                                        {{infoAlert}}
                                    </v-alert>
                                    <v-row>
                                        <v-col>
                                            <v-card-text><b>Nombre de la estrategia:</b>
                                                {{informacionEstrategia.nombre}}
                                            </v-card-text>
                                        </v-col>
                                        <v-col>
                                            <v-card-text><b>Cantidad de puntos:</b> {{informacionEstrategia.puntos}}
                                            </v-card-text>
                                        </v-col>
                                        <v-col>
                                            <v-card-text><b>Habilitada:</b>
                                                {{informacionEstrategia.habilitada?'Si':'No'}}
                                            </v-card-text>
                                        </v-col>
                                        <v-col>
                                            <v-card-text><b>Evaluada:</b> {{informacionEstrategia.evaluada?'Si':'No'}}
                                            </v-card-text>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-card-text><b>Asignatura:</b> {{informacionEstrategia.asignatura}}
                                            </v-card-text>
                                        </v-col>
                                        <v-col>
                                            <v-card-text><b>Cantidad de grupos asignada:</b>
                                                {{informacionEstrategia.gruposAssigned.length}}
                                            </v-card-text>
                                        </v-col>
                                        <v-col>
                                            <v-card-text><b>Cantidad de preguntas:</b>
                                                {{informacionEstrategia.preguntas.length}}
                                            </v-card-text>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-card-title>Temas</v-card-title>
                                        <v-row>
                                            <v-col cols="4" v-for="tema in temasToSave" :key="tema.id"
                                                   class="ml-1 mr-1">
                                                <v-card shaped hover style="cursor: default">
                                                    <v-card-title>{{tema.nombre}}</v-card-title>
                                                    <v-card-subtitle>{{tema.description}}</v-card-subtitle>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-row>

                                    <v-layout row>
                                        <v-flex class="text-left mt-3 mb-2 ml-1">
                                            <v-btn color="success" fab @click="stepperStep--">
                                                <v-icon class="navigate_before"/>
                                            </v-btn>
                                        </v-flex>
                                        <v-flex class="text-right mt-3 mb-2">
                                            <v-btn @click="saveEstrategia" color="blue" :disabled="loading"
                                                   :loading="loading" style="color: white!important;">
                                                <span slot="loader" class="custom-loader"><v-icon>refresh</v-icon></span>
                                                Listo
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
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
    import {mapGetters} from "vuex";
    import axios from "axios";
    import {
        URL_ESTRATEGIA_SAVE,
        URL_GET_GROUPS_BY_PROFESOR_AND_ASIGNATURA, URL_GET_PREGUNTAS_BY_ASIGNATURA,
        URL_GET_PROFESOR_BY_USER_ID,
        URL_GET_TEMA_BY_ASIGNATURA_ID
    } from "../../urlResources";

    export default {
        name: "EstrategiaNewService",
        data() {
            return {
                stepperStep: 1,
                isFormValidStepOne: true,
                informacionEstrategia: {
                    nombre: '',
                    puntos: 0,
                    fecha: '',
                    habilitada: false,
                    evaluada: false,
                    asignatura: '',
                    temas: [],
                    preguntas: [],
                    gruposAssigned: [],
                },
                profesorAsignaturasList: '',
                asignaturasList: [],
                temasListAllData: [],
                temasListComboBox: [],
                preguntasAllData: [],
                cargandoTemas: false,
                cargandoGrupos: false,
                cargandoAsignaturas: false,
                cargandoPreguntas: false,
                gruposList: [],
                temasToSave: [],
                infoAlert: '',
                alertShow: false,
            }
        },
        methods: {
            cancelar() {
                this.$router.back();
            },
            nextStepOne() {
                this.getAllAsignaturasProfesorId();
                this.stepperStep++;
            },
            changeTemasAndGroups() {
                this.getAllGroupsByAsignaturaAndProfesor();
                this.getAllTemasByAsignatura();
            },
            passToTheAssignedGroups(item) {
                this.informacionEstrategia.gruposAssigned.push(item);
                const pos = this.gruposList.indexOf(item);
                this.gruposList.splice(pos, 1);
            },
            passToTheListGroups(item) {
                this.gruposList.push(item);
                const pos = this.informacionEstrategia.gruposAssigned.indexOf(item);
                this.informacionEstrategia.gruposAssigned.splice(pos, 1);
            },
            backToStepOne() {
                this.stepperStep--;
                this.informacionEstrategia.asignatura = '';
                this.informacionEstrategia.temas = [];
                this.informacionEstrategia.gruposAssigned = [];
            },
            nextStepTwo() {
                if (this.informacionEstrategia.asignatura === '') {
                    this.alertShow = true;
                    this.infoAlert = "Debe seleccionar una asignatura"
                } else if (this.informacionEstrategia.temas.length === 0) {
                    this.alertShow = true;
                    this.infoAlert = "Debe seleccionar un tema, si no hay ninguno debe crearse uno y asignarlo a la asignatura, es complicado pero divertido :)"
                } else if (this.informacionEstrategia.gruposAssigned.length === 0) {
                    this.alertShow = true;
                    this.infoAlert = "Debe asignar la estrategia a algún grupo, si no tiene grupos debe pedir que le asignen, reclame sus derechos profesor :)"
                } else {
                    this.stepperStep++;
                    this.getAllPreguntasByAsignatura();
                    this.getAllTemasAssignedObject();
                    this.alertShow = false;
                    this.infoAlert = ''
                }
            },
            addAllStudentToAssignGroup() {
                let i = 0;
                while (i < this.gruposList.length) {
                    this.informacionEstrategia.gruposAssigned.push(this.gruposList[i]);
                    i++;
                }
                this.gruposList = [];
            },
            removeAllStudenFromGroup() {
                let i = 0;
                while (i < this.informacionEstrategia.gruposAssigned.length) {
                    this.gruposList.push(this.informacionEstrategia.gruposAssigned[i]);
                    i++;
                }
                this.informacionEstrategia.gruposAssigned = [];
            },
            passToTheAssignedQuestions(item) {
                this.informacionEstrategia.preguntas.push(item);
                const pos = this.preguntasAllData.indexOf(item);
                this.preguntasAllData.splice(pos, 1);
            },
            addAllToAssignedQuestions() {
                let i = 0;
                while (i < this.preguntasAllData.length) {
                    this.informacionEstrategia.preguntas.push(this.preguntasAllData[i]);
                    i++;
                }
                this.preguntasAllData = [];
            },
            addAllQuestionsList() {
                let i = 0;
                while (i < this.informacionEstrategia.preguntas.length) {
                    this.preguntasAllData.push(this.informacionEstrategia.preguntas[i]);
                    i++;
                }
                this.informacionEstrategia.preguntas = [];
            },
            passToTheListQuestions(item) {
                this.preguntasAllData.push(item);
                const pos = this.informacionEstrategia.preguntas.indexOf(item);
                this.informacionEstrategia.preguntas.splice(pos, 1);
            },
            backToStepTwo() {
                this.stepperStep--;
                this.informacionEstrategia.preguntas = [];
                this.temasToSave = [];
            },
            nextStepThree() {
                if (this.informacionEstrategia.preguntas.length === 0) {
                    if (this.preguntasAllData.length === 0) {
                        this.infoAlert = "No existen preguntas para esta asignatura :(, creelas es divertido";
                    } else {
                        this.infoAlert = "Debe asignarle preguntas a la estrategia"
                    }
                    this.alertShow = true;
                } else {
                    this.stepperStep++;
                    this.alertShow=false;
                    this.infoAlert='';
                }
            },
            getAllAsignaturasProfesorId() {
                const token = localStorage.getItem('token');
                this.cargandoAsignaturas = true;
                axios.get(URL_GET_PROFESOR_BY_USER_ID, {
                    params: {
                        id: this.user.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.profesorAsignaturasList = data;
                    this.cargandoAsignaturas = false;
                }).catch(err => {
                    console.log(err)
                    this.cargandoAsignaturas = false;
                });
            },
            getAllTemasByAsignatura() {
                const token = localStorage.getItem('token');
                this.cargandoTemas = true;
                axios.get(URL_GET_TEMA_BY_ASIGNATURA_ID, {
                    params: {
                        asignatura: this.informacionEstrategia.asignatura
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.temasListAllData = data;
                    let i = 0;
                    while (i < data.length) {
                        this.temasListComboBox.push(data[i].nombre)
                        i++;
                    }
                    this.cargandoTemas = false;

                }).catch(err => {
                    console.log(err);
                    this.cargandoTemas = false;
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            getAllGroupsByAsignaturaAndProfesor() {
                const token = localStorage.getItem('token');
                this.cargandoGrupos = true;
                axios.get(URL_GET_GROUPS_BY_PROFESOR_AND_ASIGNATURA, {
                    params: {
                        asignatura: this.informacionEstrategia.asignatura,
                        idProfesor: this.profesorAsignaturasList.idProfesor
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.gruposList = data;
                    this.cargandoGrupos = false;
                }).catch(err => {
                    console.log(err);
                    this.cargandoGrupos = false;
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            getAllPreguntasByAsignatura() {
                const token = localStorage.getItem('token');
                this.cargandoPreguntas = true;
                axios.get(URL_GET_PREGUNTAS_BY_ASIGNATURA, {
                    params: {
                        asignatura: this.informacionEstrategia.asignatura
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.preguntasAllData = data;
                    this.cargandoPreguntas = false;
                }).catch(err => {
                    console.log(err);
                    this.cargandoPreguntas = false;
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            getAllTemasAssignedObject() {
                let i = 0;
                let j = 0;
                let found = false;
                while (i < this.informacionEstrategia.temas.length) {
                    found = false;
                    while (j < this.temasListAllData.length && !found) {
                        if (this.temasListAllData[j].nombre === this.informacionEstrategia.temas[i]) {
                            found = true;
                            this.temasToSave.push(this.temasListAllData[j])
                        }
                        j++
                    }
                    i++;
                }
            },
            saveEstrategia() {
                const token = localStorage.getItem('token');
                const payload={
                    cantPuntos: this.informacionEstrategia.puntos,
                    evaluada: this.informacionEstrategia.evaluada,
                    grupos: this.informacionEstrategia.gruposAssigned,
                    habilitada: this.informacionEstrategia.habilitada,
                    idProfesor: this.profesorAsignaturasList.idProfesor,
                    nombre: this.informacionEstrategia.nombre,
                    pregunta: this.informacionEstrategia.preguntas,
                    temas: this.temasToSave
                }
                this.$store.commit('setLoading',true);
                axios.post(URL_ESTRATEGIA_SAVE,payload,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                    this.$store.commit('setLoading',false);
                    this.$router.back();
                }).catch(err=>{
                    console.log(err);
                    this.$store.commit('setLoading',false);
                    this.alertShow=true;
                    this.infoAlert="Algo ha ido mal :( ,("+err+")"
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            }
        },
        computed: {
            ...mapGetters(['loading', 'user'])
        },
        created() {

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