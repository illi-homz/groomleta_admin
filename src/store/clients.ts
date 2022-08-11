import API from '@/api/index';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		clients: [],
	}),
	mutations: {
		SET_CLIENTS(state: any, clients: Object[]) {
			state.clients = clients;
		},
	},
	actions: {
		async GET_ALL_CLIENTS({ commit }: { commit: Function }) {
			try {
				const { allClients } = await API.clients.fetchAllClients();
				
				commit('SET_CLIENTS', allClients);

				return { ...successResponse, data: allClients };
			} catch (e) {
				console.log('GET_ALL_CLIENTS exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		CLIENTS: (s: any) => s.clients,
	},
};
