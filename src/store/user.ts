import { LoginData } from '@/models/user';
import API from '@/api/index';
import Vue from 'vue';

interface UserState {
}

export default {
	state: (): UserState => ({
	}),
	mutations: {
	},
	actions: {
		async LOGIN({ commit }: { commit: Function }, data: LoginData) {
			try {
				const {tokenAuth} = (await API.user.login(data)) || {};
				const {token} = tokenAuth || {}

				console.log('token', token)

				if (true) {
				// if (!token) {
					Vue.$cookies.set('JWT', token)
					// const res = Vue.$cookies.remove('JWT')
					throw new Error('token is null')
				}

				Vue.$cookies.set('JWT', token)

				return {
					status: 'success',
					ok: true,
				};
			} catch (e) {
				console.error('action LOGIN exeption:', e);
				return {
					status: 'error',
					ok: false,
				};
			}
		},
		LOGOUT({ commit }: { commit: Function }) {
			Vue.$cookies.remove('JWT')

			return {
				status: 'success',
				ok: true,
			};
		},
		CHECK_USER({ commit }: { commit: Function }) {
			const token = Vue.$cookies.get('JWT');
			return token;
		},
	},
	getters: {
	},
};
