// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import axios from 'axios'
import common from './js/common.js'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(common)
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.prototype.HOST = '/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log('请求开始')
  console.log(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  console.log('请求失败')
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  console.log('响应失败')
  return Promise.reject(error)
})
