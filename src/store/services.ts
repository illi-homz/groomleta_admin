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
				const { allServices: data } =
					await API.services.fetchAllServices();
				const { allServices, allBreeds, allCategories } = data || {};

				commit('SET_SERVICES', allServices || []);
				commit('SET_CATEGORIES', allCategories || []);
				commit('SET_BREEDS', allBreeds || []);

				return { ...successResponse, data };
			} catch (e) {
				console.log('GET_SERVICES exeption:', e);
				return errorResponse;
			}
		},
		async CREATE_SERVICE({ commit }: any, formData: any) {
			try {
				const { createService: data } =
					await API.services.createService(formData);

				// const { allServices, allBreeds, allCategories } = data || {};

				// commit('SET_SERVICES', allServices || []);
				// commit('SET_CATEGORIES', allCategories || []);
				// commit('SET_BREEDS', allBreeds || []);

				return { ...successResponse, data };
			} catch (e) {
				console.log('CREATE_SERVICE exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_SERVICE({ commit }: any, { id, data }: any) {
			try {
				const { updateService } =
					await API.services.updateService(id, data);

				return { ...successResponse, data: updateService };
			} catch (e) {
				console.log('UPDATE_SERVICE exeption:', e);
				return errorResponse;
			}
		},
		async REMOVE_SERVICE({ commit }: any, id: number|string) {
			try {
				const { removeService } =
					await API.services.removeService(id);
					
				return { ...successResponse, data: removeService };
			} catch (e) {
				console.log('UPDATE_SERVICE exeption:', e);
				return errorResponse;
			}
		},
		UPLOAD_SERVICE_IMAGE({ commit }: any, { id, img }: any) {
			try {
				return API.services.uploadImage(id, img);
			} catch (e) {
				console.log('UPLOAD_SERVICE_IMAGE exeption:', e);
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
