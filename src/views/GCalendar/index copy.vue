<template>
	<div class="g-calendar flex-grow-1 d-flex flex-column">
		<h1>Календарь</h1>
		<v-row class="g-calendar__content fill-height flex-grow-1 d-flex">
			<v-col class="flex-column d-flex flex-column">
				<v-sheet height="64">
					<v-toolbar flat>
						<v-btn
							outlined
							class="mr-4"
							color="grey darken-2"
							@click="setToday"
						>
							Сегодня
						</v-btn>
						<v-btn
							fab
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
						<v-spacer></v-spacer>
						<v-btn
							outlined
							class="mr-4"
							color="grey darken-2"
							@click="checkChange"
						>
							Обновить
						</v-btn>
						<v-btn
							outlined
							class="mr-4"
							color="grey darken-2"
							@click="CREATE_EVENT"
						>
							Оформить заказ
						</v-btn>
						<v-btn
							outlined
							class="mr-4"
							color="grey darken-2"
							@click="type = 'month'"
						>
							Месяц
						</v-btn>
						<v-btn
							outlined
							class="mr-4"
							color="grey darken-2"
							@click="type = 'week'"
						>
							Неделя
						</v-btn>
						<!-- <v-menu bottom right>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									outlined
									color="grey darken-2"
									v-bind="attrs"
									v-on="on"
								>
									<span>{{ typeToLabel[type] }}</span>
									<v-icon right> mdi-menu-down </v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="type = 'month'">
									<v-list-item-title>Месяц</v-list-item-title>
								</v-list-item>
								<v-list-item @click="type = 'week'">
									<v-list-item-title
										>Неделя</v-list-item-title
									>
								</v-list-item>
								<v-list-item @click="type = '4day'">
									<v-list-item-title>4 Дня</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu> -->
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
						locale="ru"
						weekdays="1,2,3,4,5,6,0"
						:locale-first-day-of-year="4"
						:event-ripple="false"
						@click:more="viewDay"
						@click:date="viewDay"
						@click:day="createEvent"
						@click:event="showEvent"
						@mousedown:event="startDrag"
						@mousemove:time="mouseMove"
						@mousedown:time="startTime"
						@mouseup:time="endDrag"
						@mouseleave.native="cancelDrag"
						@change="getEvents"
					>
						<template v-slot:event="{ event, timed, eventSummary }">
							<div
								class="v-event-draggable"
								v-html="eventSummary()"
							></div>
							<div
								v-if="timed"
								class="v-event-drag-bottom"
								@mousedown.stop="extendBottom(event)"
							></div>
						</template>
					</v-calendar>
					<v-menu
						v-if="selectedEvent"
						v-model="selectedOpen"
						:close-on-content-click="false"
						:activator="selectedElement"
						offset-y
					>
						<v-card color="grey lighten-4" min-width="350px" flat>
							<v-toolbar :color="selectedEvent.color" dark>
								<!-- <v-toolbar-title>
									{{selectedEvent.name}}
								</v-toolbar-title> -->
								<v-toolbar-title>
									<v-text-field
										label="Название события"
										v-model="selectedEvent.name"
										filled
										dense
										outlined
										color="#FFC11C"
										hide-details
									></v-text-field>
								</v-toolbar-title>
								<v-spacer></v-spacer>
								<v-btn icon>
									<v-icon>mdi-pencil</v-icon>
								</v-btn>
								<v-btn icon @click="closeEvent">
									<v-icon>mdi-close</v-icon>
								</v-btn>
							</v-toolbar>
							<v-card-text>
								<span v-html="selectedEvent.details"></span>
								<div>
									<div class="text-h6">Услуги:</div>
									<v-list-item
										v-for="service in selectedEvent.services"
										:key="service.id"
										dense
									>
										<v-list-item-content class="py-2">
											<v-list-item-title>{{
												service.title
											}}</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
								</div>
								<div v-if="selectedEvent.master">
									<span class="text-h6">Мастер:</span>
									<span class="ml-2">{{
										selectedEvent.master.username
									}}</span>
								</div>
								<div v-if="selectedEvent.client">
									<span class="text-h6">Клиент:</span>
									<span class="ml-2">{{
										selectedEvent.client.username
									}}</span>
								</div>
							</v-card-text>
							<v-card-actions>
								<v-btn
									text
									color="secondary"
									@click="closeEvent"
								>
									Отмена
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-menu>
				</v-sheet>
			</v-col>
		</v-row>
		<GCreateEventModalForm
			:isAvtive="isModalFromShow"
			:currentDate="currentDate"
			:servicesList="SERVICES"
			:groomersList="GROOMERS"
			@onModalClose="isModalFromShow = false"
			@onSubmitEvent="submitEvent"
		/>
	</div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { GCreateEventModalForm, GCalendarEventMenu } from '@/components';
