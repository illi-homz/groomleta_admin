<template>
	<div class="g-calendar flex-grow-1 d-flex flex-column">
		<h1>Календарь</h1>
		<v-row class="g-calendar__content fill-height flex-grow-1 d-flex">
			<v-col class="flex-column d-flex flex-column">
				<v-sheet height="64">
					<v-toolbar flat>
						<v-btn
							outlined
							tile
							class="mr-4 h-40"
							color="grey darken-2"
							@click="setToday"
						>
							Сегодня
						</v-btn>
						<v-btn
							fab
							tile
							text
							small
							color="grey darken-2"
							@click="prev"
						>
							<v-icon small> mdi-chevron-left </v-icon>
						</v-btn>
						<v-btn
							fab
							text
							small
							color="grey darken-2"
							@click="next"
						>
							<v-icon small> mdi-chevron-right </v-icon>
						</v-btn>
						<v-toolbar-title v-if="$refs.calendar">
							{{ $refs.calendar.title }}
						</v-toolbar-title>
						<v-spacer />
						<v-select
							v-model="currentGroomerId"
							:items="grummersList"
							outlined
							tile
							color="grey darken-2"
							item-color="grey darken-2"
							hide-details
							dense
							class="mr-4 g-calendar__groomers-filter"
						/>
						<v-btn
							outlined
							tile
							class="mr-4 h-40"
							color="grey darken-2"
							@click="createOrder"
						>
							Оформить заказ
						</v-btn>

						<v-btn
							outlined
							tile
							class="mr-4 h-40"
							color="grey darken-2"
							@click="type = 'week'"
						>
							Неделя
						</v-btn>
						<v-btn
							outlined
							tile
							class="mr-4 h-40"
							color="grey darken-2"
							@click="type = 'month'"
						>
							Месяц
						</v-btn>
						<v-btn
							outlined
							tile
							class="h-40"
							color="grey darken-2"
							@click="getEvents(true)"
						>
							<v-icon> mdi-autorenew </v-icon>
						</v-btn>
					</v-toolbar>
				</v-sheet>
				<v-sheet height="600" class="flex-grow-1">
					<v-calendar
						ref="calendar"
						v-model="focus"
						color="#FFC11C"
						:events="events"
						:event-color="getEventColor"
						:show-week="true"
						:type="type"
						category-show-all
						locale="ru"
						:categories="categories"
						weekdays="1,2,3,4,5,6,0"
						:locale-first-day-of-year="4"
						:event-ripple="false"
						event-more-text="смотреть все"
						@click:more="toggleWeek"
						@click:date="type = 'category'"
						@click:day="showCreateEventForm"
						@click:time="showCreateEventForm"
						@click:event="showEvent"
						@mousedown:event="startDrag"
						@mousemove:time="mouseMove"
						@mousedown:time="startTime"
						@mouseup:time="endDrag"
						@mouseleave.native="cancelDrag"
						@change="getEvents(false)"
						@contextmenu:time="toggleWeek"
						@contextmenu:day="toggleWeek"
					>
						<template v-slot:event="{ event, timed, eventSummary }">
							<div class="d-flex align-start pl-1">
								<v-icon
									v-if="!event.isSuccess && !event.client"
									color="white"
									size="16"
									style="margin-top: 2px"
								>
									mdi-account-outline
								</v-icon>
								<div
									class="v-event-draggable"
									v-html="eventSummary()"
								/>
							</div>

							<div class="px-2">
								<b>
									{{
										event.services.length > 1
											? 'Услуги'
											: 'Услуга'
									}}
								</b>
								:
							</div>
							<ul v-if="event.services.length" class="mb-1">
								<li
									v-for="service in event.services"
									:key="service.id"
								>
									{{ service.breed?.title || 'любая порода' }}
									-
									{{ service.title }}
								</li>
							</ul>
							<div v-else class="px-2">
								<i>Услуга не выбрана</i>
							</div>
							<div v-if="event.master" class="px-2">
								<b>Груммер</b>: {{ event.master.username }}
								{{ event.master.lastname }}
							</div>
							<div v-if="event.client" class="px-2">
								<b>Клиент</b>: {{ event.client.username }}
								{{ event.client.lastname }}
							</div>
							<div
								v-if="timed"
								class="v-event-drag-bottom"
								@mousedown.stop="extendBottom(event)"
							/>
						</template>
					</v-calendar>
					<GCalendarEventMenu
						v-model="selectedOpen"
						:selected-event="selectedEvent"
						:selected-element="selectedElement"
						:services-list="SERVICES"
						:groomers-list="GROOMERS"
						:clients-list="CLIENTS"
						@setEvent="setEvent"
						@saveEvent="saveEvent"
						@onRemoveEvent="removeEvent"
						@toCreateOrder="toCreateOrder"
					/>
					<!-- @onClose="getEvents" -->
				</v-sheet>
			</v-col>
		</v-row>
		<GCreateEventModalForm
			:is-avtive="isModalFromShow"
			:current-date="currentDate"
			:current-time="currentTime"
			:services-list="SERVICES"
			:groomers-list="GROOMERS"
			:clients-list="CLIENTS"
			@onModalClose="isModalFromShow = false"
			@onSubmitEvent="createEvent"
		/>
	</div>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { GCreateEventModalForm, GCalendarEventMenu } from '@/components';
