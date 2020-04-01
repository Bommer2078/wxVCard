import Vue from 'vue'
import App from './App'

import store from './store'
import api from './libs/api.js'
import http from './libs/serve.js'
import tip from './utils/tip'
import timeText from './utils/timeText'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$api = api
Vue.prototype.$http = http
Vue.prototype.$tip = tip
Vue.prototype.$timeText = timeText


App.mpType = 'app'
const app = new Vue({
    store,
    ...App
})
app.$mount()
