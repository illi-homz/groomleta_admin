<template>
	<div class="g-stock-services-table d-flex flex-column">
		<v-row class="flex-grow-0 my-0 mb-5">
			<v-col class="py-0" cols="3">
				<v-text-field
					v-model="searchStr"
					prepend-inner-icon="mdi-magnify"
					label="Поиск услуги"
					single-line
					hide-details
					color="#FFC11C"
					filled
					dense
				/>
			</v-col>
		</v-row>
		<h3>В разработке</h3>
	</div>
</template>

<script>
export default {
	name: 'GStockServicesTable',
	data: () => ({
	}),
	computed: {
	},
	watch: {
	},
	methods: {
	},
};
</script>

<style lang="scss">
.g-stock-services-table {
}
</style>
