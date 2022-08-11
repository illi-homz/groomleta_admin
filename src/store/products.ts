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

				commit('SET_PRODUCTS', allProducts || []);

				return { ...successResponse, data: allProducts };
			} catch (e) {
				console.log('GET_ALL_PRODUCTS exeption:', e);
				return errorResponse;
			}
		},
		async CREATE_PRODUCT({ commit }: any, formData: any) {
			try {
				const { createProduct } = await API.products.createProduct(
					formData,
				);

				commit('SET_PRODUCTS', createProduct?.allProducts || []);

				return {
					...successResponse,
					data: createProduct,
				};
			} catch (e) {
				console.log('CREATE_PRODUCT exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_PRODUCT({ commit }: any, { id, data }: any) {
			try {
				const { updateProduct } = await API.products.updateProduct(
					id,
					data,
				);

				commit('SET_PRODUCTS', updateProduct?.allProducts || []);

				return {
					...successResponse,
					data: updateProduct,
				};
			} catch (e) {
				console.log('UPDATE_PRODUCT exeption:', e);
				return errorResponse;
			}
		},
		async REMOVE_PRODUCT({ commit }: any, id: any) {
			try {
				const { removeProduct } = await API.products.removeProduct(id);
				console.log('removeProduct', removeProduct)

				commit('SET_PRODUCTS', removeProduct?.allProducts || []);

				return {
					...successResponse,
					data: removeProduct,
				};
			} catch (e) {
				console.log('REMOVE_PRODUCT exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		PRODUCTS: (s: any) => s.products,
	},
};
