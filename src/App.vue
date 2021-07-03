<template>
  <v-app id="inspire">
    <v-container v-if="user">
      <v-navigation-drawer permanent expand-on-hover app v-model="drawer" class="text-center">
        <v-list-item class="2px">
          <v-list-item-avatar class="pr-1">
            <v-img contain :src="user.image_url"></v-img>
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
          <router-link to="/home" tag="button" style="cursor: pointer">TykePlatform</router-link>

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

    itemsForBarApp:[
      {title: "User-Account",icon: "account_circle",link:"/profile"}
    ],
  }),
  computed: {
    ...mapGetters(["user"]),
      itemGroups(){
        let i =0;
        let items=[];

        const estrategiasForStudent={
            title:"Estrategias",
            icon:"dashboard",
            items:[
                {title: "Estrategia",icon:"videogame_asset",link: "/strategy-service"},
                {title: "Ranking",icon:"leaderboard",link: "/ranking-service"},
            ]
        };
        const estrategias={
            title:"Estrategias",
            icon:"dashboard",
            items:[
                {title: "Estrategia",icon:"videogame_asset",link: "/strategy-service"},
                {title: "Insignia",icon:"military_tech",link: "/insignia-service"},
                {title: "Otorgamiento",icon:"card_membership",link: "/otorgamiento-service"},
                {title: "Ranking",icon:"leaderboard",link: "/ranking-service"},
                {title: "Regalo",icon:"card_giftcard",link: "/gift-service"},
                {title: "Rol Profesional",icon:"work",link: "/rol-profesional-service"},
                {title: "Tipo Regalo",icon:"app_registration",link: "/tipo-regalo-service"}
            ]
        };
        const manejoScolar =  {
            title: "Manejo escolar",
            icon: "account_balance",
            items:[
                {title: "Asignaturas",icon: "chrome_reader_mode",link: "/asigantura-service"},
                {title: "Temas",icon: "bookmark",link:"/tema-service"},
                {title: "Facultad",icon: "apartment",link:"/facultad-service"},
                {title: "Carrera",icon: "school",link: "/carrera-service"},
                {title: "Curso",icon: "date_range",link: "/course-service"},
                {title: "Grupo",icon: "people",link:"/group-service"},
                {title: "Profesores", icon:"engineering", link: "/professors"}
            ]
        };
        const preguntas =  {
              title: "Preguntas",
                  icon: "sticky_note_2",
              items: [
              {title:"Pregunta",icon:"wysiwyg",link:"/question-service"},
              {title: "Tipo de pista",icon: "search",link: "/clue-type-service"},
              {title: "Tipo de pregunta",icon:"fact_check", link:"/question-type-service" },
          ]
          };
        const seguridad={
            title: "Seguridad",
            icon: "admin_panel_settings",
            items:[
                {title:"Usuarios",icon:"face",link:"/user-service"},
                {title:"Roles", icon:"add_moderator",link:"/roles-service"}
            ]
        }

        while(i<this.user.roles.length){
            if(this.user.roles[i].roleName==="Secretaria/o"){
                items.push(manejoScolar)
            }else if(this.user.roles[i].roleName==="Profesor"){
                items.push(preguntas)
                items.push(estrategias)
            }else if(this.user.roles[i].roleName==="Administrador"){
                items.push(seguridad)
            }else if(this.user.roles[i].roleName==="Estudiante"){
                items.push(estrategiasForStudent)
            }
            i++;
        }
        return items
      }
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
