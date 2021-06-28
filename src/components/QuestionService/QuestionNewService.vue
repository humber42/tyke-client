<template>
    <v-container>
        <v-row>
            <v-col cols="10">
                <h1 class="font-weight-thin">Crear pregunta</h1>
            </v-col>
            <v-col cols="2">
                <v-btn color="red" class="mt-2" dark @click="cancelar">
                    <v-icon class="close"/>
                    Cancelar
                </v-btn>
            </v-col>
        </v-row>
        <v-container fluid>
            <v-dialog v-model="dialogRespuestasMarcar" persistent max-width="500px">
                <v-card>
                    <v-container>
                        <v-card-title>Crear respuesta de marcar</v-card-title>
                        <v-form v-model="isFormRespuestaMarcarValid" ref="formRespuestaMarcar" lazy-validation
                                @submit.prevent="addRespuestaToListRespuestas">
                            <v-layout row class="ma-1">
                                <v-flex xs12>
                                    <v-text-field prepend-icon="text_fields" v-model="respuestaMarcar.respuesta"
                                                  :rules="rules.ruleMarcar" label="Respuesta"/>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1">
                                <v-flex xs12>
                                    <v-radio-group v-model="respuestaMarcar.correcta" row>
                                        <v-radio :value="true" label="Correcta"/>
                                        <v-radio :value="false" label="Incorrecta"/>
                                    </v-radio-group>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1 mt-5">
                                <v-flex xs12>
                                    <v-slider  v-model="respuestaMarcar.puntuacion" thumb-label="always" hint="Puntos al responder" label="Puntuación"/>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1">
                                <v-flex class="text-right">
                                    <v-btn type="submit" class="mx-1" color="success"
                                           :disabled="!isFormRespuestaMarcarValid"
                                           style="color: white!important;">Agregar
                                    </v-btn>
                                    <v-btn style="color: white!important;" class="mx-1" color="red"
                                           @click="cancelarAllDialogs">
                                        Cancelar
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-container>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogRespuestasEnlazar" persistent max-width="500px">
                <v-card>
                    <v-container>
                        <v-card-title>Crear respuesta de enlazar</v-card-title>
                        <v-form lazy-validation v-model="isFormRespuestasEnalzarValid" ref="formEnlazarRespuesta"
                                @submit.prevent="addRespuestaToListRespuestas">
                            <v-layout row class="ma-1">
                                <v-flex xs12>
                                    <v-text-field v-model="respuestaEnlazar.pregunta" label="Pregunta a enlazar"
                                                  :rules="rules.ruleEnlazar.rulePregunta"
                                                  prepend-icon="text_fields"/>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1">
                                <v-flex xs12>
                                    <v-text-field v-model="respuestaEnlazar.respuesta" label="Respuesta a enlazar"
                                                  :rules="rules.ruleEnlazar.ruleRespuesta"
                                                  prepend-icon="text_fields"/>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1 mt-5">
                                <v-flex xs12>
                                    <v-slider v-model="respuestaEnlazar.puntuacion" thumb-label="always" hint="Puntos al responder" label="Puntuación"/>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1">
                                <v-flex xs12 class="text-right">
                                    <v-btn color="success" type="submit" style="color: white!important;" class="mx-1"
                                           :disabled="!isFormRespuestasEnalzarValid">Agregar
                                    </v-btn>
                                    <v-btn class="mx-1" @click="cancelarAllDialogs" color="red"
                                           style="color: white!important;">
                                        Cancelar
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-container>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogRespuestaCompletar" persistent max-width="500px">
                <v-card>
                    <v-container>
                        <v-card-title>Crear respuesta completar</v-card-title>
                        <v-form v-model="isFormRespuestaCompletarValid" lazy-validation ref="formRespuestaCompletar"
                                @submit.prevent="addRespuestaToListRespuestas">
                            <v-layout row class="ma-1">
                                <v-flex xs12>
                                    <v-text-field prepend-icon="text_fields" label="Propuesta para completar"
                                                  v-model="respuestaCompletar.respuesta"
                                                  :rules="rules.ruleCompletar"></v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-layout row class="ma-1">
                                <v-flex xs12>
                                    <v-radio-group v-model="respuestaCompletar.correcto" row>
                                        <v-radio label="Correcta" :value="true"/>
                                        <v-radio label="Incorrecta" :value="false"/>
                                    </v-radio-group>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1 mt-5">
                                <v-flex xs12>
                                    <v-slider v-model="respuestaCompletar.puntuacion" thumb-label="always" hint="Puntos al responder" label="Puntuación"/>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1">
                                <v-flex xs12 class="text-right">
                                    <v-btn type="submit" class="mx-1" color="success"
                                           :disabled="!isFormRespuestaCompletarValid"
                                           style="color: white!important;">Confirmar
                                    </v-btn>
                                    <v-btn @click="cancelarAllDialogs" class="mx-1" color="red"
                                           style="color: white!important;">
                                        Cancelar
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-container>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogRespuestaOrdenar" persistent max-width="500px">
                <v-card>
                    <v-container>
                        <v-card-title>Crear respuesta ordenar</v-card-title>
                        <v-form lazy-validation v-model="isFormRespuestaOrdenarValid" ref="formRespuestaOrdenar"
                                @submit.prevent="addRespuestaToListRespuestas">
                            <v-layout row class="ma-1">
                                <v-flex xs12>
                                    <v-text-field v-model="respuestaOrdenar.respuesta"
                                                  :rules="rules.ruleOrdenar"
                                                  prepend-icon="text_fields" label="Respuesta a ordenar"/>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1">
                                <v-flex xs12>
                                    <v-text-field prepend-icon="list" label="Orden"
                                                  v-model="respuestaOrdenar.orden"
                                    >
                                        <template v-slot:append>
                                            <v-icon class="remove" @click="disminuirValorSpinner"/>
                                            <v-icon class="add" @click="aumentarValorSpinner"></v-icon>
                                        </template>
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1 mt-5">
                                <v-flex xs12>
                                    <v-slider v-model="respuestaOrdenar.puntuacion" thumb-label="always" hint="Puntos al responder" label="Puntuación"/>
                                </v-flex>
                            </v-layout>
                            <v-layout row class="ma-1">
                                <v-flex xs12 class="text-right">
                                    <v-btn :disabled="!isFormRespuestaOrdenarValid" class="mx-1"
                                           type="submit" color="success" style="color: white!important;">Confirmar
                                    </v-btn>
                                    <v-btn @click="cancelarAllDialogs" class="mx-1" color="red"
                                           style="color: white!important;">
                                        Cancelar
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-container>
                </v-card>
            </v-dialog>

            <v-card elevation="10" width="990">
                <v-stepper v-model="stepperStep">
                    <v-stepper-header>
                        <v-stepper-step :complete="stepperStep>1" step="1">
                            Datos de la pregunta
                        </v-stepper-step>
                        <v-divider/>
                        <v-stepper-step :complete="stepperStep>2" step="2">
                            Tipo y respuestas
                        </v-stepper-step>
                        <v-divider/>
                        <v-stepper-step :complete="stepperStep>3" step="3">
                            Bonificación y pistas
                        </v-stepper-step>
                        <v-divider/>
                        <v-stepper-step step="4">
                            Resumen de la pregunta
                        </v-stepper-step>
                    </v-stepper-header>
                    <v-stepper-items>
                        <!--Step 1 datos de la pregunta-->
                        <v-stepper-content step="1">
                            <v-card>
                                <v-container>
                                    <v-form v-model="isFormValidStepOne" ref="formStepOne" lazy-validation
                                            @submit.prevent="nextStepOne">
                                        <v-card-title>Datos generales de la pregunta</v-card-title>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field prepend-icon="text_fields"
                                                                      label="Titulo de la pregunta"
                                                                      v-model="tituloPregunta"
                                                                      :rules="[titulo=>!!titulo||'El titulo de la pregunta es requerido']"
                                                                      aria-required="true" aria-autocomplete="list"/>

                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="signatureSelected"
                                                                :items="signaturesList"
                                                                label="Asignaturas"
                                                                prepend-icon="chrome_reader_mode"
                                                                :rules="[asignatura=>!!asignatura||'La asigantura es requerida']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-slider prepend-icon="alarm" v-model="tiempoParaResponder"
                                                                  label="Tiempo para responder" thumb-label="always"
                                                                  min="10" max="120"

                                                                  hint="Tiempo en segundos"></v-slider>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-slider prepend-icon="military_tech"
                                                                  v-model="puntuacionPorContestar"
                                                                  label="Puntuación por contestar" thumb-label="always"
                                                                  min="1" max="80" hint="Cantidad de puntos"></v-slider>
                                                    </v-flex>
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

                        <!--Step 2 tipos y respuestas-->
                        <v-stepper-content step="2">
                            <v-card>
                                <v-container>
                                    <v-card-title>Tipo de pregunta y respuestas</v-card-title>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox
                                                            v-model="tipoPreguntaSelected"
                                                            :items="tipoPreguntasList"
                                                            label="Tipo de preguntas"
                                                            prepend-icon="chrome_reader_mode"
                                                            :rules="[asignatura=>!!asignatura||'El tipo de pregunta es requerido']"
                                                            @change="loadImage"
                                                    ></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                            <v-card v-if="tipoPreguntaSelected!=='Bono'">
                                                <v-img :src="imagenACargar" contain></v-img>
                                                <v-card-title>Ejemplo pregunta {{tipoPreguntaSelected}}</v-card-title>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-card elevation="10" :disabled="deshabilitarButton">
                                                <v-container>
                                                    <v-row>
                                                        <v-col cols="8">
                                                            <v-card-title>Respuestas</v-card-title>
                                                        </v-col>
                                                        <v-col cols="4" class="text-right">
                                                            <v-btn class="mt-4 mr-2" icon
                                                                   color="blue" :disabled="deshabilitarButton"
                                                                   @click="addResponsesToAQuestions">
                                                                <v-icon class="add"/>
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                    <v-divider></v-divider>
                                                    <v-virtual-scroll :items="respuestasList" height="200" item-height="70" width="2900">
                                                        <template v-slot:default="{ item }">
                                                            <v-list-item :key="item.respuesta" color="secondary">
                                                                        <v-list-item-content v-if="tipoPreguntaSelected==='Enlazar'">
                                                                            <v-list-item-title>Pregunta: {{item.pregunta}}</v-list-item-title>
                                                                            <v-list-item-title>Enlazar: {{item.respuesta}}</v-list-item-title>
                                                                        </v-list-item-content>
                                                                        <v-list-item-content v-else-if="tipoPreguntaSelected==='Ordenar'">
                                                                            <v-list-item-title>Respuesta: {{item.respuesta}}
                                                                            </v-list-item-title>
                                                                            <v-list-item-title>Orden: {{item.orden}}</v-list-item-title>
                                                                        </v-list-item-content>
                                                                        <v-list-item-content v-else-if="tipoPreguntaSelected==='Completar'">
                                                                            <v-avatar size="56" :color="item.correcta?'success':'error'">
                                                                            </v-avatar>
                                                                            <v-list-item-title>Frase o palabra para completar:
                                                                                {{item.respuesta}}
                                                                            </v-list-item-title>
                                                                        </v-list-item-content>
                                                                        <v-list-item v-else>
                                                                            <v-avatar size="40" :color="item.correcta?'success':'error'">
                                                                            </v-avatar>
                                                                            <v-list-item-content class="ml-3">
                                                                                <v-list-item-title >
                                                                                   {{item.respuesta}}</v-list-item-title>
                                                                            </v-list-item-content>
                                                                        </v-list-item>
                                                                        <v-list-item-action>
                                                                                <v-btn icon color="red" @click="deleteItemFromList(item)"><v-icon class="delete"/></v-btn>
                                                                        </v-list-item-action>
                                                            </v-list-item>
                                                            <v-divider></v-divider>
                                                        </template>
                                                    </v-virtual-scroll>
                                                </v-container>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-layout row class="ma-1 mt-2">
                                        <v-flex class="text-left" @click="backToStepOne">
                                            <v-btn color="success" fab><v-icon class="navigate_before"/></v-btn>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn color="success" @click="nextStepTwo" fab><v-icon class="navigate_next"/></v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-stepper-content>

                        <!--Step bonificacion y pistas-->
                        <v-stepper-content step="3">
                            <v-card>
                                <v-dialog v-model="showDialogAddPista" persistent max-width="500">
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Agregar Pista</v-card-title>
                                            <v-form v-model="isFormAddPista" ref="formAddPista" lazy-validation @submit.prevent="annadirToPistaList">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Pista" prepend-icon="text_fields" :rules="rules.ruleAddPista"
                                                                      v-model="pistaToAdd.pistaName" aria-autocomplete="list" aria-required="true"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox
                                                                v-model="pistaToAdd.tipoPistaSelected"
                                                                :items="tipoPistasList"
                                                                label="Tipo pista"
                                                                prepend-icon="search"
                                                                :rules="[asignatura=>!!asignatura||'El tipo de pista es requerido']"
                                                        ></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12 class="text-right">
                                                        <v-btn class="mx-1" :disabled="!isFormAddPista" color="success" style="color: white!important;" type="submit">Agregar</v-btn>
                                                        <v-btn class="mx-1" color="red" style="color: white!important;" @click="cancelarDialogsAddPistAddBonification">Cancelar</v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="showDialogAddBonification" persistent max-width="500">
                                    <v-card>
                                        <v-container>
                                            <v-card-title>Agregar Bonificación</v-card-title>
                                            <v-form v-model="isFormBonificationValid" lazy-validation ref="formAddBonification" @submit.prevent="addToBonificationList">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-slider  prepend-icon="alarm" v-model="bonificationToAdd.tiempoMenor" label="Tiempo menor" hint="Tiempo en segundos"
                                                                  :rules="[time=>time>0||'El tiempo debe ser mayor que cero']" thumb-label="always" max="60"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-slider prepend-icon="military_tech" v-model="bonificationToAdd.bonificacion" label="Bonificación" thumb-label="always" max="50"
                                                              hint="Cantidad de puntos" :rules="[points=>points>0||'Los puntos deben ser mayor que cero']"/>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex class="text-right" xs12>
                                                        <v-btn class="mx-1" :disabled="!isFormBonificationValid" color="success" type="submit" style="color: white!important;">Agregar</v-btn>
                                                        <v-btn class="mx-1" color="red" @click="cancelarDialogsAddPistAddBonification" style="color: white!important;">Cancelar</v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-container>
                                    </v-card>
                                </v-dialog>
                                <v-container>
                                    <v-card-title>Bonificación y pistas</v-card-title>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-checkbox v-model="hasClue" label="Tiene pista"/>
                                            <v-card v-if="hasClue" class="mb-3" elevation="10">
                                                <v-container>
                                                <v-row>
                                                    <v-col cols="9">
                                                        <v-card-title>Añadir pistas</v-card-title>
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-btn class="ml-8 mt-4" color="blue" icon @click="showDialogAddPista=true"><v-icon class="add"/></v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-divider/>
                                                <v-virtual-scroll :items="pistasList" height="200" item-height="70">
                                                    <template v-slot:default="{ item }">
                                                        <v-list-item :key="item.pistaName">
                                                            <v-list-item-content>
                                                                <v-list-item-title>Pista: {{item.pistaName}}</v-list-item-title>
                                                                <v-list-item-subtitle>Tipo pista: {{item.tipoPistaSelected}}</v-list-item-subtitle>
                                                            </v-list-item-content>
                                                            <v-list-item-action>
                                                                <v-btn icon color="red" @click="deleteItemFromListPistas(item)"><v-icon class="delete"/></v-btn>
                                                            </v-list-item-action>
                                                        </v-list-item>
                                                        <v-divider></v-divider>
                                                    </template>
                                                </v-virtual-scroll>
                                                </v-container>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-checkbox v-model="hasBonification" label="Tiene bonificación"/>
                                            <v-card v-if="hasBonification" class="mb-3" elevation="10">
                                                <v-container>
                                                <v-row>
                                                    <v-col cols="9">
                                                        <v-card-title>Añadir bonificación</v-card-title>
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-btn icon @click="showDialogAddBonification=true" class="ml-8 mt-4" color="blue"><v-icon class="add"/></v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-divider/>
                                                <v-virtual-scroll :items="bonificationList" height="200" item-height="70">
                                                    <template v-slot:default="{ item }">
                                                        <v-list-item :key="item.tiempoMenor">
                                                            <v-list-item-content>
                                                                <v-list-item-title>Tiempo Menor: {{item.tiempoMenor}} segundos</v-list-item-title>
                                                                <v-list-item-subtitle>Bonificación: {{item.bonificacion}} puntos</v-list-item-subtitle>
                                                            </v-list-item-content>
                                                            <v-list-item-action>
                                                                <v-btn icon color="red" @click="deleteItemFromListBonification(item)"><v-icon class="delete"/></v-btn>
                                                            </v-list-item-action>
                                                        </v-list-item>
                                                        <v-divider></v-divider>
                                                    </template>
                                                </v-virtual-scroll>
                                                </v-container>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-layout row class="ma-1">
                                        <v-flex class="text-left">
                                            <v-btn fab color="success" @click="backToStepTwo"><v-icon class="navigate_before"/></v-btn>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn fab color="success" @click="nextStepThree"><v-icon class="navigate_next"/> </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <!--Step informacion-->
                        <v-stepper-content step="4">
                            <v-card>
                                <v-container>
                                    <v-card-title>Resumen de la pregunta</v-card-title>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-card-text><b>Titulo pregunta:</b> {{tituloPregunta}}</v-card-text>
                                            <v-card-text><b>Tiempo para responder:</b> {{tiempoParaResponder}} segundos</v-card-text>
                                            <v-card-text><b>Tipo de pregunta</b> {{tipoPreguntaSelected}}</v-card-text>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-card-text><b>Asignatura:</b> {{signatureSelected}}</v-card-text>
                                            <v-card-text><b>Puntuación:</b> {{puntuacionPorContestar}} puntos</v-card-text>
                                            <v-card-text><b>Cantidad de respuestas</b> {{respuestasList.length}}</v-card-text>
                                        </v-col>
                                    </v-row>
                                    <v-layout>
                                        <v-flex>
                                            <v-card-text><b>Bonificación:</b> {{hasBonification?"Si":"No"}}</v-card-text>
                                        </v-flex>
                                        <v-flex v-if="hasBonification">
                                            <v-card-text><b>Cantidad de bonificaciones:</b> {{bonificationList.length}}</v-card-text>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex>
                                            <v-card-text><b>Pista:</b> {{hasClue?"Si":"No"}}</v-card-text>
                                        </v-flex>
                                        <v-flex v-if="hasClue">
                                            <v-card-text><b>Cantidad de pistas:</b> {{pistasList.length}}</v-card-text>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex class="text-left">
                                            <v-btn color="success" fab @click="stepperStep--"><v-icon class="navigate_before"/></v-btn>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn @click="saveQuestion" color="blue" :disabled="loading" :loading="loading"  style="color: white!important;">
                                                <span slot="loader" class="custom-loader"><v-icon>refresh</v-icon></span>
                                                Listo</v-btn>
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
    import axios from "axios";
    import {
        URL_FETCH_ALL_ASIGNATURAS,
        URL_FETCH_ALL_TIPO_PISTA,
        URL_FETCH_ALL_TIPO_PREGUNTA,
        URL_SAVE_QUESTION
    } from "../../urlResources";
    import {mapGetters} from "vuex";

    export default {
        name: "QuestionNewService",
        data() {
            return {
                stepperStep: 1,
                tituloPregunta: '',
                signaturesList: [],
                signatureSelected: '',
                tiempoParaResponder: 0,
                puntuacionPorContestar: 0,
                isFormValidStepOne: true,
                tipoPreguntasList: [],
                tipoPreguntaSelected: '',
                imagenACargar: '',
                respuestasList: [],
                dialogRespuestasMarcar: false,
                dialogRespuestasEnlazar: false,
                dialogRespuestaCompletar: false,
                dialogRespuestaOrdenar: false,
                deshabilitarButton: true,
                hasClue:false,
                hasBonification:false,
                showDialogAddPista:false,

                isFormAddPista:true,
                showDialogAddBonification:false,
                rules: {
                    ruleMarcar: [
                        respuesta => !!respuesta || 'La respuesta es requerida'
                    ],
                    ruleCompletar: [
                        respuesta => !!respuesta || 'La propuesta a completar es requerida'
                    ],
                    ruleOrdenar: [
                        respuesta => !!respuesta || 'La respuesta es requerida'
                    ],
                    ruleEnlazar: {
                        rulePregunta: [
                            pregunta => !!pregunta || 'La pregunta a enlazar es requerida'
                        ],
                        ruleRespuesta: [
                            pregunta => !!pregunta || 'La respuesta a enlazar es requerida'
                        ],

                    },
                    ruleAddPista:[
                        pista=>!!pista||"El nombre de la respuesta es requerido"
                    ]
                },
                respuestaMarcar: {
                    respuesta: '',
                    correcta: false,
                    puntuacion:0
                },
                respuestaOrdenar: {
                    respuesta: '',
                    orden: 1,
                    puntuacion:0
                },
                respuestaEnlazar: {
                    pregunta: '',
                    respuesta: '',
                    puntuacion:0
                },
                respuestaCompletar: {
                    respuesta: '',
                    correcta: false,
                    puntuacion:0
                },
                isFormRespuestaMarcarValid: true,
                isFormRespuestasEnalzarValid: true,
                isFormRespuestaCompletarValid: true,
                isFormRespuestaOrdenarValid: true,
                pistaToAdd:{
                    pistaName:'',
                    tipoPistaSelected:''
                },
                bonificationToAdd:{
                  tiempoMenor:0,
                  bonificacion:0
                },
                isFormBonificationValid:true,
                pistasList:[],
                tipoPistasList:[],
                bonificationList:[],
            }
        },
        methods: {
            disminuirValorSpinner() {
                if (this.respuestaOrdenar.orden > 1) {
                    this.respuestaOrdenar.orden--;
                }
            },
            deleteItemFromListPistas(item){
                const pos = this.pistasList.indexOf(item);
                this.pistasList.splice(pos,1)
            },
            deleteItemFromListBonification(item){
                const pos = this.bonificationList.indexOf(item);
                this.bonificationList.splice(pos,1)
            },
            annadirToPistaList(){
                if(this.$refs.formAddPista.validate()) {
                    const pista = {
                        pistaName: this.pistaToAdd.pistaName,
                        tipoPistaSelected: this.pistaToAdd.tipoPistaSelected
                    }
                    this.pistasList.push(pista)
                    this.$refs.formAddPista.reset()
                    this.showDialogAddPista=false;
                }
            },
            addToBonificationList(){
                if(this.$refs.formAddBonification.validate()){
                    const bonification= {
                        tiempoMenor:this.bonificationToAdd.tiempoMenor,
                        bonificacion:this.bonificationToAdd.bonificacion
                    }
                    this.bonificationList.push(bonification);
                    this.$refs.formAddBonification.reset();
                    this.showDialogAddBonification=false;
                }
            },
            cancelarDialogsAddPistAddBonification(){
                this.showDialogAddBonification=false;
                this.showDialogAddPista=false;
                if(this.hasBonification){
                    this.$refs.formAddBonification.reset();
                }
                if(this.hasClue){
                    this.$refs.formAddPista.reset()
                }
            },
            aumentarValorSpinner() {
                this.respuestaOrdenar.orden++
            },
            cancelarAllDialogs() {
                this.dialogRespuestasMarcar = false;
                this.dialogRespuestasEnlazar = false;
                this.dialogRespuestaCompletar = false;
                this.dialogRespuestaOrdenar = false;
            },
            cancelar() {
                this.$router.back();
            },
            getAllSignatures() {
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_ASIGNATURAS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    console.log(data)
                    let i = 0;
                    while (i < data.length) {
                        this.signaturesList.push(data[i].nombre);
                        i++;
                    }
                }).catch(err => {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },
            nextStepOne() {
                if (this.$refs.formStepOne.validate()) {
                    this.stepperStep++;
                    this.getAllTipoPreguntas()
                }
            },
            nextStepTwo(){
                if(this.tipoPreguntaSelected!==''){
                    this.stepperStep++
                }
            },
            nextStepThree(){
                this.stepperStep++
                if(!this.hasBonification){
                    this.bonificationList=[];
                }
                if(!this.hasClue){
                    this.pistasList=[];
                }
            },
            backToStepTwo(){
                this.pistasList=[];
                this.bonificationList=[];
                this.stepperStep--;
            },
            backToStepOne(){
                this.tipoPreguntaSelected='';
                this.respuestasList=[];
                this.stepperStep--;
            },
            getAllTipoPreguntas() {
                const token = localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_TIPO_PREGUNTA, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data}) => {
                    let i = 0;
                    while (i < data.length) {
                        this.tipoPreguntasList.push(data[i].tipo);
                        i++
                    }
                }).catch(err => {
                    console.log(err);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                })
            },

            loadImage() {
                this.respuestasList = [];
                this.deshabilitarButton = false;
                if (this.tipoPreguntaSelected === "Marcar") {
                    this.imagenACargar = "../simple.png"
                } else if (this.tipoPreguntaSelected === "Enlazar") {
                    this.imagenACargar = "../ordenar.png"
                } else if (this.tipoPreguntaSelected === "Completar") {
                    this.imagenACargar = "../completar1.png"
                } else if (this.tipoPreguntaSelected === "Marcar múltiple") {
                    this.imagenACargar = "../multiple.png"
                } else if (this.tipoPreguntaSelected === "Ordenar") {
                    this.imagenACargar = "../ordenar_drop.png"
                } else if (this.tipoPreguntaSelected === "Bono") {
                    this.imagenACargar = ""
                }
            },
            addResponsesToAQuestions() {
                if (this.tipoPreguntaSelected === "Marcar") {
                    this.dialogRespuestasMarcar = true;
                } else if (this.tipoPreguntaSelected === "Enlazar") {
                    this.dialogRespuestasEnlazar = true;
                } else if (this.tipoPreguntaSelected === "Completar") {
                    this.dialogRespuestaCompletar = true;
                } else if (this.tipoPreguntaSelected === "Marcar múltiple") {
                    this.dialogRespuestasMarcar = true;
                } else if (this.tipoPreguntaSelected === "Ordenar") {
                    this.dialogRespuestaOrdenar = true;
                } else if (this.tipoPreguntaSelected === "Bono") {
                    this.dialogRespuestasMarcar = true;
                }
            },
            deleteItemFromList(item){
                const pos=this.respuestasList.indexOf(item);
                this.respuestasList.splice(pos,1);
            },
            addRespuestaToListRespuestas() {

                if (this.tipoPreguntaSelected === "Marcar") {
                    if (this.$refs.formRespuestaMarcar.validate()) {
                        const item = {
                            respuesta: this.respuestaMarcar.respuesta,
                            correcta: this.respuestaMarcar.correcta
                        };
                        this.respuestasList.push(item)
                        this.$refs.formRespuestaMarcar.reset()
                        this.dialogRespuestasMarcar = false;
                    }
                } else if (this.tipoPreguntaSelected === "Enlazar") {
                    if (this.$refs.formEnlazarRespuesta.validate()) {
                        const item={
                            pregunta:this.respuestaEnlazar.pregunta,
                            respuesta:this.respuestaEnlazar.respuesta
                        };
                        this.respuestasList.push(item)
                        this.dialogRespuestasEnlazar = false;
                        this.$refs.formEnlazarRespuesta.reset();
                    }
                } else if (this.tipoPreguntaSelected === "Completar") {
                    if (this.$refs.formRespuestaCompletar.validate()) {
                        const item={
                            respuesta:this.respuestaCompletar.respuesta,
                            correcto:this.respuestaCompletar.correcto,
                            fraseFinal:this.respuestaCompletar.fraseFinal
                        };
                        this.respuestasList.push(item);
                        this.dialogRespuestaCompletar = false;
                        this.$refs.formRespuestaCompletar.reset();
                    }
                } else if (this.tipoPreguntaSelected === "Marcar múltiple") {
                    if (this.$refs.formRespuestaMarcar.validate()) {
                        const item = {
                            respuesta: this.respuestaMarcar.respuesta,
                            correcta: this.respuestaMarcar.correcta
                        };
                        this.respuestasList.push(item)
                        this.$refs.formRespuestaMarcar.reset()
                        this.dialogRespuestasMarcar = false;
                    }
                } else if (this.tipoPreguntaSelected === "Ordenar") {
                    if (this.$refs.formRespuestaOrdenar.validate()) {
                        const item={
                            respuesta:this.respuestaOrdenar.respuesta,
                            orden:this.respuestaOrdenar.orden,
                        }
                        this.respuestasList.push(item);
                        this.dialogRespuestaOrdenar = false;
                        this.$refs.formRespuestaOrdenar.reset();
                    }
                } else if (this.tipoPreguntaSelected === "Bono") {
                    if (this.$refs.formRespuestaMarcar.validate()) {
                        const item = {
                            respuesta: this.respuestaMarcar.respuesta,
                            correcta: this.respuestaMarcar.correcta
                        };
                        this.respuestasList.push(item)
                        this.$refs.formRespuestaMarcar.reset()
                        this.dialogRespuestasMarcar = false;
                    }
                }

            },
            getAllTipoPista(){
                const token=localStorage.getItem('token');
                axios.get(URL_FETCH_ALL_TIPO_PISTA,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    let i = 0;
                    while(i<data.length){
                        this.tipoPistasList.push(data[i].tipo);
                        i++;
                    }
                }).catch(err=> {
                    console.log(err)
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            },
            saveQuestion(){
                const token = localStorage.getItem('token');
                this.$store.commit('setLoading',true);
                const payload={
                    asignatura: this.signatureSelected,
                    bonificaciones: this.bonificationList,
                    pistas: this.pistasList,
                    puntuacion: this.puntuacionPorContestar,
                    respuestas: this.respuestasList,
                    tiempoMenor: this.tiempoParaResponder,
                    tipoPregunta: this.tipoPreguntaSelected,
                    tituloPregunta: this.tituloPregunta
                }
                axios.post(URL_SAVE_QUESTION,payload,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                }).then(({data})=>{
                    this.$store.commit('setLoading',false);
                    console.log(data)
                    this.$router.back();
                }).catch((err)=>{
                    console.log(err)
                    this.$store.commit('setLoading',false);
                    if(err.response.status===403){
                        this.$router.push("/403");
                    }
                });
            }
        },
        computed:{
            ...mapGetters(['loading'])
        }
        ,
        created() {
            this.getAllSignatures();
            this.getAllTipoPista();
        }
    }
</script>

<style scoped>

    .button-hover:hover{
        color: rgba(227, 17, 17, 0.97) !important;
    }
    .button-hover{
        color: white!important;}

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