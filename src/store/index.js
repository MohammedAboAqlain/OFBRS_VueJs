import Vuex, { Store } from 'vuex'
import Vue from 'vue'
import Authentication from './modules/Authentication'
import User from './modules/User'
import Markets from './modules/Markets'
import Route from './modules/Route'

Vue.use(Vuex);

export default new Store({
    modules: {
        Authentication,
        User,
        Markets,
        Route
    }
});