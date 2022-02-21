// import axios from "axios";

const state = {
    authinticated: false,
    isAdmin: false,
    token: null
};

const getters = {
    isAuthinticated(state){
        return state.authinticated;
    },
    isAdmin(state){
        return state.isAdmin;
    },
    getToken(state){
        return state.token;
    }
};

const actions = {
    login({commit}) {
        commit('login', true);
    },
    logout({commit}){
        commit('login', false)
    },
    setAdmin({commit}, value){
        commit('isAdmin', value)
    },
    setToken({commit}, value){
        commit('setToken', value)
    }
};

const mutations = {
    login: (state, authinticated) => state.authinticated = authinticated,
    isAdmin: (state, isAdmin) => state.isAdmin = isAdmin,
    setToken: (state, token) => state.token = token
};

export default {
    state,
    getters,
    actions,
    mutations
};