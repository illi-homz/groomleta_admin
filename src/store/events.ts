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
		async GET_EVENTS({ commit }: { commit: Function }, data: any) {
			try {
				const { allEvents } = await API.events.getEvents(data) || {};

				commit('SET_EVENTS', allEvents);

				return { ...successResponse, data: allEvents };
			} catch (e) {
				console.log('GET_EVENTS exeption:', e);
				return errorResponse;
			}
		},
		async CREATE_EVENT({ commit }: any, formData: any) {
			try {
				const {createEvent} = await API.events.createEvent(formData);

				if (createEvent?.allEvents) {
					commit('SET_EVENTS', createEvent.allEvents);
				}

				return { ...successResponse, data: createEvent }
			} catch (e) {
				console.log('CREATE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_EVENT({ commit }: any, {id, data}: any) {
			try {
				const {updateEvent} = await API.events.updateEvent({id, data});

				if (updateEvent?.allEvents) {
					commit('SET_EVENTS', updateEvent.allEvents);
				}

				return {...successResponse, data: updateEvent}
			} catch (e) {
				console.log('UPDATE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async REMOVE_EVENT({ commit }: any, id: number) {
			try {
				const {removeEvent} = await API.events.removeEvent(id);

				if (removeEvent?.allEvents) {
					commit('SET_EVENTS',removeEvent.allEvents);
				}

				return {...successResponse, data: removeEvent}
			} catch (e) {
				console.log('REMOVE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async SUCCESS_EVENT({ commit }: any, id: number) {
			try {
				const {successEvent} = await API.events.successEvent(id);

				if (successEvent?.allEvents) {
					commit('SET_EVENTS',successEvent.allEvents);
				}

				return {...successResponse, data: successEvent}
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
