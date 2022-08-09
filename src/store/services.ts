import API from '@/api/index';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		services: [],
	}),
	mutations: {
		SET_SERVICES(state: any, services: Object[]) {
			state.services = services;
		},
	},
	actions: {
		async GET_SERVICES({ commit }: { commit: Function }) {
			try {
				const { allServices } = await API.services.getServices();

				commit('SET_SERVICES', allServices);

				return { ...successResponse, data: allServices };
			} catch (e) {
				console.log('GET_SERVICES exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		SERVICES: (s: any) => s.services,
	},
};
