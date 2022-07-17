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
		LOGIN({ commit }: { commit: Function }, data: LoginData) {
			const token = API.user.login(data);
			localStorage.setItem('token', token)

			return {
				status: 'success',
				ok: true,
			};
		},
		LOGOUT({ commit }: { commit: Function }) {
			localStorage.removeItem('token')

			return {
				status: 'success',
				ok: true,
			};
		},
		CHECK_USER({ commit }: { commit: Function }) {
			const token = localStorage.getItem('token')
			return !!token
		},
	},
	getters: {
		// TOKEN: (s: UserState) => s.token,
	},
};
