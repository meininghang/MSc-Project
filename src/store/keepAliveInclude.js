

export default{
    namespaced: true,
    state: {
        // keepAlive Cache element
        keepAliveInclude: [],
    },
    getters:{
        aliveInclude(state) {
            return state.keepAliveInclude
        }
    },
    mutations: {
        SET_KEEPALIVEINCLUDE:(state, keepAliveInclude) => {
            state.keepAliveInclude = keepAliveInclude;
        }
    },
    actions: {
        setKeepAliveInclude({ commit }, keepAliveInclude){
            commit("SET_KEEPALIVEINCLUDE", keepAliveInclude)
        },
    },
}
