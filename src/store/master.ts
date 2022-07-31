import Vue from 'vue';
import API from '@/api/index';
import MasterType from '@/api/master';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		groomers: [],
	}),
	mutations: {
		SET_GROOMERS(state: any, { data }: { data: MasterType[] }) {
			state.groomers = data;
		},
	},
	actions: {
		async GET_ALL_GROOMERS({ commit }: any) {
			try {
				const {allGroomers} = await API.master.fetchAllMasters();
				if (!allGroomers) throw '[GET_ALL_GROOMERS] allGroomers exist'

				if (!allGroomers) return errorResponse

				commit('SET_GROOMERS', {data: allGroomers})

				return {...successResponse, data: allGroomers};
			} catch {
				errorResponse
			}
		},
		async GET_MASTER_BY_ID({ commit }: any, id: any) {
			try {
				const {grooberById} = await API.master.fetchMasterById(id);
				if (!grooberById) throw '[GET_MASTER_BY_ID] grooberById exist'
				
				return {...successResponse, data: grooberById};
			} catch (e) {
				return errorResponse
			}
		}
	},
	getters: {
		GROOMERS: (s: any) => s.groomers,
	},
};
