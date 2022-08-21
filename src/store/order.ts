import API from '@/api/index';
import MasterType from '@/api/master';
import { DefaultOrderDataType } from '@/models/order';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		isCreateOrderShow: false,
		isDetailOrderShow: false,
		defaultOrderData: null,
		detailOrderShieldData: null,
	}),
	mutations: {
		SHOW_ORDER_FORM(state: any, defaultData: DefaultOrderDataType) {
			if (defaultData) {
				state.defaultOrderData = defaultData
			}
			state.isCreateOrderShow = true
		},
		CLOSE_ORDER_FORM(state: any) {
			state.isCreateOrderShow = false
			state.defaultOrderData = null
		},
		SHOW_ORDER_DETAIL_SHIELD(state: any, defaultData: any) {
			if (defaultData) {
				state.detailOrderShieldData = defaultData
			}
			state.isDetailOrderShow = true
		},
		CLOSE_ORDER_DETAIL_SHIELD(state: any) {
			state.isDetailOrderShow = false
			state.detailOrderShieldData = null
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
				console.log('orderData', orderData)
				// return {data: null}
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
		IS_DETAIL_ORDER_SHOW: (s: any) => s.isDetailOrderShow,
		DEFAULT_ORDER_DATA: (s: any) => s.defaultOrderData,
		DETAIL_ORDER_SHIELD_DATA: (s: any) => s.detailOrderShieldData,
	},
};
