<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="coursesList" :items-per-page="5" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:item.activo="{item}">
                            <v-chip :color="getColorChip(item)" dark>
                                {{getChipName(item)}}
                            </v-chip>
                        </template>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Lista de cursos</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllCourses" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                                <v-dialog v-model="dialogInsertarCourse" max-width="450px" persistent>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                            <v-icon dark left>add</v-icon>
                                            Nuevo Curso
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Añadir Curso</v-card-title>
                                            <v-form lazy-validation v-model="isFormInsertarValid"
                                                    ref="insertFormAsignatura" @submit.prevent="saveCourse">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="newCourseName"
                                                                      :rules="courseNameRules"
                                                                      prepend-icon="date_range" label="Curso"
                                                                      aria-required="true" aria-autocomplete="list"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn type="submit" class="mx-1" color="primary"
                                                               style="color: white!important;"
                                                               :loading="loading"
                                                               :disabled="!isFormInsertarValid||loading">
                                                            <span class="custom-loader" slot="loader">
                                                            <v-icon>refresh</v-icon>
                                                        </span>Confirmar
                                                        </v-btn>
                                                        <v-btn class="mx-1" color="red" style="color: white!important;"
                                                               @click="dialogInsertarCourse=false">Cancelar
                                                        </v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogEditCourse" max-width="400px" persistent>
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Editar course</v-card-title>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field v-model="nameCourseEdit"
                                                                  :rules="courseNameRules"
                                                                  prepend-icon="date_range" label="Curso"
                                                                  aria-autocomplete="list" aria-required="true"/>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-radio-group row v-model="stateCourseEdit">
                                                        <v-radio label="Activo" :value="true"
                                                                 color="blue"/>
                                                        <v-radio label="Inactivo" :value="false"
                                                                 color="blue"></v-radio>
                                                    </v-radio-group>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex class="text-right">
                                                    <v-btn class="mx-1" color="orange" style="color: white!important;" :disabled="loading" :loading="loading"
                                                           @click="editCourse"><span slot="loader" class="custom-loader">
                                                        <v-icon>refresh</v-icon>
                                                    </span>Editar
                                                    </v-btn>
                                                    <v-btn class="mx-1" color="red" style="color: white!important;"
                                                           @click="dialogEditCourse=false">Cancelar
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
    import axios from 'axios'
    import {mapGetters} from 'vuex'
    import {URL_FETCH_ALL_COURSES, URL_SAVE_COURSE, URL_UPDATE_COURSE} from "../../urlResources";

    export default {
        name: "CursoMainService",
        data(){
            return{
                coursesList:[],
                newCourseName:'',
                newCourseActive:true,
                search:'',
                isFormInsertarValid:true,
                courseNameRules:[
                    name=>!!name||"El nombre del curso es requerido"
                ],
                dialogInsertarCourse:false,
                dialogEditCourse:false,
                nameCourseEdit:'',
                stateCourseEdit:'',
                headers:[
                    {text:"Curso",value:'curso',align:'center'},
                    {text:"Activo",value: 'activo',align: 'center'},
                    {text: "Accion",value: 'actions',align: "center"}
                ],
                courseToEdit:null
            }
        },
        computed:{
            ...mapGetters(['loadingTable','loading'])
        },
        methods:{
             getAllCourses(){
                 const token = localStorage.getItem('token');
                 this.$store.commit('setLoadingTable',true);
                 axios.get(URL_FETCH_ALL_COURSES,{
                     headers: {
                         "Authorization": "Bearer " + token,
                         "cache-control": "no-cache",
                     }
                 }).then(({data})=>{
                     this.$store.commit('setLoadingTable',false);
                     this.coursesList =data;
                     console.log(data);
                 }).catch((err)=>{
                     console.log(err);
                     this.$store.commit('setLoadingTable',false);
                 })
             },
            saveCourse(){
                 const token = localStorage.getItem('token');
                 this.$store.commit('setLoading',true)
                 const payload ={
                     activo:this.newCourseActive,
                     curso:this.newCourseName
                 };
                 axios.post(URL_SAVE_COURSE,payload,{
                     headers: {
                         "Authorization": "Bearer " + token,
                         "cache-control": "no-cache",
                     }
                 }).then(({data})=>{
                     this.$store.commit('setLoading',false);
                     this.getAllCourses();
                     console.log(data);
                     this.dialogInsertarCourse=false;
                 }).catch((err)=>{
                        console.log(err);
                        this.$store.commit('setLoading',false);
                     })
            },
            getColorChip(item) {
                if (item.activo) return 'green'
                else return 'red'
            },
            getChipName(item) {
                if (item.activo) return 'Activo'
                else return 'No Activo'
            },
            editItem(course){
                 this.dialogEditCourse=true;
                 this.nameCourseEdit=course.curso;
                 this.stateCourseEdit=course.activo;
                 this.courseToEdit=course;
            },
            editCourse(){
                 const token = localStorage.getItem('token');
                 this.courseToEdit.curso=this.nameCourseEdit;
                 this.courseToEdit.activo=this.stateCourseEdit;
                this.$store.commit('setLoading',true)
                 axios.post(URL_UPDATE_COURSE,this.courseToEdit,{
                     headers: {
                         "Authorization": "Bearer " + token,
                         "cache-control": "no-cache",
                     }
                 }).then(({data})=>{
                     this.$store.commit('setLoading',false)
                     console.log(data);
                     this.getAllCourses();
                     this.dialogEditCourse=false;
                     this.courseToEdit=null;
                 }).catch((err)=>{
                     console.log(err);
                     this.$store.commit('setLoading',false)
                     this.dialogEditCourse=false;
                 })
            }
        },
        created() {
            this.getAllCourses();
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