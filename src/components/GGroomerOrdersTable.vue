<template>
	<v-data-table
		class="g-groomer-services-table"
		:items-per-page="10"
		:headers="headers"
		:items="ordersList"
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
					{{ item.services }}
				</td>
				<td class="text-xs-right py-2">
					{{ item.products }}
				</td>
				<td class="text-xs-right py-2 text-center">
					<span
						class="g-groomer-services-table__status"
						:class="`color-${item.status}`"
					>
						{{ statuses[item.status] }}
					</span>
				</td>
				<td class="text-xs-right py-2 text-right">
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
		orders: {
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		headers: [
			{ text: 'Дата', value: 'date', width: 140 },
			{ text: 'Услуги', value: 'services' },
			{ text: 'Продукты', value: 'products' },
			{ text: 'Статус', value: 'status', width: 200, align: 'center' },
			{ text: 'Стоимость, ₽', value: 'price', width: 200 },
		],
		currentPage: 0,
		pageCount: 0,
		statuses: {
			success: 'Выполнен',
			cancel: 'Отменен',
			reserved: 'Забронирован',
		},
	}),
	computed: {
		servicesList() {
			return this.orders.reduce((mainAcc, { services, updateDate }) => {
				const newAcc = [...mainAcc];

				services?.forEach(({ count, service }) => {
					// const newAcc = [...acc];
					newAcc.push({
						date: new Date(updateDate).toLocaleDateString(),
						title: service.title,
						count,
						price: service.price,
						fullPrice: count * +service.price,
					});
				});

				return newAcc;
			}, []);
		},
		ordersList() {
			return this.orders.reduce(
				(
					acc,
					{
						updateDate,
						services,
						products,
						price,
						isSuccess,
						isCancel,
						isReserved,
					},
				) => {
					const servicesStr = services
						.map(({ service }) => service.title)
						.join(', ');
					const productsStr = products
						.map(({ product }) => product.title)
						.join(', ');

					let status = 'any';

					if (isCancel) status = 'cancel';
					if (isReserved && !isCancel) status = 'reserved';
					if (isSuccess && !isCancel) status = 'success';

					return [
						...acc,
						{
							date: new Date(updateDate).toLocaleDateString(),
							services: servicesStr,
							products: productsStr,
							status,
							price,
						},
					];
				},
				[],
			);
		},
	},
	mounted() {},
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

	&__status {
		&.color-success {
			color: #72c565;
		}
		&.color-cancel {
			color: #ff5252;
		}
		&.color-reserved {
			color: rgba(36, 49, 56, 0.38);
		}
	}
}
</style>
