<template>
   <div>
       <v-row>
           <v-col cols="6">
               <h1 class="font-weight-light">Plataforma de Gamificación Tyke</h1>
           </v-col>
           <v-col cols="6" class="text-right">
               <h2 class="font-weight-thin">Bienvenido: {{user.fullname}}</h2>
           </v-col>

       </v-row>

    <v-container>

        <v-row>
            <ranking-main-service></ranking-main-service>
        </v-row>
        <v-row class="mt-8">
            <v-col>
                <v-card shaped hover @click="goToStrategy" v-if="isProfesor">
                    <div style="background-color: #3f9655">
                        <v-card-title style="color: white!important;"><v-icon class="videogame_asset mr-2" dark/>Estrategias</v-card-title>
                    </div>
                    <v-divider/>
                    <v-card-text><b>Cantidad de estrategias:</b> {{estrategiasList.length}}</v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-action>
                                <v-btn color="blue" dark @click="goToNewStrategy"><v-icon class="add"/>Agregar estrategia</v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col >
                <v-card shaped hover @click="goToPreguntas" v-if="isProfesor">
                    <div style="background-color: #3f9655">
                        <v-card-title style="color: white!important;"><v-icon class="sticky_note_2 mr-2" dark/>Preguntas</v-card-title>
                    </div>
                    <v-divider/>
                    <v-card-text><b>Cantidad de preguntas:</b> {{preguntasList.length}}</v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-action>
                                <v-btn class="mx-1 mt-2"  color="blue" dark @click="goToNewQuestion"><v-icon class="add"/>Agregar</v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-action>
                                <v-btn class="mx-1 mt-2"  color="secondary" dark @click="goToTipoPregunta"><v-icon class="fact_check mr-2"/>Tipo pregunta</v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-action>
                                <v-btn class="mx-1 mt-2"  color="pink" dark @click="goToTipoPistas"><v-icon class="search mr-2"/>Tipo pista</v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col>
                <v-card shaped hover @click="goToUserService" v-if="isAdmin">
                    <div style="background-color: #3f9655">
                        <v-card-title style="color: white!important;"><v-icon class="face mr-2" dark/>Usuarios</v-card-title>
                    </div>
                    <v-divider/>
                    <v-card-text><b>Cantidad de usuarios:</b> {{users.length}}</v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-action>
                                <v-btn color="blue" dark @click="goToRoles"><v-icon class="add_moderator"/>Ver roles</v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
   </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import RankingMainService from "./StrategyService/RankingMainService";
    import axios from "axios";
    import {URL_FETCH_ALL_QUESTIONS, URL_FETCH_ALL_STRATEGY, URL_FETCH_ALL_USERS} from "../urlResources";

    export default {
        name: "HomePage",
        components: {RankingMainService},
        data(){
            return{
                isProfesor:false,
                isAdmin:false,
                estrategiasList:[],
                preguntasList:[],
                users:[]
            }
        },
        computed:{
            ...mapGetters(['user'])
        },
        methods:{
            goToNewStrategy(){
                this.$router.push('/new-strategy')
            },
            goToStrategy(){
                this.$router.push('/strategy-service')
            },
            goToPreguntas(){
                this.$router.push('/question-service')
            },
            goToNewQuestion(){
                this.$router.push('/question-new-service')
            },
            goToTipoPistas(){
                this.$router.push('/clue-type-service')
            },
            goToRoles(){
                this.$router.push('/roles-service')
            },
            goToTipoPregunta(){
                this.$router.push('/question-type-service')
            },
            goToUserService(){
                this.$router.push('/user-service')
            },
            isUserProfesor(){
                let i = 0;
                let found=false;
                while(i<this.user.roles.length&&!found){
                    if(this.user.roles[i].roleName==="Profesor"){
                        found=true;
                        this.isProfesor =true;
                    }
                    i++;
                }
                return !found;
            },
            isUserAdministrador(){
                let i = 0;
                let found=false;
                while(i<this.user.roles.length&&!found){
                    if(this.user.roles[i].roleName==="Administrador"){
                        found=true;
                        this.isAdmin =true;
                    }
                    i++;
                }
                return !found;
            },
            getAllEstrategias(){
                const token = localStorage.getItem('token');

                axios.get(URL_FETCH_ALL_STRATEGY,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    this.estrategiasList=data;

                }).catch(err=>{
                    console.log(err);

                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            getAllQuestions(){

                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_QUESTIONS,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data)
                    this.preguntasList=data;

                }).catch((err)=>{
                    console.log(err)

                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            cargarDatosTabla() {

                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_USERS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.users=data;

                }).catch((err) => {

                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
        },
        created() {
            this.isUserProfesor();
            this.isUserAdministrador();
            this.getAllEstrategias()
            this.getAllQuestions();
            this.cargarDatosTabla();
        }
    }
</script>

<style scoped>

</style>