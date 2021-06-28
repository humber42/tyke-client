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
import InsertarGrupo from "../components/ScholarService/SecretariaManagement/InsertarGrupo";
import ProfesoresManagement from "../components/ScholarService/SecretariaManagement/ProfesoresManagement";
import ClueTypeService from "../components/QuestionService/ClueTypeService";
import QuestionNewService from "../components/QuestionService/QuestionNewService";
import QuestionMainService from "../components/QuestionService/QuestionMainService";
import QuestionTypeService from "../components/QuestionService/QuestionTypeService";
import BonificationService from "../components/QuestionService/BonificationService";
import EstrategiaMainService from "../components/StrategyService/EstrategiaMainService";
import InsigniaMainService from "../components/StrategyService/InsigniaMainService";
import OtorgamientoMainService from "../components/StrategyService/OtorgamientoMainService";
import RankingMainService from "../components/StrategyService/RankingMainService";
import RegaloMainService from "../components/StrategyService/RegaloMainService";
import TipoRegaloMainService from "../components/StrategyService/TipoRegaloMainService";
import RolMainService from "../components/StrategyService/RolMainService";
import EstrategiaNewService from "../components/StrategyService/EstrategiaNewService";
import page403 from "../components/page403";
import HomePage from "../components/HomePage";

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
  },
  {
    path: "/new-group-service",
    name:"NewGroupService",
    component: InsertarGrupo
  },
  {
    path: "/professors",
    name:"ProfesoresManagement",
    component: ProfesoresManagement
  },
  {
    path: "/clue-type-service",
    name: "ClueTypeService",
    component: ClueTypeService
  },
  {
    path: "/question-new-service",
    name: "QuestionNewService",
    component: QuestionNewService
  },
  {
    path: "/question-service",
    name: "QuestionMainService",
    component: QuestionMainService
  },
  {
    path: "/question-type-service",
    name: "QuestionTypeService",
    component: QuestionTypeService
  },
  {
    path: "/bonification-service",
    name: "BonificationService",
    component: BonificationService
  },
  {
    path: "/strategy-service",
    name:"EstrategiaMainService",
    component: EstrategiaMainService
  },
  {
    path: "/insignia-service",
    name: "InsigniaMainService",
    component: InsigniaMainService
  },
  {
    path: "/otorgamiento-service",
    name: "OtorgamientoMainService",
    component: OtorgamientoMainService
  },
  {
    path: "/ranking-service",
    name: "RankingMainService",
    component: RankingMainService
  },
  {
    path: "/gift-service",
    name: "RegaloMainService",
    component: RegaloMainService
  },
  {
    path: "/rol-profesional-service",
    name: "RolMainService",
    component: RolMainService
  },
  {
    path: "/tipo-regalo-service",
    name: "TipoRegaloMainService",
    component: TipoRegaloMainService
  },
  {
    path: "/new-strategy",
    name: "EstrategiaNewService",
    component: EstrategiaNewService
  },
  {
    path:"/403",
    name:"403",
    component: page403
  },
  {
    path: "/home",
    name:"HomePage",
    component: HomePage
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
