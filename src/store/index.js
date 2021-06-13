import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";
import { consoleError } from "vuetify/lib/util/console";
import {
  JWT_SECRET_KEY, URL_CHANGE_PASSWORD, URL_GET_USER_BY_USERNAME,
  URL_LOGIN, URL_REGISTER_USER, URL_SAVE_USER, URL_UPDATE_USER,
} from "../urlResources";
const jwt = require("jsonwebtoken");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    user: null,
    error: null,
    authError: null,
    loadingTable:null
  },
  mutations: {
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    setLoadingTable:(state, payload)=>{state.loadingTable=payload},
    clearUser: (state) => (state.user = null),
    clearError: (state) => (state.error = null),
  },
  actions: {
    //TODO: Lo relacionado con los metodos que ejecutan las acciones
    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      axios
        .post(URL_LOGIN, payload)
        .then(({ data }) => {
          localStorage.setItem("token", data);
          commit("setLoading", false);
          commit("setError", true);
          //recargar pagina para cambiar estado del user
          router.go();
        })
        .catch((err) => {
          commit("setLoading", false);
          consoleError(err);
        });
    },
    getCurrentUser: ({ commit }) => {
      const token = localStorage.getItem("token");
      const decode = jwt.decode(token, JWT_SECRET_KEY);
      if(decode===null){
        router.push('/login');
      }else{
      axios
        .get(
          URL_GET_USER_BY_USERNAME+decode.sub,{
              headers:{
                "Authorization": "Bearer "+token,
                "cache-control": "no-cache",
              }
            }
        )
        .then(({ data }) => {
          console.log(data);
          commit('setUser',data)
        })
        .catch((err) =>{
          consoleError(err);
          router.push("/login");
        });
      }
      
      commit("clearError");
    },
    registerUser:({commit},payload)=>{
      commit("setLoading",true);
      commit("clearError");
      axios.post(URL_REGISTER_USER,payload).then(
          ({data})=>{
            localStorage.setItem('token',data);
            commit('clearError');
            commit('setLoading',false)
            router.go();
          }
      ).catch(err=>{
        consoleError(err);
        commit('setError',err)
        commit('setLoading',false)
      })

    },
    logoutUser:({commit})=>{
      commit('clearUser');
      localStorage.setItem('token','')
      router.push('/login')
    },
    updateUserPersonalData:({commit},payload)=>{
      commit('setLoading',true);
      commit('clearError')
      const token = localStorage.getItem('token');
      console.log(payload);
      axios.post(URL_UPDATE_USER,payload.userDouble,{
        headers:{
          "Authorization": "Bearer "+token,
          "cache-control": "no-cache",
        }
      }
      ).then(({data})=>{
        console.log(data)
        commit('setLoading',false);
        commit('clearError')
      }).catch(error=>{
        commit('setError',error);
        consoleError(error);
      })
      commit('setLoading',false);
    },
    changePassword:({commit},payload)=>{
      commit('setLoading',true);
      commit('clearError')
      const token = localStorage.getItem('token');
      axios.post(URL_CHANGE_PASSWORD,payload.userChange,{
        headers:{
          "Authorization": "Bearer "+token,
          "cache-control": "no-cache",
        }
      }).then(()=>{
        commit('setLoading',false);
        commit('clearError')
      }).catch(err=>{
        commit('setError',err);
        commit('setLoading',false);
      })
    },
    saveUser:({commit},payload)=>{
      commit('clearError')
      commit('setLoading',true)
      const token = localStorage.getItem('token')
      axios.post(URL_SAVE_USER,payload,{
        headers:{
          "Authorization": "Bearer "+token,
          "cache-control": "no-cache",
        }
      }).then(()=>{
        console.log("Successful")
        commit('setLoading',false)
      }).catch((error)=>{
        commit('setError',error)
        commit('setLoading',false)
      })

    }

  },
  modules: {},
  getters: {
    loading: (state) => state.loading,
    user: (state) => state.user,
    error: (state) => state.error,
    authError: (state) => state.authError,
    loadingTable:(state)=>state.loadingTable
  },
});
