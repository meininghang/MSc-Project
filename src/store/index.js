import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'
import order from './order'
import keepAliveInclude from "./keepAliveInclude"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        account,
        order,
        keepAliveInclude
    }
})