import { EventColorType } from '@/models/vutify';
import { convertTimestampToLocalDateTime, getDeffData } from '@/utils';
import './styles.scss';

const createMasterCategory = (master: any) => {
	if (!master) {
		return 'Любой мастер';
	}

	const { username, lastname, id } = master;

	return `#${id} ${username} ${lastname}`;
};

export default {
	name: 'GCalendar',
	components: { GCreateEventModalForm, GCalendarEventMenu },
	data: (): any => ({
		isModalFromShow: false,
		currentDate: '',
		currentTime: '',
		focus: '',
		type: 'month',
		typeToLabel: {
			month: 'Месяц',
			week: 'Неделя',
			day: 'День',
			'4day': '4 Дня',
		},
		selectedEvent: {},
		selectedElement: null,
		dragEvent: null,
		dragStart: null,
		currentEvent: null,
		createStart: null,
		extendOriginal: null,
		selectedOpen: false,
		// events: [],
		currentGroomerId: null,
		// chachedDates: {},
	}),
	computed: {
		...mapGetters(['SERVICES', 'GROOMERS', 'EVENTS', 'CLIENTS']),
		categories() {
			return this.GROOMERS.map(createMasterCategory);
		},
		grummersList() {
			const list = this.GROOMERS.map(
				({ id, username, lastname }: any) => ({
					text: `${username} ${lastname}`,
					value: id,
				}),
			);
			return [{ text: 'Все грумеры', value: null }, ...list];
		},
		events() {
			if (this.currentGroomerId) {
				const id = this.currentGroomerId
				const currentEvents = id
					? Object.values(this.EVENTS).filter(({ master }: any) => {
							return master?.id === id;
					})
					: Object.values(this.EVENTS);

				return eventsFormatter(currentEvents as any[]);
			}
			
			return eventsFormatter(Object.values(this.EVENTS));
		}
	},
	mounted() {
	},
	methods: {
		...mapActions([
			'GET_EVENTS',
			'CREATE_EVENT',
			'UPDATE_EVENT',
			'REMOVE_EVENT',
		]),
		...mapMutations(['SHOW_ORDER_FORM']),
		async getEvents(isForce = false) {
			const { year: startYear, month: startMonth } =
				this.$refs.calendar.lastStart;
			const { year: endYear, month: endMonth } =
				this.$refs.calendar.lastEnd;

			await this.GET_EVENTS(
				{
					dates: {
						startYear,
						startMonth,
						endYear,
						endMonth,
					},
					isForce,
				},
			);
		},
		checkChange() {
			this.$refs.calendar.checkChange();
		},
		createOrder() {
			this.SHOW_ORDER_FORM();
		},
		async createEvent(formData: Object) {
			await this.CREATE_EVENT(formData);
			this.isModalFromShow = false;
		},
		toggleWeek({ date }: any) {
			this.focus = date;
			this.type = this.type === 'week' ? 'month' : 'week';
		},
		showCreateEventForm({ date, time }: any) {
			if (this.currentEvent) {
				return;
			}
			this.currentTime = time;
			this.currentDate = date;
			this.isModalFromShow = true;
		},
		getEventColor({ color, isSuccess }: any) {
			return isSuccess ? 'grey darken-1' : color;
		},
		setToday() {
			this.focus = '';
		},
		prev() {
			this.$refs.calendar?.prev();
		},
		next() {
			this.$refs.calendar?.next();
		},
		setEvent(data: any) {
			for (let key in data) {
				this.selectedEvent[key] = data[key];
			}
		},
		async saveEvent() {
			if (!this.selectedEvent) return;

			const nativeEvent = this.EVENTS[this.selectedEvent.id]

			if (!nativeEvent) return;

			const {
				start,
				end,
				name,
				timed,
				color,
				services,
				...selectedEventData
			} = this.selectedEvent;

			const currentSelectedEvent = {
				...selectedEventData,
				title: name,
				startDate: convertTimestampToLocalDateTime(start),
				endDate: convertTimestampToLocalDateTime(end),
				services: JSON.parse(JSON.stringify(services)),
			};

			const diffEventData = getDeffData(
				nativeEvent,
				currentSelectedEvent,
			);

			if (Object.keys(diffEventData).length) {
				await this.UPDATE_EVENT({
					id: this.selectedEvent.id,
					data: diffEventData,
				});

			}
		},
		async updateEventDates(event: any) {
			if (!event) return;

			const currentData = {
				startDate: convertTimestampToLocalDateTime(event.start),
				endDate: convertTimestampToLocalDateTime(event.end),
			};

			await this.UPDATE_EVENT({ id: event.id, data: currentData });
		},
		async removeEvent(id: any) {
			await this.REMOVE_EVENT(id);
			this.closeEvent();
		},
		showEvent({ nativeEvent, event }: any) {
			if (this.currentEvent) {
				return;
			}

			const open = () => {
				this.selectedEvent = event;
				this.selectedElement = nativeEvent.target;
				requestAnimationFrame(() =>
					requestAnimationFrame(() => {
						this.selectedOpen = true;
						this.selectedEvent = event;
					}),
				);
			};

			if (this.selectedOpen) {
				this.closeEvent();
			} else {
				const delay = this.dragEvent ? 200 : 0;
				setTimeout(open, delay);
			}

			nativeEvent.stopPropagation();
		},
		closeEvent() {
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					this.selectedOpen = false;
					this.selectedEvent = null;
				}),
			);
		},
		startDrag({ event, timed }: any) {
			if (event.isSuccess) return;

			this.dragEvent = event;
			this.dragTime = null;
			this.extendOriginal = null;
		},
		extendBottom(event: any) {
			if (event.isSuccess) return;

			this.currentEvent = event;
			this.createStart = event.start;
			this.extendOriginal = event.end;
		},
		startTime(tms: any) {
			const mouse = this.toTime(tms);

			if (this.dragEvent && this.dragTime === null) {
				const start = this.dragEvent.start;

				this.dragTime = mouse - start;
			}
		},
		mouseMove(tms: any) {
			const mouse = this.toTime(tms);

			if (this.dragEvent && this.dragTime !== null) {
				const start = this.dragEvent.start;
				const end = this.dragEvent.end;
				const duration = end - start;
				const newStartTime = mouse - this.dragTime;
				const newStart = this.roundTime(newStartTime);
				const newEnd = newStart + duration;

				this.dragEvent.start = newStart;
				this.dragEvent.end = newEnd;
			} else if (this.currentEvent && this.createStart !== null) {
				const mouseRounded = this.roundTime(mouse, false);
				const min = Math.min(mouseRounded, this.createStart);
				const max = Math.max(mouseRounded, this.createStart);

				this.currentEvent.start = min;
				this.currentEvent.end = max;
			}
		},
		async endDrag() {
			if (this.currentEvent || this.dragEvent) {
				await this.updateEventDates(
					this.currentEvent || this.dragEvent,
				);
			}

			this.currentEvent = null;
			this.createStart = null;
			this.extendOriginal = null;
			this.dragTime = null;
			this.dragEvent = null;
		},
		cancelDrag() {
			if (this.currentEvent) {
				this.currentEvent.end = this.extendOriginal;
			}
			this.endDrag();
		},
		roundTime(time: any, down = true) {
			const roundTo = 15; // minutes
			const roundDownTime = roundTo * 60 * 1000;

			return down
				? time - (time % roundDownTime)
				: time + (roundDownTime - (time % roundDownTime));
		},
		toTime(tms: any) {
			return new Date(
				tms.year,
				tms.month - 1,
				tms.day,
				tms.hour,
				tms.minute,
			).getTime();
		},
		toCreateOrder(data: any) {
			this.selectedOpen = false;
			console.log('data', JSON.stringify(data))
			data && this.SHOW_ORDER_FORM(data);
		},
	},
};

