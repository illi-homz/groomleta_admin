import API from '@/api/index';
import MasterType from '@/api/master';
import { DefaultOrderDataType } from '@/models/order';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		isCreateOrderShow: false,
		defaultData: null
	}),
	mutations: {
		SHOW_ORDER_FORM(state: any, defaultData: DefaultOrderDataType) {
			state.isCreateOrderShow = true
			if (defaultData) {
				state.defaultData = defaultData
			}
		},
		CLOSE_ORDER_FORM(state: any) {
			state.isCreateOrderShow = false
			state.defaultData = null
		}
	},
	actions: {
		async GET_ALL_ORDERS({ commit }: any) {
			try {
				const {allOrders} = await API.order.fetchAllOrders()

				return {...successResponse, data: allOrders}
			} catch (e) {
				console.log('GET_ALL_ORDERS exeption:', e);
				return errorResponse;
			}
		},
		async CREATE_ORDER({ commit }: any, orderData: DefaultOrderDataType) {
			try {
				const {createOrder} = await API.order.createOrder(orderData)

				commit('CLOSE_ORDER_FORM');

				return {...successResponse, data: createOrder}
			} catch (e) {
				console.log('CREATE_ORDER exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		IS_CREATE_ORDER_SHOW: (s: any) => s.isCreateOrderShow,
		DEFAULT_ORDER_DATA: (s: any) => s.defaultData,
	},
};
