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

				if (!token) {
					Vue.$cookies.remove('JWT');
					throw new Error('token is null');
				}

				Vue.$cookies.set('JWT', token);
				Vue.$cookies.set('JWTrefreshToken', refreshToken);

				return {...successResponse, data: {token, refreshToken}};
			} catch (e) {
				console.error('action LOGIN exeption:', e);
				return errorResponse;
			}
		},
		async LOGOUT() {
			try {
				const refreshToken = Vue.$cookies.get('JWTrefreshToken');
				const data = await API.user.revokeRefreshToken(refreshToken);
				Vue.$cookies.remove('JWT');

				return {...successResponse, data};
			} catch (e) {
				return errorResponse
			}
		},
		async CHECK_TOKEN() {
			try {
				const token = Vue.$cookies.get('JWT');
				if (!token) throw 'JWT token missing';

				const { verifyToken } = await API.user.validateToken(token);
				if (!verifyToken) throw 'JWT token not valid';

				const { username, exp, origIat } = verifyToken.payload || {};
				if (origIat > 300000000) return true;

				const refreshToken = Vue.$cookies.get('JWTrefreshToken');

				const { refreshToken: responsedRefreshToken } =
					await API.user.updateRefreshToken(refreshToken);

				const {
					token: responsedToken,
					refreshToken: updatedRefreshToken,
				} = responsedRefreshToken;

				Vue.$cookies.set('JWT', responsedToken);
				Vue.$cookies.set('JWTrefreshToken', updatedRefreshToken);

				await API.user.revokeRefreshToken(refreshToken);

				return {
					...successResponse,
					data: {
						token: responsedToken,
						refreshToken: updatedRefreshToken,
					},
				};
			} catch (e) {
				Vue.$cookies.remove('JWT');
				Vue.$cookies.remove('JWTrefreshToken');

				return errorResponse;
			}
		},
		CHECK_USER({ commit }: { commit: Function }) {
			const token = Vue.$cookies.get('JWT');
			return token;
		},
	},
	getters: {},
};
