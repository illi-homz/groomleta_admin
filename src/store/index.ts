import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import services from './services';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	getters: {},
	mutations: {},
	actions: {},
	modules: { user, services },
});
