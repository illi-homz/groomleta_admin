import Vue from 'vue';
import API from '@/api/index';
import MasterType from '@/api/master';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		groomers: [],
	}),
	mutations: {
		SET_GROOMERS(state: any, groomers: MasterType[]) {
			state.groomers = groomers;
		},
	},
	actions: {
		async GET_ALL_GROOMERS({ commit }: any) {
			try {
				const { allGroomers } = await API.master.fetchAllMasters();
				if (!allGroomers) throw '[GET_ALL_GROOMERS] allGroomers exist';

				if (!allGroomers) return errorResponse;

				commit('SET_GROOMERS', allGroomers);

				return { ...successResponse, data: allGroomers };
			} catch {
				errorResponse;
			}
		},
		async GET_MASTER_BY_ID({ commit }: any, id: any) {
			try {
				const { masterById } = await API.master.fetchMasterById(id);

				if (!masterById) throw '[GET_MASTER_BY_ID] masterById exist';

				console.log('masterById', masterById)

				return { ...successResponse, data: masterById };
			} catch (e) {
				return errorResponse;
			}
		},
		async CREATE_MASTER({ commit }: any, formData: any) {
			try {
				const { createMaster } = await API.master.createMaster(
					formData,
				);

				commit('SET_GROOMERS', createMaster?.allMasters || []);

				return {
					...successResponse,
					data: createMaster?.allMasters,
				};
			} catch (e) {
				console.log('CREATE_MASTER exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_MASTER({ commit }: any, {id, formData}: any) {
			try {
				const { updateMaster } = await API.master.updateMaster(
					id,
					formData,
				);

				commit('SET_GROOMERS', updateMaster?.allMasters || []);

				return {
					...successResponse,
					data: updateMaster?.master,
				};
			} catch (e) {
				console.log('CREATE_MASTER exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		GROOMERS: (s: any) => s.groomers,
	},
};
