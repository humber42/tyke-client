<template>
    <v-container>
        <v-card>
            <v-data-table :headers="headers"
            :items="groupsList"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="name"
            show-expand>
                <template v-slot:top>
                    <v-toolbar>
                        <v-toolbar-title>Listado de grupos</v-toolbar-title>
                        <v-spacer/>
                        <v-switch v-model="singleExpand" label="Abrir uno solo" class="mt-2"/>
                        <v-spacer/>
                        <v-dialog v-model="dialogInsertarGrupo" max-width="450px" persistent>
                            <template v-slot:activator="{on,attrs}">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                    <v-icon dark left>add</v-icon>
                                    Nueva Grupo
                                </v-btn>
                            </template>
                            <v-card>
                                <v-container>
                                    <v-card-title>Añadir Grupo</v-card-title>
                                </v-container>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:expanded-item="{headers,item}">
                    <td :colspan="headers">
                        {{item.grupo}}
                    </td>
                </template>

            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        name: "GrupoMainService",
        data(){
            return{
                headers:[
                    {}
                ],
                singleExpand:false,
                groupsList:[],
                expanded:[],
                dialogInsertarGrupo:false,
                dialogEditGrupo:false,
                dialogDeleteGrupo:false

            }
        }
    }
</script>

<style scoped>

</style>