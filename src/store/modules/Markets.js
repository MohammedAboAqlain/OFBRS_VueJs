import axios from "axios";

const state = {
    markets: []
};

const getters = {
    getAllMarkets(state){
        return state.markets;
    }
};

const actions = {
    fetchMarkets({commit}){
        axios.get('http://127.0.0.1:8000/api/index-market',
        {headers: { Authorization: `Token ${this.getToken}` }})
            .then(res => {
                console.log(res);
                let result = [];
                for (let i = 0; i < res.data.item.length; i++) {
                    if(res.data.item[i]){
                        result[res.data.item[i].id] = res.data.item[i].name;
                    }
                }
                commit('fetchMarkets', result);
            })
            .catch(err => console.log(err));
    }
};

const mutations = {
    fetchMarkets: (state, value) => state.markets = value
};

export default {
    state,
    getters,
    actions,
    mutations
};
