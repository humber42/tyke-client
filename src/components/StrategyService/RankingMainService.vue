<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="loadingTable" class="mx-auto" type="table">
                    </v-skeleton-loader>
                    <v-data-table v-else :headers="headers"
                                  :items="rankingList" :items-per-page="20" class="elevation-1"
                                  :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Ranking</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="search" label="Buscar" single-line
                                              hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn @click="getAllRanking" color="orange" class="mb-2 mr-1" dark>
                                    <v-icon class="refresh" dark/>
                                    Refrescar
                                </v-btn>
                            </v-toolbar>
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
    import {URL_GET_ALL_RANKING} from "../../urlResources";

    export default {
        name: "RankingMainService",
        data(){
            return{
                headers:[
                    {text:"Nombre",value:"usuario.fullname",align:"center"},
                    {text:"Puntuacion",value: "puntuacion",align: "center"}
                ],
                search:'',
                rankingList:[],

            }
        },
        computed:{
            ...mapGetters(['loadingTable'])
        },
        methods:{
            getAllRanking(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoadingTable',true);
                axios.get(URL_GET_ALL_RANKING,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.rankingList=data;
                    this.$store.commit('setLoadingTable',false);
                }).catch(err=> {
                    console.log(err)
                    this.$store.commit('setLoadingTable',false);
                });
            }
        },
        created() {
            this.getAllRanking();
        }
    }
</script>

<style scoped>

</style>