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
							@click="createEvent"
						>
							Оформить заказ
						</v-btn>
						<v-menu bottom right>
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
						</v-menu>
					</v-toolbar>
				</v-sheet>
				<v-sheet height="600" class="flex-grow-1">
					<v-calendar
						ref="calendar"
						v-model="focus"
						color="primary"
						:events="events"
						:event-color="getEventColor"
						:type="type"
						locale="ru"
						weekdays="1,2,3,4,5,6,0"
						:locale-first-day-of-year="4"
						@click:event="showEvent"
						@click:more="viewDay"
						@click:date="viewDay"
						@click:day="createEvent"
						@change="updateRange"
					></v-calendar>
					<v-menu
						v-model="selectedOpen"
						:close-on-content-click="false"
						:activator="selectedElement"
						offset-y
					>
						<v-card color="grey lighten-4" min-width="350px" flat>
							<v-toolbar :color="selectedEvent.color" dark>
								<v-btn icon>
									<v-icon>mdi-pencil</v-icon>
								</v-btn>
								<v-toolbar-title
									v-html="selectedEvent.name"
								></v-toolbar-title>
								<v-spacer></v-spacer>
								<v-btn icon>
									<v-icon>mdi-heart</v-icon>
								</v-btn>
								<v-btn icon>
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</v-toolbar>
							<v-card-text>
								<span v-html="selectedEvent.details"></span>
							</v-card-text>
							<v-card-actions>
								<v-btn
									text
									color="secondary"
									@click="selectedOpen = false"
								>
									Cancel
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
			:servicesList="[]"
			@onModalClose="isModalFromShow = false"
		/>
	</div>
</template>

<script lang="ts">
import { GCreateEventModalForm } from '@/components';
import { EventColorType } from '@/models/vutify';
import './styles.scss';

export default {
	name: 'GCalendar',
	components: { GCreateEventModalForm },
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
		selectedOpen: false,
		events: [],
		colors: [
			'blue',
			'indigo',
			'deep-purple',
			'cyan',
			'green',
			'orange',
			'grey darken-1',
		],
		names: [
			'Meeting',
			'Holiday',
			'PTO',
			'Travel',
			'Event',
			'Birthday',
			'Conference',
			'Party',
		],
	}),
	mounted() {
	},
	methods: {
		createOrder() {
			console.log('createOrder');
		},
		viewDay({ date }: any) {
			this.focus = date;
			this.type = 'day';
		},
		createEvent({date}: any) {
			this.currentDate = date
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
			const open = () => {
				this.selectedEvent = event;
				this.selectedElement = nativeEvent.target;
				requestAnimationFrame(() =>
					requestAnimationFrame(() => (this.selectedOpen = true)),
				);
			};

			if (this.selectedOpen) {
				this.selectedOpen = false;
				requestAnimationFrame(() =>
					requestAnimationFrame(() => open()),
				);
			} else {
				open();
			}

			nativeEvent.stopPropagation();
		},
		updateRange({ start, end }: any) {
			const events = [];

			const min = new Date(`${start.date}T00:00:00`);
			const max = new Date(`${end.date}T23:59:59`);
			const days = (max.getTime() - min.getTime()) / 86400000;
			const eventCount = this.rnd(days, days + 20);

			for (let i = 0; i < eventCount; i++) {
				const allDay = this.rnd(0, 3) === 0;
				const firstTimestamp = this.rnd(min.getTime(), max.getTime());
				const first = new Date(
					firstTimestamp - (firstTimestamp % 900000),
				);
				const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
				const second = new Date(first.getTime() + secondTimestamp);

				events.push({
					name: this.names[this.rnd(0, this.names.length - 1)],
					start: first,
					end: second,
					color: this.colors[this.rnd(0, this.colors.length - 1)],
					timed: !allDay,
				});
			}

			this.events = events;
		},
		rnd(a: number, b: number) {
			return Math.floor((b - a + 1) * Math.random()) + a;
		},
	},
};
</script>