import { EventColorType } from '@/models/vutify';
import './styles.scss';

export default {
	name: 'GCalendar',
	components: { GCreateEventModalForm, GCalendarEventMenu },
	data: (): any => ({
		isModalFromShow: false,
		currentDate: '',
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
		events: [],
	}),
	computed: {
		...mapGetters(['SERVICES', 'GROOMERS', 'EVENTS']),
	},
	mounted() {
		this.GET_SERVICES();
		this.GET_ALL_GROOMERS();
	},
	methods: {
		...mapActions([
			'GET_SERVICES',
			'GET_ALL_GROOMERS',
			'GET_EVENTS',
			'CREATE_EVENT',
			'UPDATE_EVENT',
		]),
		async getEvents() {
			const { data } = await this.GET_EVENTS();
			this.events = eventsFormatter(data);
		},
		createOrder() {
			console.log('createOrder');
		},
		async submitEvent(formData: Object) {
			console.log('formData', formData);
			const { data } = await this.CREATE_EVENT(formData);
			this.isModalFromShow = false;
			this.getEvents();
		},
		viewDay({ date }: any) {
			this.focus = date;
			this.type = 'day';
		},
		createEvent({ date }: any) {
			this.currentDate = date;
			this.isModalFromShow = true;
		},
		getEventColor(event: EventColorType) {
			return event.color;
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
		showEvent({ nativeEvent, event }: any) {
			if (this.currentEvent) {
				return;
			}

			const open = () => {
				this.selectedEvent = event;
				this.selectedElement = nativeEvent.target;
				requestAnimationFrame(() =>
					requestAnimationFrame(() => (this.selectedOpen = true)),
				);
			};

			if (this.selectedOpen) {
				this.closeEvent();
			} else {
				open();
			}

			nativeEvent.stopPropagation();
		},
		closeEvent() {
			this.selectedOpen = false
		},
		startDrag({ event, timed }: any) {
			if (event && timed) {
				this.dragEvent = event;
				this.dragTime = null;
				this.extendOriginal = null;
			}
		},
		extendBottom(event: any) {
			this.currentEvent = event;
			this.createStart = event.start;
			this.extendOriginal = event.end;
		},
		startTime(tms) {
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
				console.log('this.currentEvent', this.currentEvent);
				console.log('this.dragEvent', this.dragEvent);
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
		roundTime(time, down = true) {
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
		checkChange() {
			this.getEvents();
		},
		async updateEventDates(event: any) {
			if (!event) return;

			const { id, ...currentEventData } = this.EVENTS.find(
				(el: any) => el.id === event.id,
			);
			const start = new Date(event.start);
			const startDate = convertDateToLocal(start);
			const startTime = start.toLocaleTimeString().slice(0, 5);
			const end = new Date(event.end);
			const endDate = convertDateToLocal(end);
			const endTime = end.toLocaleTimeString().slice(0, 5);

			const currentData = {
				startDate: `${startDate}T${startTime}`,
				endDate: `${endDate}T${endTime}`,
			};

			await this.UPDATE_EVENT({ id, data: currentData });

			this.getEvents();
		},
	},
};

const eventsFormatter = (events: Object[]): Object[] => {
	return events.map(
		({ id, title, startDate, endDate, master, services, client }: any) => {
			return {
				id,
				name: title,
				start: new Date(startDate).getTime(),
				end: new Date(endDate).getTime(),
				color: master.color,
				timed: true,
				services,
				master,
				client,
			};
		},
	);
};

const convertDateToLocal = (date: Date) => {
	return date.toLocaleDateString().split('.').reverse().join('-');
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
}
</style>
