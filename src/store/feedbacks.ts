import API from '@/api/index';
import { errorResponse, successResponse } from '.';

export default {
	state: (): any => ({
		feedbacks: [],
	}),
	mutations: {
		SET_FEEDBACKS(state: any, feedbacks: Object[]) {
			state.feedbacks = feedbacks;
		},
	},
	actions: {
		async GET_ALL_FEEDBACKS({ commit }: { commit: Function }) {
			try {
				const { allFeedbacks } = await API.feedbacks.getFeedbacks();

				console.log('allFeedbacks', allFeedbacks)

				commit('SET_FEEDBACKS', allFeedbacks || []);

				return { ...successResponse, data: allFeedbacks };
			} catch (e) {
				console.log('GET_ALL_FEEDBACKS exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_FEEDBACK({ commit }: any, { id, data }: any) {
			try {
				const { updateFeedback } = await API.feedbacks.updateFeedback(
					id,
					data,
				);

				commit('SET_FEEDBACKS', updateFeedback?.allFeedbacks || []);

				return {
					...successResponse,
					data: updateFeedback,
				};
			} catch (e) {
				console.log('UPDATE_FEEDBACK exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		FEEDBACKS: (s: any) => s.feedbacks,
	},
};
