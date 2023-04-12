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
		events: {},
		cachedDates: {},
	}),
	mutations: {
		SET_EVENTS(state: any, events: Object[]) {
			state.events = events;
		},
		SET_CACHED_DATES(state: any, cachedDates: {[key: string]: boolean}) {
			state.cachedDates = cachedDates;
		},
	},
	actions: {
		async GET_EVENTS(
			{ commit, state: { events, cachedDates } }: any,
			data: {
				dates: GetEventsDataType;
				isForce: boolean;
			},
		) {
			const { dates, isForce } = data;
			const { startYear, startMonth, endYear, endMonth } = dates;
			const dateKey = `${startYear}-${startMonth}-${endYear}-${endMonth}`;

			try {
				if (cachedDates[dateKey] && !isForce) throw `event date: ${dateKey} is cahed`

				const newCachedDates = isForce ? {[dateKey]: true} : {...cachedDates, [dateKey]: true}
				commit('SET_CACHED_DATES', newCachedDates);
				const { allEvents } = (await API.events.getEvents(dates)) || {};
				const allEventsObj = allEvents.reduce(
					//@ts-ignore
					(acc, el) => ({ ...acc, [el.id]: el }),
					{},
				);
				const newEvents = isForce
					? allEventsObj
					: { ...events, ...allEventsObj };

				commit('SET_EVENTS', newEvents);

				return { ...successResponse, data: allEvents };
			} catch (e) {
				console.warn('GET_EVENTS exeption:', e);
				return errorResponse;
			}
		},
		async CREATE_EVENT({ commit, state: { events } }: any, formData: any) {
			try {
				const { createEvent } = await API.events.createEvent(formData);

				commit('SET_EVENTS', {
					...events,
					[createEvent.event.id]: createEvent.event,
				});

				return { ...successResponse, data: createEvent };
			} catch (e) {
				console.log('CREATE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async UPDATE_EVENT(
			{ commit, state: { events } }: any,
			{ id, data }: any,
		) {
			try {
				const { updateEvent } = await API.events.updateEvent({
					id,
					data,
				});

				commit('SET_EVENTS', {
					...events,
					[updateEvent.event.id]: updateEvent.event,
				});

				return { ...successResponse, data: updateEvent };
			} catch (e) {
				console.log('UPDATE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async REMOVE_EVENT({ commit, state: { events } }: any, id: number) {
			try {
				const { removeEvent } = await API.events.removeEvent(id);
				const { [id]: _, ...newEvents } = events;

				commit('SET_EVENTS', newEvents);

				return { ...successResponse, data: removeEvent };
			} catch (e) {
				console.log('REMOVE_EVENT exeption:', e);
				return errorResponse;
			}
		},
		async SUCCESS_EVENT(
			{ commit, dispatch, state: { events } }: any,
			id: number,
		) {
			try {
				const { successEvent } = await API.events.successEvent(id);

				commit('SET_EVENTS', {
					...events,
					[id]: successEvent.event,
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
