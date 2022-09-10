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
		async CREATE_CLIENT({ commit }: any, formData: any) {
			try {
				const { createClient } = await API.clients.createClient(
					formData,
				);

				commit('SET_CLIENTS', createClient?.allClients || []);

				return {
					...successResponse,
					data: createClient,
				};
			} catch (e) {
				console.log('CREATE_CLIENT exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_CLIENT({ commit }: any, { id, data }: any) {
			try {
				const { updateClient } = await API.clients.updateClient(
					id,
					data,
				);

				commit('SET_CLIENTS', updateClient?.allClients || []);

				return {
					...successResponse,
					data: updateClient,
				};
			} catch (e) {
				console.log('UPDATE_CLIENT exeption:', e);
				return errorResponse;
			}
		},
		async REMOVE_CLIENT({ commit }: any, id: any) {
			try {
				const { removeClient } = await API.clients.removeClient(id);

				commit('SET_CLIENTS', removeClient?.allClients || []);

				return {
					...successResponse,
					data: removeClient,
				};
			} catch (e) {
				console.log('REMOVE_CLIENT exeption:', e);
				return errorResponse;
			}
		},
		async GET_CLIENT_BY_ID({ commit }: any, id: any) {
			try {
				const { clientById } = await API.clients.fetchClientById(id);

				if (!clientById) throw '[GET_CLIENT_BY_ID] clientById exist';

				return { ...successResponse, data: clientById };
			} catch (e) {
				return errorResponse;
			}
		},
		async PUT_TO_BLOCK({ commit }: any, id: any) {
			try {
				const { putToBlock } = await API.clients.putToBlock(id);

				if (!putToBlock) throw '[PUT_TO_BLOCK] putToBlock exist';

				return { ...successResponse, data: putToBlock };
			} catch (e) {
				return errorResponse;
			}
		},
	},
	getters: {
		CLIENTS: (s: any) => s.clients,
	},
};
