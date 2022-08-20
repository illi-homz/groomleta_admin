<template>
	<v-dialog
		content-class="g-create-groomer-modal-form"
		:value="isAvtive"
		max-width="40%"
		@click:outside="closeModal"
		@keydown="onKeyDown"
	>
		<v-card class="pt-4">
			<v-card-title class="px-8 mb-4 d-block">
				<span class="text-h4">Создание нового грумера</span>
			</v-card-title>
			<v-card-text class="px-5">
				<v-container>
					<v-row class="mb-4">
						<v-col class="py-0">
							<v-text-field
								v-model="lastname"
								class="text-h5"
								label="Фамилия"
								color="#FFC11C"
								light
							/>
						</v-col>
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
					</v-row>
					<v-row class="mb-4">
						<v-col class="py-0">
							<v-text-field
								:value="phone"
								class="text-h5"
								label="Телефон"
								color="#FFC11C"
								light
								@input="setPhone"
							/>
						</v-col>
						<v-col class="py-0">
							<v-select
								v-model="post"
								:items="posts"
								label="Должность"
								color="#FFC11C"
								item-color="warning"
							/>
						</v-col>
					</v-row>
					<v-row class="mb-4">
						<v-col class="py-0" cols="10">
							<v-text-field
								v-model="address"
								class="text-h5"
								label="Адрес"
								color="#FFC11C"
								light
							/>
						</v-col>
						<v-col class="py-0">
							<v-text-field
								:value="rate"
								class="text-h5"
								label="Ставка, %"
								color="#FFC11C"
								light
								@input="setRate"
							/>
						</v-col>
					</v-row>
					<v-row class="mb-4">
						<v-col class="py-0">
							<v-text-field
								v-model="education"
								class="text-h5"
								label="Образование"
								color="#FFC11C"
								light
							/>
						</v-col>
						<v-col class="py-0 d-flex justify-end align-center">
							<GColorSelector v-model="color" :data="colors" />
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
								counter="100"
							/>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions class="pb-8 px-8">
				<v-spacer />
				<v-btn tile class="px-6" text outlined @click="closeModal">
					Отменить
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
					Создать грумера
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { onPhoneInput } from '@/utils/phoneMask';
import GColorSelector from './GColorSelector.vue';
import { defaultColors } from '@/variables';

export default {
	name: 'GCreateGroomerModalForm',
	components: { GColorSelector },
	props: {
		isAvtive: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		...defaultData,
		username: '',
		lastname: '',
		phone: '',
		post: 'groommer',
		education: '',
		address: '',
		rate: 0,
		comment: '',
		posts: [
			{ text: 'Главный груммер', value: 'main_groommer' },
			{ text: 'Груммер', value: 'groommer' },
			{ text: 'Помощник груммера', value: 'helper' },
		],
		color: '#FFBE11',
		colors: defaultColors,
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
				post: this.post.toLowerCase(),
				color: this.color.trim(),
				education: this.education.trim(),
				address: this.address.trim(),
				rate: this.rate,
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

			this.$emit('onSubmit', this.form);
			this.closeModal();
		},
		onKeyDown({ keyCode }: { keyCode: number }) {
			// on Escape press
			if (keyCode === 27) {
				this.closeModal();
			}
		},
		setRate(v: string) {
			const value = v.replace(/\D/g, '');

			if (this.rate === +value) {
				this.rate = v;
			}

			setTimeout(() => (this.rate = +value), 0);
		},
		setPhone(v: string) {
			const value = onPhoneInput(v);

			if (this.phone === value) {
				this.phone = v;
			}

			setTimeout(() => (this.phone = value), 0);
		},
	},
};

const defaultData: any = {
	username: '',
	lastname: '',
	post: 'groommer',
	phone: '',
	comment: '',
	color: '#FFC11C',
	rate: 0,
	address: '',
};
</script>

<style lang="scss">
.g-create-groomer-modal-form {
	.v-text-field__details {
		position: absolute;
		bottom: 10px;
		left: 0;
		right: 0px;

		.v-counter {
			color: rgba(36, 49, 56, 0.38);
		}
	}
}
</style>
