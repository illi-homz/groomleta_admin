import API from '@/api/index';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		services: [],
		breeds: [],
		categories: [],
	}),
	mutations: {
		SET_SERVICES(state: any, services: Object[]) {
			state.services = services;
		},
		SET_CATEGORIES(state: any, categories: Object[]) {
			state.categories = categories;
		},
		SET_BREEDS(state: any, categories: Object[]) {
			state.categories = categories;
		},
	},
	actions: {
		async GET_SERVICES({ commit }: { commit: Function }) {
			try {
				const {
					allServices: { allServices, allBreeds, allCategories },
				} = await API.services.fetchAllServices();

				commit('SET_SERVICES', allServices || []);
				commit('SET_CATEGORIES', allCategories || []);
				commit('SET_BREEDS', allBreeds || []);

				return { ...successResponse, data: allServices };
			} catch (e) {
				console.log('GET_SERVICES exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		SERVICES: (s: any) => s.services,
		BREEDS: (s: any) => s.breeds,
		CATEGORIES: (s: any) => s.categories,
	},
};
