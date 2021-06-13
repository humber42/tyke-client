<template>
    <v-snackbar v-model="showSnack" :timeout="timeout" right top :color="typeAlert"  outlined>
        <h3><v-icon left :class="icon" :color="typeAlert"/>{{infoAlert}}</h3>
        <template v-slot:action="{attrs}">
            <v-icon v-bind="attrs" :color="typeAlert" @click="showSnack=false" class="close"/>
        </template>
    </v-snackbar>
</template>

<script>
    export default {
        name: "Notification",
        data(){
            return{
                timeout:2000
            }
        },
        props:['typeAlert','infoAlert','showSnack','icon']
    }
</script>

<style scoped>

</style>