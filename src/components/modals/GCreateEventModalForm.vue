<template>
	<v-dialog
		content-class="g-create-event-modal-form"
		:value="isAvtive"
		max-width="30%"
		@click:outside="closeModal"
		@keydown="onKeyDown"
	>
		<v-card class="pt-4 g-create-event-modal-form__card">
			<v-btn
				class="g-create-event-modal-form__close-btn"
				icon
				@click="closeModal"
			>
				<v-icon color="#243138">mdi-close</v-icon>
			</v-btn>
			<v-card-title class="px-8 d-block">
				<v-text-field
					v-model="title"
					class="text-h5"
					label="Заголовок*"
					color="#FFC11C"
					light
					:rules="[v => !!v || 'Укажите название записи']"
				/>
			</v-card-title>
			<v-card-text class="px-5">
				<v-container>
					<v-row class="mb-4">
						<v-col class="d-flex align-end py-0">
							<div class="flex-grow-1 mr-4">
								<div class="caption">Время</div>
								<div class="mb-1" @click="toggleTimepiker">
									<span
										ref="timepickerText"
										class="body-1"
										style="cursor: pointer"
									>
										{{ time }}
									</span>
								</div>
								<v-divider />
							</div>
							<v-icon
								ref="timepickerIcon"
								color="#243138"
								@click="toggleTimepiker"
							>
								mdi-clock-outline
							</v-icon>
							<v-menu
								v-model="isTimepikerOpen"
								:activator="$refs.timepickerText"
								:close-on-content-click="false"
								offset-x
								offset-y
							>
								<v-time-picker
									v-model="time"
									color="#FFC11C"
									format="24hr"
								>
									<!-- <v-btn
										elevation="0"
										@click="cencelTimepicker"
										>Отмена</v-btn
									>
									<v-spacer />
									<v-btn
										color="#FFC11C"
										tile
										dark
										elevation="0"
										@click="toggleTimepiker"
										>Ок</v-btn
									> -->
								</v-time-picker>
							</v-menu>
						</v-col>
					</v-row>
					<v-row class="mb-4">
						<v-col class="py-0">
							<v-autocomplete
								v-model="servicePickerValue"
								:items="
									servicesList?.map((el, idx) => {
										return {
											text: `${el.breed?.title || 'любая порода'} - ${el.title}`,
											value: idx,
										};
									})
								"
								color="#FFC11C"
								item-color="#FFC11C"
								:no-data-text="'Ничего не найдено'"
								label="Услуги"
								hide-details
								multiple
								@change="setServices"
							/>
							<div v-if="services.length" class="pt-3">
								<div
									v-for="(serviceKey, idx) in services"
									:key="serviceKey"
									class="px-0 pl-2 d-flex"
									:class="{ 'mt-2': idx === 0, 'mb-4': idx !== (services.length - 1) }"
								>
									<v-img
										:src="require('@/assets/svg/drag-indicatior.svg')"
										:max-height="24"
										:max-width="24"
										class="mr-1"
									/>
									<div class="flex-grow-1">
										{{
											servicesList[serviceKey].breed?.title || 'любая порода'
										}}
										- {{ servicesList[serviceKey].title }}
									</div>
									<v-icon
										color="#243138"
										@click="removeService(idx)"
									>
										mdi-close-circle-outline
									</v-icon>
								</div>
							</div>
						</v-col>
					</v-row>
					<v-row class="mb-4">
						<v-col class="py-0">
							<v-autocomplete
								v-model="groommer"
								:items="
									groomersList?.map((el, idx) => {
										return {
											text: `${el.username} ${el.lastname}`,
											value: el.id,
										};
									})
								"
								color="#FFC11C"
								item-color="#FFC11C"
								:no-data-text="'Такого мастера нету'"
								clearable
								label="Мастер"
								hide-details
							/>
						</v-col>
					</v-row>
					<v-row class="mb-8">
						<v-col class="py-0">
							<v-autocomplete
								v-model="client"
								:items="
									clientsList?.map((el, idx) => {
										return {
											text: `${el.username} ${el.lastname}`,
											value: el.id,
										};
									})
								"
								color="#FFC11C"
								item-color="#FFC11C"
								:no-data-text="'Такого клиента нету'"
								clearable
								label="Клиент"
								hide-details
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-textarea
								v-model="comment"
								label="Комментарий"
								color="#FFC11C"
								no-resize
								outlined
								background-color="#FFC11C08"
							/>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions class="pb-8 px-8">
				<v-spacer />
				<v-btn tile class="px-6" text @click="closeModal">
					Закрыть
				</v-btn>
				<v-btn
					color="#FFC11C"
					:dark="isFormValid"
					:disabled="!isFormValid"
					tile
					elevation="0"
					class="px-6 ml-4"
					@click="submitForm"
				>
					Создать
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { convertTimestampToLocalDateTime } from '@/utils';
// import DragIndicatior from '@/assets/svg/drag-indicatior.svg';

