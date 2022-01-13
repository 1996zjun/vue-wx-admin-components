import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import AdminComponents from './components/index.js'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(AdminComponents)


// 全局utils
import myUtils from './utils/myUtils'

Vue.prototype.$myUtils = myUtils


new Vue({
  render: h => h(App),
}).$mount('#app')
