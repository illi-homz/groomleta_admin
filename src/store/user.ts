import { LoginData } from '@/models/user';
import API from '@/api/index';
import Vue from 'vue';

interface UserState {
	// token: string | null;
}

export default {
	state: (): UserState => ({
		// token: null,
	}),
	mutations: {
		// clearToken(state: UserState): void {
		// 	state.token = null;
		// },
		// setToken(state: UserState, token: string): void {
		// 	state.token = token;
		// },
	},
	actions: {
		async LOGIN({ commit }: { commit: Function }, data: LoginData) {
			try {
				const {tokenAuth} = (await API.user.login(data)) || {};
				const {token} = tokenAuth || {}

				if (!token) {
					console.log('Vue.$cookies.remove')
					const res = Vue.$cookies.remove('JWT')
					console.log('res', res)
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
			return !!token;
		},
	},
	getters: {
		// TOKEN: (s: UserState) => s.token,
	},
};
