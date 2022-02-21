import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './store'
import './assets/style/app.css'
import { AutoCompletePlugin } from "@syncfusion/ej2-vue-dropdowns"

import {routes} from './routes'

Vue.use(VueRouter);
Vue.use(AutoCompletePlugin);

Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes
});


router.beforeEach((to, from, next) => {
  console.log(from.fullPath);
  if(((from.fullPath == '/FishermanInputReport' 
    || from.fullPath == '/InAndOutRecord/Receive' 
    || from.fullPath == '/InAndOutRecord/Send') 
      && store.getters.hasIntries)){
    if(confirm(`هل أنت متأكد من رغبتك في عدم حفظ البيانات المدخلة؟
    سيتم فقد البيانات المدخلة في حال عدم اعتمادها
    `)){
      next();
    }
  } else {
    next();
  }
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
