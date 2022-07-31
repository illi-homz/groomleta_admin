import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import services from './services';
import master from './master';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	getters: {},
	mutations: {},
	actions: {},
	modules: { user, services, master },
});

export const successResponse = {
	status: 'success',
	ok: true,
	data: null,
}
export const errorResponse = {
	status: 'error',
	ok: false,
	data: null,
}