const eventsFormatter = (events: Object[]): Object[] => {
	return events.map(
		({ title, startDate, endDate, master, ...eventProps }: any) => {
			return {
				...eventProps,
				master,
				name: title,
				start: new Date(startDate).getTime(),
				end: new Date(endDate).getTime(),
				color: master?.color || '#FFC11C',
				timed: true,
				category: createMasterCategory(master),
			};
		},
	);
};
</script>

<style lang="scss">
.g-calendar {
	.v-event-draggable {
		padding-left: 6px;
	}

	.v-event-timed {
		user-select: none;
		-webkit-user-select: none;
	}

	.v-event-drag-bottom {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 4px;
		height: 4px;
		cursor: ns-resize;

		&::after {
			display: none;
			position: absolute;
			left: 50%;
			height: 4px;
			border-top: 1px solid white;
			border-bottom: 1px solid white;
			width: 16px;
			margin-left: -8px;
			opacity: 0.8;
			content: '';
		}

		&:hover::after {
			display: block;
		}
	}

	.v-toolbar__content {
		padding-right: 0;
		padding-left: 0;
	}

	.v-event-timed {
		overflow: hidden;
		overflow-y: scroll;
	}

	&__groomers-filter {
		max-width: 200px;
	}

	.h-40 {
		height: 40px !important;
	}
}
</style>
