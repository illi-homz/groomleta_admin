<template>
	<v-dialog v-model="dialog" persistent max-width="290">
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				fab
				color="white"
				light
				height="40"
				width="40"
				elevation="0"
				v-bind="attrs"
				v-on="on"
			>
				<v-icon>mdi-trash-can-outline</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-card-title class="text-h5"> Удалить событие? </v-card-title>
			<v-card-text>После удаления данные будут недоступны</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn color="green darken-1" text @click="dialog = false">
					Отмена
				</v-btn>
				<v-btn color="red darken-1" text @click="success">
					Удалить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'GRemoveBtn',
	data: () => ({
		dialog: false,
	}),
	methods: {
		success() {
			this.$emit('onRemoveEvent');
			this.dialog = false;
		},
	},
};
</script>

<style></style>
