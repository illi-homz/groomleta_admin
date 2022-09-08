import { LoginData } from '@/models/user';
import API from '@/api/index';
import Vue from 'vue';
import { errorResponse, successResponse } from '.';

interface UserState {}

export default {
	state: (): UserState => ({}),
	mutations: {},
	actions: {
		async LOGIN({ commit }: { commit: Function }, data: LoginData) {
			try {
				const { tokenAuth } = (await API.user.login(data)) || {};
				const { token, refreshToken } = tokenAuth || {};

				console.log('LOGIN token', token)

				if (!token) {
					Vue.$cookies.remove('JWTToken');
					throw new Error('token is null');
				}

				console.log('LOGIN token', token)

				Vue.$cookies.set('JWTToken', token, '120d');
				Vue.$cookies.set('JWTRefreshToken', refreshToken, '124d');

				return {...successResponse, data: {token, refreshToken}};
			} catch (e) {
				console.error('action LOGIN exeption:', e);
				return errorResponse;
			}
		},
		async LOGOUT() {
			try {
				const refreshToken = Vue.$cookies.get('JWTRefreshToken');
				const data = await API.user.revokeRefreshToken(refreshToken);
				Vue.$cookies.remove('JWTToken');

				return {...successResponse, data};
			} catch (e) {
				return errorResponse
			}
		},
		async CHECK_TOKEN() {
			try {
				const token = Vue.$cookies.get('JWTToken');
				if (!token) throw 'JWT token missing';

				const { verifyToken } = await API.user.validateToken(token);
				if (!verifyToken) throw 'JWT token not valid';

				const { username, exp, origIat } = verifyToken.payload || {};
				if (origIat > 300000000) return true;

				const refreshToken = Vue.$cookies.get('JWTRefreshToken');

				const { refreshToken: responsedRefreshToken } =
					await API.user.updateRefreshToken(refreshToken);

				const {
					token: responsedToken,
					refreshToken: updatedRefreshToken,
				} = responsedRefreshToken;

				Vue.$cookies.set('JWTToken', responsedToken, '120d');
				Vue.$cookies.set('JWTRefreshToken', updatedRefreshToken, '124d');

				await API.user.revokeRefreshToken(refreshToken);

				return {
					...successResponse,
					data: {
						token: responsedToken,
						refreshToken: updatedRefreshToken,
					},
				};
			} catch (e) {
				Vue.$cookies.remove('JWTToken');
				Vue.$cookies.remove('JWTRefreshToken');

				return errorResponse;
			}
		},
		CHECK_USER({ commit }: { commit: Function }) {
			const token = Vue.$cookies.get('JWTToken');
			console.log('CHECK_USER token:', token)
			return token;
		},
	},
	getters: {},
};
