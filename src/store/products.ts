import API from '@/api/index';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		products: [],
	}),
	mutations: {
		SET_PRODUCTS(state: any, products: Object[]) {
			state.products = products;
		},
	},
	actions: {
		async GET_ALL_PRODUCTS({ commit }: { commit: Function }) {
			try {
				const { allProducts } = await API.products.getProducts();

				commit('SET_PRODUCTS', allProducts);

				return { ...successResponse, data: allProducts };
			} catch (e) {
				console.log('GET_ALL_PRODUCTS exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		PRODUCTS: (s: any) => s.products,
	},
};
