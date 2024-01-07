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
				const { allMasters } = await API.master.fetchAllMasters();
				if (!allMasters) throw '[GET_ALL_GROOMERS] allMasters exist';

				if (!allMasters) return errorResponse;

				commit('SET_GROOMERS', allMasters);

				return { ...successResponse, data: allMasters };
			} catch {
				errorResponse;
			}
		},
		async GET_MASTER_BY_ID(
			{ commit }: any,
			params: GetMasterByIdParamsType,
		) {
			try {
				const { masterById: masterByIdData } = await API.master.fetchMasterById(params);

				if (!masterByIdData) throw '[GET_MASTER_BY_ID] masterById exist';

				return { ...successResponse, data: masterByIdData };
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
		async UPDATE_MASTER({ commit }: any, { id, formData }: any) {
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
		async REMOVE_GROOMER({ commit }: any, id: any) {
			try {
				const { removeMaster } = await API.master.removeMaster(id);

				commit('SET_GROOMERS', removeMaster?.allMasters || []);

				return {
					...successResponse,
					data: removeMaster,
				};
			} catch (e) {
				console.log('REMOVE_GROOMER exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		GROOMERS: (s: any) => s.groomers,
	},
};
