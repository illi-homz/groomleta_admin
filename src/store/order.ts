import API from '@/api/index';
// import { DefaultOrderDataType } from '@/models/order';
import { DefaultOrderDataType, FetchOrdersParamsType, OrderType } from '@/types/orders';
import { errorResponse, successResponse } from '.';

type StateType = {
	allOrders: OrderType[];
	// allOrdersObj: { [key: string]: OrderType };
	isCreateOrderShow: boolean;
	isDetailOrderShow: boolean;
	defaultOrderData: DefaultOrderDataType | null;
	detailOrderShieldData: null | any;
};

export default {
	state: (): StateType => ({
		allOrders: [],
		// allOrdersObj: {},
		isCreateOrderShow: false,
		isDetailOrderShow: false,
		defaultOrderData: null,
		detailOrderShieldData: null,
	}),
	mutations: {
		SET_ALL_ORDERS(state: any, data: any) {
			state.allOrders = data || [];
		},
		SET_ALL_ORDERS_OBJ(state: any, data: { [key: string]: OrderType }) {
			state.allOrders = data;
		},
		SHOW_ORDER_FORM(state: any, defaultData: DefaultOrderDataType) {
			if (defaultData) {
				state.defaultOrderData = defaultData;
			}
			state.isCreateOrderShow = true;
		},
		CLOSE_ORDER_FORM(state: any) {
			state.isCreateOrderShow = false;
			state.defaultOrderData = null;
		},
		SHOW_ORDER_DETAIL_SHIELD(state: any, defaultData: any) {
			if (defaultData) {
				state.detailOrderShieldData = defaultData;
			}
			state.isDetailOrderShow = true;
		},
		CLOSE_ORDER_DETAIL_SHIELD(state: any) {
			state.isDetailOrderShow = false;
			state.detailOrderShieldData = null;
		},
	},
	actions: {
		async GET_ALL_ORDERS({ commit }: any) {
			try {
				const { allOrders } = await API.order.fetchAllOrders();

				commit('SET_ALL_ORDERS', allOrders);

				return { ...successResponse, data: allOrders };
			} catch (e) {
				console.log('GET_ALL_ORDERS exeption:', e);
				return errorResponse;
			}
		},
		async GET_ORDERS({ commit }: any, params: FetchOrdersParamsType) {
			try {
				const { orders } = await API.order.fetchOrders(params);

				return { ...successResponse, ...orders };
			} catch (e) {
				console.log('GET_ORDERS exeption:', e);
				return errorResponse;
			}
		},
		async CREATE_ORDER({ commit }: any, orderData: DefaultOrderDataType) {
			try {
				const { createOrder } = await API.order.createOrder(orderData);

				// commit('SET_ALL_ORDERS', createOrder.allOrders);

				return { ...successResponse, data: createOrder };
			} catch (e) {
				console.log('CREATE_ORDER exeption:', e);
				return errorResponse;
			}
		},
		async PAY_FOR_ORDER({ commit }: any, id: number) {
			try {
				const { payForOrder } = await API.order.payForOrder(id);

				// commit('SET_ALL_ORDERS', payForOrder.allOrders);

				return { ...successResponse, data: payForOrder };
			} catch (e) {
				console.log('PAY_FOR_ORDER exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_AND_PAY_ORDER({ commit }: any, { id, orderData }: any) {
			try {
				const { updateAndPayOrder } = await API.order.updateAndPayOrder(
					id,
					orderData,
				);

				// commit('SET_ALL_ORDERS', updateAndPayOrder.allOrders);

				return { ...successResponse, data: updateAndPayOrder };
			} catch (e) {
				console.log('UPDATE_AND_PAY_ORDER exeption:', e);
				return errorResponse;
			}
		},
		async CANCEL_ORDER({ commit }: any, id: number) {
			try {
				const { cancelOrder } = await API.order.cancelOrder(id);

				// commit('SET_ALL_ORDERS', cancelOrder.allOrders);

				return { ...successResponse, data: cancelOrder };
			} catch (e) {
				console.log('CANCEL_ORDER exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		ALL_ORDERS: (s: any) => s.allOrders,
		IS_CREATE_ORDER_SHOW: (s: any) => s.isCreateOrderShow,
		IS_DETAIL_ORDER_SHOW: (s: any) => s.isDetailOrderShow,
		DEFAULT_ORDER_DATA: (s: any) => s.defaultOrderData,
		DETAIL_ORDER_SHIELD_DATA: (s: any) => s.detailOrderShieldData,
	},
};
