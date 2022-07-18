import { LoginData } from '@/models/user';
import API from '@/api/index';

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
				const token = await API.user.login(data);

				console.log('token', token)

				if (!token) {
					throw new Error('token is null')
				}

				localStorage.setItem('token', token);

				return {
					status: 'success',
					ok: true,
				};
			} catch (e) {
				console.log('action LOGIN exeption:', e);
				return {
					status: 'error',
					ok: false,
				};
			}
		},
		LOGOUT({ commit }: { commit: Function }) {
			localStorage.removeItem('token');

			return {
				status: 'success',
				ok: true,
			};
		},
		CHECK_USER({ commit }: { commit: Function }) {
			const token = localStorage.getItem('token');
			return !!token;
		},
	},
	getters: {
		// TOKEN: (s: UserState) => s.token,
	},
};