const defaultData: any = {
	time: '09:00',
	services: [],
	servicePickerValue: '',
	groommer: '',
	client: '',
	comment: '',
};

export default {
	name: 'GCreateEventModalForm',
	// components: { DragIndicatior },
	props: {
		isAvtive: {
			type: Boolean,
			default: false,
		},
		currentDate: {
			type: String,
			default: '',
		},
		currentTime: {
			type: String,
			default: '',
		},
		servicesList: {
			type: Array,
			default: () => [],
		},
		groomersList: {
			type: Array,
			default: () => [],
		},
		clientsList: {
			type: Array,
			default: () => [],
		},
	},
	data: (): any => ({
		...defaultData,
		timepicerActivetorElement: null,
		isTimepikerOpen: false,
		title: '',
	}),
	computed: {
		isFormValid() {
			return !!this.title;
		},
		form() {
			const startDate = `${this.currentDate}T${this.time}:00`;
			const startDateTime = new Date(startDate).getTime();
			const endDateTime = new Date(startDateTime + 60 * 60 * 1000);

			const services = this.services.map(
				(idx: number) => this.servicesList[idx].id,
			);

			return {
				title: this.title,
				startDate,
				endDate: convertTimestampToLocalDateTime(endDateTime),
				services,
				client: this.client,
				master: this.groommer,
				comment: this.comment,
			};
		},
	},
	watch: {
		isAvtive(v) {
			if (!v) {
				this.cencelTimepicker();
			}
		},
		currentDate(v) {
			const date = v.split('-').reverse().join('-');
			this.title = `Новая запись на ${date}`;
		},
		currentTime(v) {
			const [hour] = v?.split(':') || [];
			this.time = `${hour || '09'}:00`;
		},
	},
	methods: {
		closeModal() {
			this.clearFrom();
			this.$emit('onModalClose');
		},
		submitForm() {
			if (!this.isFormValid) return;

			this.$emit('onSubmitEvent', this.form);
			this.closeModal();
		},
		setServices(services: any) {
			const currentServices = Array.isArray(services)
				? services
				: [services];
			this.services = currentServices;
		},
		removeService(idx: number) {
			this.services = this.services.filter(
				(_: any, i: number) => i !== idx,
			);
			this.servicePickerValue = this.services;
		},
		toggleTimepiker() {
			this.isTimepikerOpen = !this.isTimepikerOpen;
		},
		cencelTimepicker() {
			this.isTimepikerOpen = false;
			const [hour] = this.currentTime?.split(':') || [];
			this.time = `${hour || '09'}:00`;
		},
		clearFrom() {
			Object.keys(defaultData).forEach((key: string) => {
				this[key] = defaultData[key];
			});
		},
		onKeyDown({ keyCode }: any) {
			// on Escape press
			if (keyCode === 27) {
				this.closeModal();
			}
		},
	},
};
</script>

<style lang="scss">
.g-create-event-modal-form {
	&__card {
		position: relative;
	}

	&__close-btn {
		position: absolute;
		top: 21px;
		right: 21px;
	}
}
</style>
