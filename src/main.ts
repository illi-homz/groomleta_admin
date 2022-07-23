import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false;
// Vue.use(require('vue-cookies'))
Vue.use(VueCookies, { expire: '7d'})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
