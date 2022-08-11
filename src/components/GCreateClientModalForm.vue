<template>
	<v-dialog
		content-class="g-create-client-modal-form"
		@click:outside="closeModal"
		@keydown="onKeyDown"
		:value="isAvtive"
		max-width="40%"
	>
		<v-card class="pt-4">
			<v-card-title class="px-8 mb-4 d-block">
				<span class="text-h4">Создание клиента</span>
			</v-card-title>
			<v-card-text class="px-5">
				<v-container>
					<v-row>
						<v-col>
							<v-text-field
								v-model="lastname"
								class="text-h5"
								label="Фамилия"
								color="#FFC11C"
								single-line
								light
								hide-details
							/>
						</v-col>
						<v-col>
							<v-text-field
								v-model="address"
								class="text-h5"
								label="Адрес"
								color="#FFC11C"
								single-line
								light
								hide-details
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-text-field
								v-model="username"
								class="text-h5"
								label="Имя"
								color="#FFC11C"
								single-line
								light
								hide-details
							/>
						</v-col>
						<v-col>
							<v-row>
								<v-col>
									<v-text-field
										v-model="corps"
										class="text-h5"
										label="Корпус"
										color="#FFC11C"
										single-line
										light
										hide-details
									/>
								</v-col>
								<v-col>
									<v-text-field
										v-model="entrance"
										class="text-h5"
										label="Подъезд"
										color="#FFC11C"
										single-line
										light
										hide-details
									/>
								</v-col>
								<v-col>
									<v-text-field
										v-model="room"
										class="text-h5"
										label="Квартира"
										color="#FFC11C"
										single-line
										light
										hide-details
									/>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-text-field
								:value="phone"
								@input="v => phone = onPhoneInput(v)"
								class="text-h5"
								label="Телефон"
								color="#FFC11C"
								single-line
								light
								hide-details
							/>
						</v-col>
						<v-col>
							<v-text-field
								v-model="breed"
								class="text-h5"
								label="Порода питомца"
								color="#FFC11C"
								single-line
								light
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
								rows="6"
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
					:dark="!!username"
					:disabled="!username"
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
import { onPhoneInput } from '@/utils/phoneMask';

const defaultData: any = {
	username: '',
	lastname: '',
	phone: '',
	comment: '',
	address: '',
	corps: '',
	entrance: '',
	room: '',
	breed: '',
};

export default {
	name: 'GCreateClientModalForm',
	data: () => ({
		...defaultData,
	}),
	props: {
		isAvtive: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		isFormValid() {
			return true;
		},
		form() {
			return {
				username: this.username.trim(),
				lastname: this.lastname.trim(),
				phone: this.phone.trim(),
				comment: this.comment.trim(),
				address: this.address.trim(),
			};
		},
	},
	methods: {
		onPhoneInput,
		closeModal() {
			this.clearFrom();
			this.$emit('onModalClose');
		},
		clearFrom() {
			Object.keys(defaultData).forEach(key => {
				this[key] = defaultData[key];
			});
		},
		submitForm() {
			this.$emit('onSubmitEvent', this.form);
			this.closeModal();
		},
		onKeyDown({keyCode}: {keyCode: number}) {
			if (keyCode === 27) { // Escape
				this.closeModal()
			}
		}
	},
};
</script>
