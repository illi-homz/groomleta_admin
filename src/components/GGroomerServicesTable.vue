<template>
	<div class="d-flex flex-column">
		<v-data-table
			class="g-groomer-orders-table flex-grow-1"
			:items-per-page="10"
			:headers="headers"
			:items="servicesList"
			no-data-text="Ничего найти не получилось"
			no-results-text="Ничего найти не получилось"
			loading-text="Загрузка"
			checkbox-color="#FFC11C"
			:footer-props="{
				itemsPerPageText: 'Заказов на странице',
				itemsPerPageAllText: 'Все',
				showCurrentPage: true,
				showFirstLastPage: false,
				pageText: `${currentPage} из ${pageCount}`,
			}"
			hide-default-footer
			@pagination="setCurrentPage"
		>
			<template v-slot:item="{ item }">
				<tr class="pointer">
					<td class="py-2">
						{{ item.date }}
					</td>
					<td class="text-xs-right py-2">
						{{ item.title }}
					</td>
					<td class="text-xs-right py-2 text-center">
						{{ item.count }}
					</td>
					<td class="text-xs-right py-2 text-right">
						{{ item.price }}
					</td>
					<td class="text-xs-right py-2 text-right">
						{{ item.fullPrice }}
					</td>
				</tr>
			</template>
			<template v-slot:foot>
				<tfoot>
					<tr>
						<td class="text-h6 font-weight-black">Итого</td>
						<td></td>
						<td></td>
						<td></td>
						<td class="text-h6 text-right font-weight-black">
							{{ fullPrice }}
						</td>
					</tr>
				</tfoot>
			</template>
			<template v-slot:footer="{ props: { options, pagination } }">
				<div class="v-data-footer__wrapper d-flex align-center pl-2">
					<div class="v-data-footer__info">
						Всего: {{ servicesList.length }}
						{{ declOfNum(servicesList.length, titles) }}
					</div>
					<v-data-footer
						class="flex-grow-1"
						:options="options"
						:pagination="pagination"
						items-per-page-text="Строк на странице:"
						items-per-page-all-text="Все"
						show-current-page
						show-first-last-page
						:page-text="`${currentPage} из ${pageCount}`"
					/>
				</div>
			</template>
		</v-data-table>
		<!-- <h3 class="mb-6">Всего по услугам:</h3>
		<v-divider />
		<v-data-table
			class="g-groomer-orders-table mb-4"
			:items-per-page="100"
			:items="servicesList2"
			no-data-text="Ничего найти не получилось"
			no-results-text="Ничего найти не получилось"
			loading-text="Загрузка"
			hide-default-header
			hide-default-footer
			color="#FFC11C"
		>
			<template v-slot:item="{ item }">
				<tr class="pointer" @click="showDetail(item)">
					<td style="width: 140px" class="py-2">
						{{ item.date }}
					</td>
					<td class="text-xs-right py-2">
						{{ item.title }}
					</td>
					<td
						style="width: 150px"
						class="text-xs-right py-2 text-center"
					>
						{{ item.count }}
					</td>
					<td
						style="width: 150px"
						class="text-xs-right py-2 text-right"
					>
						{{ item.price }}
					</td>
					<td
						style="width: 150px"
						class="text-xs-right py-2 text-right"
					>
						{{ item.fullPrice }}
					</td>
				</tr>
			</template>
		</v-data-table> -->
	</div>
</template>

<script>
import { declOfNum } from '@/services';
import { parsePrice } from '@/services';

export default {
	name: 'GDetailPageOrdersTable',
	props: {
		orders: {
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		headers: [
			{ text: 'Дата', value: 'date', width: 140 },
			{ text: 'Услуга', value: 'title' },
			{
				text: 'Колличество',
				value: 'count',
				width: 150,
				align: 'center',
			},
			{ text: 'Стоимость, ₽', value: 'price', width: 150 },
			{ text: 'Всего, ₽', value: 'fullPrice', width: 150 },
		],
		currentPage: 0,
		pageCount: 0,
		titles: ['услуга', 'услуги', 'услуг'],
	}),
	computed: {
		servicesList() {
			return this.orders.reduce((mainAcc, { services, updateDate }) => {
				const newAcc = [...mainAcc];

				services?.forEach(({ count, service }) => {
					newAcc.push({
						date: new Date(updateDate).toLocaleDateString(),
						title: service.title,
						count,
						price: service.price,
						fullPrice: count * +parsePrice(service.price),
					});
				});

				return newAcc;
			}, []);
		},
		servicesList2() {
			const listObj = this.orders.reduce(
				(mainAcc, { services, updateDate }) => {
					const newAcc = { ...mainAcc };

					services?.forEach(
						({ count, service: { id, title, price } }) => {
							if (!newAcc[id]) {
								newAcc[id] = {
									date: new Date(
										updateDate,
									).toLocaleDateString(),
									title,
									count,
									price,
									fullPrice: count * +price,
								};

								return;
							}

							const { count: accCount } = newAcc[id];

							const currentCount = newAcc[id].count + accCount;

							newAcc[id] = {
								...newAcc[id],
								count: currentCount,
								fullPrice: currentCount * +parsePrice(price),
								date: new Date(updateDate).toLocaleDateString(),
							};
						},
					);

					return newAcc;
				},
				{},
			);

			return Object.values(listObj);
		},
		fullPrice() {
			return this.servicesList.reduce(
				(acc, el) => (acc += el.fullPrice),
				0,
			);
		},
	},
	mounted() {},
	methods: {
		declOfNum,
		parsePrice,
		setCurrentPage({ page, pageCount }) {
			this.currentPage = page;
			this.pageCount = pageCount;
		},
	},
};
</script>

<style lang="scss">
.g-groomer-orders-table {
	& .v-data-table-header {
		background-color: #f5f5f5;

		& th {
			border-bottom-width: 0 !important;
		}
	}
}
</style>
