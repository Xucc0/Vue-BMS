import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/style.css'
//引入element插件
import Element from 'element-ui'
Vue.use(Element)


import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
//引入axios插件
import axios from './assets/js/axios.js'
Vue.use(axios);
//引入时间格式化插件
import myData from './assets/js/moment'
Vue.use(myData);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
