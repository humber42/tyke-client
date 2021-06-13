<template>
  <v-app id="inspire">
    <v-container v-if="user">
      <v-navigation-drawer permanent expand-on-hover app v-model="drawer" class="text-center">
        <v-list-item class="2px">
          <v-list-item-avatar class="pr-1">
            <v-img src="http://localhost:9000/img/751" lazy-src="http://localhost:9000/img/751"></v-img>
          </v-list-item-avatar>
          <v-list-item-title>{{user.fullname}}</v-list-item-title>
        </v-list-item>

        <v-list dense>
          <v-list-group :value="false" v-for="group in itemGroups" :key="group.title" :prepend-icon="group.icon">
              <template v-slot:activator>
                  <v-list-item-title>{{group.title}}</v-list-item-title>
              </template>
              <v-list-item v-for="item in group.items" :key="item.title" link :to="item.link">
                  <v-list-item-icon>
                      <v-icon>{{item.icon}}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content >
                      <v-list-item-title>{{item.title}}</v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
          </v-list-group>


        </v-list>
      </v-navigation-drawer>


      <v-app-bar app color="primary" dark>
        <v-toolbar-title class="hidden-xs-only">
          <router-link to="/" tag="button" style="cursor: pointer">TykePlattform</router-link>

        </v-toolbar-title>
        <!--HorizontalNavbarIcons-->
        <v-spacer></v-spacer>
        <v-toolbar-items>
<!--          Si quieres redireccionar hay que crear el :to=item.link-->
          <v-btn text v-for="items in itemsForBarApp" :key="items.title" :to="items.link">
            <v-icon>{{items.icon}}</v-icon>

          </v-btn>
          <v-btn text v-if="user" @click="handleSignout">
            <v-icon>exit_to_app</v-icon>
          </v-btn>

        </v-toolbar-items>

      </v-app-bar>
    </v-container>
    <v-main>
      <v-container >
          <transition name="fade">
                <router-view />
          </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    drawer: false,
    //TODO: Arreglar para que cambie segun el rol
     itemGroups:[
         {
             title: "Manejo escolar",
             icon: "account_balance",
             items:[
                 {title: "Asignaturas",icon: "chrome_reader_mode",link: "/asigantura-service"},
                 {title: "Temas",icon: "bookmark",link:"/tema-service"},
                 {title: "Facultad",icon: "apartment",link:"/facultad-service"},
                 {title: "Carrera",icon: "school",link: "/carrera-service"},
                 {title: "Curso",icon: "date_range",link: "/course-service"},
                 {title: "Grupo",icon: "people",link:"/group-service"}
                ]
         },
         {
            title: "Servicio de preguntas",
             icon: "sticky_note_2",
            items: [
                {title:"Pregunta",icon:"wysiwyg",link:"/question-service"},
                {title: "Ayuda",icon:"help",link: "/help-service"}
            ]
         },
         {
             title: "Seguridad",
             icon: "shield",
             items:[
                 {title:"Usuarios",icon:"face",link:"/user-service"},
                 {title:"Roles", icon:"add_moderator",link:"/roles-service"}
                 ]
         }

         ],
    itemsForBarApp:[
      {title:"Notificaciones",icon:"notifications",link: "/notifications"},
      {title: "User-Account",icon: "account_circle",link:"/profile"}
    ],
  }),
  computed: {
    ...mapGetters(["user"]),
  },
  methods:{
    handleSignout(){
        this.$store.dispatch('logoutUser')
    }
  }
};
</script>
<style scoped>
    .fade-enter-active,
    .fade-leave-active{
        transition-property: opacity;
        transition-duration: 0.25s;
    }

    .fade-enter-active{
        transition-delay: 0.25s;
    }

    .fade-enter,
    .fade-leave-active{
        opacity: 0;
    }

</style>
