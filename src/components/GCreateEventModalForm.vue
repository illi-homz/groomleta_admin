<template>
	<v-dialog
		class="g-create-event-modal-form"
		@click:outside="closeModal"
		:value="isAvtive"
		max-width="30%"
	>
		<v-card>
			<v-card-title class="pt-8 px-8 d-block">
				<span class="text-h4">{{ currentTitle }}</span>
			</v-card-title>
			<v-divider class="mx-8" />
			<v-card-text class="px-5">
				<v-container>
					<v-row>
						<v-col>
							<div class="mb-4">
								<div class="caption">Время</div>
								<div class="d-flex mb-1">
									<div class="body-1 flex-grow-1">
										{{ time }}
									</div>
									<v-icon
										color="#FFC11C"
										@click="toggleTimepiker"
										>mdi-clock-outline</v-icon
									>
								</div>
								<v-divider />
							</div>
							<v-menu
								v-model="isTimepikerOpen"
								:close-on-content-click="false"
								:activator="$refs.timepickerField"
								offset-y
							>
								<v-time-picker
									color="#FFC11C"
									format="24hr"
									v-model="time"
								>
									<v-btn
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
									>
								</v-time-picker>
							</v-menu>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-autocomplete
								:items="currentServicesList"
								@change="setServices"
								color="#FFC11C"
								item-color="#FFC11C"
								:no-data-text="'Ничего не найдено'"
								v-model="servicePickerValue"
								placeholder="Услуги"
								hide-details
							/>
							<div class="pt-3">
								<v-list-item
									v-for="(serviceKey, idx) in services"
									:key="serviceKey"
									class="px-0 pl-2"
									:class="{ 'mt-2': idx === 0 }"
									dense
								>
									<v-list-item-content class="py-2">
										<v-list-item-title>{{
											servicesList[serviceKey].title
										}}</v-list-item-title>
									</v-list-item-content>
									<v-icon
										@click="removeService(idx)"
										color="#FFC11C"
										>mdi-close</v-icon
									>
								</v-list-item>
							</div>
						</v-col>
					</v-row>
					<v-row class="mb-4">
						<v-col>
							<v-autocomplete
								:items="currentGroomersList"
								color="#FFC11C"
								item-color="#FFC11C"
								:no-data-text="'Такого мастера нету'"
								v-model="groommer"
								clearable
								placeholder="Мастер"
								hide-details
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-textarea
								v-model="comment"
								label="Комментарий"
								color="#ddd"
								no-resize
								outlined
								background-color="#FFC11C08"
							></v-textarea>
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
					<!-- @click="click" -->
					Создать
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import {convertTimestampToLocalDateTime} from '@/utils'
import { mapGetters } from 'vuex';
// доделать форму, валидацию и сабмит
const defaultData = {
	time: '08:00',
	services: [],
	servicePickerValue: '',
	groommer: '',
	comment: '',
};

export default {
	name: 'GCreateEventModalForm',
	props: {
		isAvtive: {
			type: Boolean,
			default: false,
		},
		currentDate: {
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
	},
	data: (): any => ({
		...defaultData,
		timepicerActivetorElement: null,
		isTimepikerOpen: false,
	}),
	computed: {
		isFormValid() {
			return true;
		},
		currentServicesList(): any {
			return this.servicesList?.map((el: any, idx: number) => {
				return { text: `${el.breed.title} - ${el.title}`, value: idx };
			});
		},
		currentGroomersList(): any {
			return this.groomersList?.map((el: any, idx: number) => {
				return { text: `$${el.username} ${el.lastname}`, value: el.id };
			});
		},
		firstServiceTitle() {
			const idx = this.services[0];
			const title =
				idx !== undefined
					? this.servicesList[idx].title
					: 'Новая запись';
			return title;
		},
		currentTitle(): string {
			const date = this.currentDate.split('-').reverse().join('-');
			return `${this.firstServiceTitle} на ${date}`;
		},
		form() {
			const startDate = `${this.currentDate}T${this.time}:00`;
			const startDateTime = new Date(startDate).getTime();
			const endDateTime = new Date(startDateTime + 60 * 60 * 1000);
			
			const services = this.services.map(
				(idx: number) => this.servicesList[idx].id,
			);

			return {
				title: this.firstServiceTitle,
				startDate,
				// endDate: `${endDate}T${endTime}`,
				endDate: convertTimestampToLocalDateTime(endDateTime),
				services,
				client: '',
				master: this.groommer,
				comment: this.comment,
			};
		},
	},
	methods: {
		click() {
			console.log('services', this.services);
		},
		closeModal() {
			this.clearFrom();
			this.$emit('onModalClose');
		},
		submitForm() {
			this.$emit('onSubmitEvent', this.form);
			this.closeModal();
		},
		setServices(serviceId: number | string) {
			this.services = Array.from(new Set([...this.services, serviceId]));
		},
		removeService(idx: number) {
			this.services = Array.from(this.services).filter(
				(_: any, i: number) => i !== idx,
			);
			this.servicePickerValue = '';
		},
		toggleTimepiker(event: any) {
			console.log('toggleTimepiker');
			this.isTimepikerOpen = !this.isTimepikerOpen;
		},
		cencelTimepicker() {
			this.isTimepikerOpen = false;
			this.time = '08:00';
		},
		clearFrom() {
			Object.keys(defaultData).forEach((key: string) => {
				this[key] = defaultData[key];
			});
		},
	},
};
</script>

<style lang="scss">
.g-create-event-modal-form {
}
</style>
