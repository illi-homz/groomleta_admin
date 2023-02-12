<template>
	<v-dialog
		content-class="g-create-client-modal-form"
		:value="isAvtive"
		max-width="40%"
		@click:outside="closeModal"
		@keydown="onKeyDown"
	>
		<v-card class="pt-4">
			<v-card-title class="px-8 mb-4 d-block">
				<span class="text-h4">Создание клиента</span>
			</v-card-title>
			<v-card-text class="px-5">
				<v-container>
					<v-row>
						<v-col class="py-0">
							<v-text-field
								v-model="username"
								class="text-h5"
								label="Имя*"
								color="#FFC11C"
								light
								:rules="[v => !!v || 'Укажите имя']"
							/>
						</v-col>
						<v-col class="py-0">
							<v-text-field
								v-model="lastname"
								class="text-h5"
								label="Фамилия"
								color="#FFC11C"
								light
							/>
						</v-col>
					</v-row>
					<v-row class="mb-4">
						<v-col class="py-0">
							<v-text-field
								:value="phone"
								class="text-h5"
								label="Телефон"
								color="#FFC11C"
								light
								@input="v => (phone = onPhoneInput(v))"
							/>
						</v-col>
						<v-col class="py-0">
							<v-text-field
								v-model="animal"
								class="text-h5"
								label="Питомец"
								color="#FFC11C"
								light
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
								background-color="#f9f9f9"
								rows="6"
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
import { onPhoneInput } from '@/utils/phoneMask';

const defaultData: any = {
	username: '',
	lastname: '',
	phone: '',
	comment: '',
	animal: '',
};

export default {
	name: 'GCreateClientModalForm',
	props: {
		isAvtive: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		...defaultData,
	}),
	computed: {
		isFormValid() {
			return !!this.username;
		},
		form() {
			return {
				username: this.username.trim(),
				lastname: this.lastname.trim(),
				phone: this.phone.trim(),
				comment: this.comment.trim(),
				animal: this.animal.trim(),
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
			if (!this.isFormValid) return;

			this.$emit('onSubmitEvent', this.form);
			this.closeModal();
		},
		onKeyDown({ keyCode }: { keyCode: number }) {
			// on Escape press
			if (keyCode === 27) {
				this.closeModal();
			}
		},
	},
};
</script>
