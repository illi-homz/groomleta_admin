import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false;
// Vue.use(VueCookies, { expire: '30d'})
Vue.use(VueCookies, { expire: '30d', sameSite: 'Strict'})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
