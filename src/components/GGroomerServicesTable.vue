<template>
	<v-data-table
		class="g-groomer-services-table"
		:items-per-page="10"
		:headers="headers"
		:items="servicesList"
		no-data-text="Ничего найти не получилось"
		no-results-text="Ничего найти не получилось"
		loading-text="Загрузка"
		:footer-props="{
			itemsPerPageText: 'Заказов на странице',
			itemsPerPageAllText: 'Все',
			showCurrentPage: true,
			showFirstLastPage: true,
			pageText: `${currentPage} из ${pageCount}`,
		}"
		@pagination="setCurrentPage"
	>
		<template v-slot:item="{ item }">
			<tr class="pointer" @click="showDetail(item)">
				<td class="py-2">
					{{ item.date }}
				</td>
				<td class="text-xs-right py-2">
					{{ item.title }}
				</td>
				<td class="text-xs-right py-2">
					{{ item.comment }}
				</td>
				<td class="text-xs-right py-2">
					{{ item.price }}
				</td>
			</tr>
		</template>
	</v-data-table>
</template>

<script>
export default {
	name: 'GGroomerServicesTable',
	props: {
		events: {
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		headers: [
			{ text: 'Дата', value: 'date' },
			{ text: 'Услуга', value: 'title' },
			{ text: 'Комментарий клиента', value: 'comment' },
			{ text: 'Стоимость, ₽', value: 'price' },
		],
		currentPage: 0,
		pageCount: 0,
	}),
	computed: {
		servicesList() {
			return this.events.reduce(
				(acc, { services, startDate, comment }) => {
					const newAcc = [...acc];

					services.forEach(({ title, price }) => {
						newAcc.push({
							date: new Date(startDate).toLocaleDateString(),
							title: title,
							comment,
							price,
						});
					});

					return newAcc
				},
				[],
			);
		},
	},
	mounted() {
		console.log('events', this.events);
	},
	methods: {
		setCurrentPage({ page, pageCount }) {
			this.currentPage = page;
			this.pageCount = pageCount;
		},
	},
};
</script>

<style lang="scss">
.g-groomer-services-table {
	&.v-data-table {
		display: flex;
		flex-direction: column;

		.v-data-table__wrapper {
			flex: 1;
		}
	}
}
</style>
