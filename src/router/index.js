import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Auth/Login";
import Profile from "../components/Auth/Profile";
import UserServiceMain from "../components/UserService/UserServiceMain";
import RolServiceMain from "../components/UserService/RolServiceMain";
import AsignaturaMainService from "../components/ScholarService/AsignaturaMainService";
import FacultadMainService from "../components/ScholarService/FacultadMainService";
import CarreraMainService from "../components/ScholarService/CarreraMainService";
import CursoMainService from "../components/ScholarService/CursoMainService";
import TemaMainService from "../components/ScholarService/TemaMainService";
import GrupoMainService from "../components/ScholarService/GrupoMainService";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path:"/user-service",
    name:"UserServiceMain",
    component: UserServiceMain
  },
  {
    path: "/roles-service",
    name: "RolServiceMain",
    component: RolServiceMain
  },
  {
    path: "/asigantura-service",
    name:"AsignaturaMainService",
    component:AsignaturaMainService
  },
  {
    path: "/facultad-service",
    name:"FacultadMainService",
    component: FacultadMainService
  },
  {
    path: "/carrera-service",
    name:"CarreraMainService",
    component: CarreraMainService
  },
  {
    path: "/course-service",
    name: "CursoMainService",
    component: CursoMainService
  },
  {
    path: "/tema-service",
    name: "TemaMainService",
    component: TemaMainService
  },
  {
    path: "/group-service",
    name:"GrupoMainService",
    component: GrupoMainService
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
