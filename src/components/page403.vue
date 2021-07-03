<template>
    <v-container>
        <v-layout row class="ma-1" wrap>
            <v-flex xs12 sm6 offset-sm3>
                <v-card width="500px">
                    <v-card-title>Usted no esta autorizado o se le vencio el tiempo de acceso :(</v-card-title>
                    <v-card-text>Error 403: Forbiden</v-card-text>
                    <v-card-actions>
                        <v-layout class="ma-1" row wrap>
                            <v-flex class="text-center" xs12>
                                <v-btn class="mx-1" color="blue" dark @click="volverAtras">
                                    <v-icon class="navigate_before"/>
                                    Ir al menu principal
                                </v-btn>
                                <v-btn class="mx-1" color="red" dark @click="logout">
                                    <v-icon class="logout"/>
                                    Ir al login
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "page403",
        methods: {
            logout() {
                this.$store.dispatch('logoutUser')
            },
            volverAtras() {
                this.$router.push("/home");
            }
        }
    }
</script>

<style scoped>

</style>