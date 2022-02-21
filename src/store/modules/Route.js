
const state = {
    hasIntries : false
};

const getters = {
    hasIntries(state){
        return state.hasIntries;
    }
};

const actions = {
    setHasIntries({commit}, value){
        commit('setHasIntries', value)
    }
};

const mutations = {
    setHasIntries : (state, value) => state.hasIntries = value
};

export default {
    state,
    getters,
    actions,
    mutations
}