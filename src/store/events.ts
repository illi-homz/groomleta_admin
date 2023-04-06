import API from '@/api/index';
import { errorResponse, successResponse } from '.';

type GetEventsDataType = {
	startYear: string;
	startMonth: string;
	endYear: string;
	endMonth: string;
};

export default {
	state: (): any => ({
		events: [],
	}),
	mutations: {
		SET_EVENTS(state: any, events: Object[]) {
			state.events = events;
		},
	},
	actions: {
		async GET_EVENTS(
			{ commit }: { commit: Function },
			data: GetEventsDataType,
		) {
			try {
				const { allEvents } = (await API.events.getEvents(data)) || {};

				commit('SET_EVENTS', allEvents);

				return { ...successResponse, data: allEvents };
			} catch (e) {
				console.log('GET_EVENTS exeption:', e);
				return errorResponse;
			}
		},
		async CREATE_EVENT({ commit }: any, formData: any) {
			try {
				const { createEvent } = await API.events.createEvent(formData);

				return { ...successResponse, data: createEvent };
			} catch (e) {
				console.log('CREATE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_EVENT({ commit }: any, { id, data }: any) {
			try {
				const { updateEvent } = await API.events.updateEvent({
					id,
					data,
				});

				return { ...successResponse, data: updateEvent };
			} catch (e) {
				console.log('UPDATE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async REMOVE_EVENT({ commit }: any, id: number) {
			try {
				const { removeEvent } = await API.events.removeEvent(id);

				return { ...successResponse, data: removeEvent };
			} catch (e) {
				console.log('REMOVE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async SUCCESS_EVENT({ commit, dispatch }: any, id: number) {
			try {
				const { successEvent } = await API.events.successEvent(id);

				const {
					event: { startDate, endDate },
				} = successEvent;

				const [startYear, startMonth] = startDate
					.split('T')[0]
					.split('-');
				const [endYear, endMonth] = endDate.split('T')[0].split('-');

				await dispatch('GET_EVENTS', {
					startYear,
					startMonth,
					endYear,
					endMonth,
				});

				return { ...successResponse, data: successEvent };
			} catch (e) {
				console.log('REMOVE_EVENT exeption:', e);
				return errorResponse;
			}
		},
	},
	getters: {
		EVENTS: (s: any) => s.events,
	},
};
