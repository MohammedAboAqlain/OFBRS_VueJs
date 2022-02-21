
const state = {user: null};

const getters = {
    getUser(state) {
        return state.user;
    }
};

const actions = {
    setUser({commit}, value){
        commit('setUser', value);
    }
};

const mutations = {
    setUser: (state, user) => state.user = user
};

export default {
    state,
    getters,
    actions,
    mutations
}
