import API from '@/api/index';
import { errorResponse, successResponse } from '.';

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
		async GET_EVENTS({ commit }: { commit: Function }) {
			try {
				const { allEvents } = await API.events.getEvents();

				commit('SET_EVENTS', allEvents);

				return { ...successResponse, data: allEvents };
			} catch (e) {
				console.log('GET_EVENTS exeption:', e);
				return errorResponse;
			}
		},
		async CREATE_EVENT({ commit }: any, formData: any) {
			try {
				const data = await API.events.createEvent(formData);
				return { ...successResponse, data }
			} catch (e) {
				console.log('CREATE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_EVENT({ commit }: any, {id, data}: any) {
			try {
				const {updateEvent} = await API.events.updateEvent({id, data});
				console.log('UPDATE_EVENT', updateEvent)
				return {...successResponse, data: updateEvent?.event}
			} catch (e) {
				console.log('UPDATE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async REMOVE_EVENT({ commit }: any, id: number) {
			try {
				const {removeEvent} = await API.events.removeEvent(id);
				console.log('REMOVE_EVENT', removeEvent)
				return {...successResponse, data: removeEvent?.event}
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
