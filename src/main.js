import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from "@/router"
import store from '@/store/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/reset.css'
import './assets/medium-editor.css'
import './assets/default.css'

import * as echarts from "echarts"

Vue.prototype.axios = axios

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
