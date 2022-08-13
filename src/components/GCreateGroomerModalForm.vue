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
							<v-select
								:items="posts"
								v-model="post"
								label="Должность"
								color="#FFC11C"
								item-color="warning"
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
						<v-col cols="2" class="py-0 d-flex justify-end">
							<v-menu offset-y :close-on-content-click="false">
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-bind="attrs"
										v-on="on"
										fab
										elevation="0"
										:color="color"
									>
										<v-icon color="white">
											mdi-eyedropper-variant
										</v-icon>
									</v-btn>
								</template>
								<v-color-picker
									v-model="color"
									dot-size="25"
									hide-inputs
									swatches-max-height="200"
								/>
							</v-menu>
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

export default {
	name: 'GCreateGroomerModalForm',
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
		color: '#FFC11C',
		comment: '',
		posts: [
			{ text: 'Главный груммер', value: 'main_groommer' },
			{ text: 'Груммер', value: 'groommer' },
			{ text: 'Помощник груммера', value: 'helper' },
		],
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
				post: this.post.trim(),
				color: this.color.trim(),
				education: this.education.trim(),
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
	},
};

const defaultData: any = {
	username: '',
	lastname: '',
	post: 'groommer',
	phone: '',
	comment: '',
	color: '#FFC11C',
};
</script>
