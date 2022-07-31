<template>
	<v-dialog
		class="g-create-event-modal-form"
		@click:outside="closeModal"
		:value="isAvtive"
		max-width="75%"
	>
		<v-card>
			<v-card-title class="pt-8 px-8 d-block">
				<span class="text-h4">Новая запись {{currentDate}}</span>
			</v-card-title>
			<v-divider class="mx-8" />
			<v-card-text class="px-5">
				<v-container>
					<v-row>
						<v-col cols="12" sm="6" md="4">
							<v-text-field
								label="Legal first name*"
								required
							></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions class="pb-8 px-8">
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

<script>
// доделать форму, валидацию и сабмит

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
		servicesList: { // доделать получение услуг
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		time: '',
		services: [],
		groommer: null
	}),
	computed: {
		isFormValid() {
			return true
		}
	},
	methods: {
		closeModal() {
			this.$emit('onModalClose');
		},
		submitForm() {
			this.closeModal()
		}
	},
};
</script>

<style lang="scss"></style>
