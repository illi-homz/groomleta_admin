<template>
	<v-data-table
		class="g-groomer-services-table"
		:items-per-page="itemsPerPage"
		:headers="headers"
		:items="ordersList"
		no-data-text="Ничего найти не получилось"
		no-results-text="Ничего найти не получилось"
		loading-text="Загрузка"
		color="#FFC11C"
		hide-default-footer
		:page="currentPage"
		:sort-by.sync="sortBy"
		:sort-desc.sync="sortDesc"
		:footer-props="{}"
		>
		<!-- @pagination="setCurrentPage" -->
		<template v-slot:item="{ item }">
			<tr class="pointer" @click="showDetail(item.data)">
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
					{{ item.groomer }}
				</td>
				<td class="text-xs-right py-2 text-center">
					{{ item.client }}
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
		<template v-slot:footer>
			<div class="v-data-footer__wrapper d-flex align-center pl-2">
				<div class="v-data-footer__info">
					Всего: {{ itemsLength }}
					{{ declOfNum(itemsLength, titles) }}
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
					@update:options="footerUpdate"
				/>
			</div>
		</template>
	</v-data-table>
</template>

<script>
import { declOfNum } from '@/services';

export default {
	name: 'GGroomerServicesTable',
	props: {
		orders: {
			type: Array,
			default: () => [],
		},
		itemsPerPage: {
			type: Number,
			default: 1,
		},
		currentPage: {
			type: Number,
			default: 1,
		},
		itemsLength: {
			type: Number,
			default: 1,
		},
		pageCount: {
			type: Number,
			default: 1,
		},
	},
	data: () => ({
		headers: [
			{ text: 'Дата', value: 'date', width: 140 },
			{ text: 'Услуги', value: 'services' },
			{ text: 'Продукты', value: 'products' },
			{ text: 'Грумер', value: 'groomer', width: 200, align: 'center' },
			{ text: 'Клиент', value: 'client', width: 200, align: 'center' },
			{ text: 'Статус', value: 'status', width: 200, align: 'center' },
			{ text: 'Стоимость, ₽', value: 'price', width: 130 },
		],
		statuses: {
			success: 'Выполнен',
			cancel: 'Отменен',
			reserved: 'Забронирован',
		},
		titles: ['заказ', 'заказа', 'заказов'],
		sortBy: ['id'],
		sortDesc: true,
	}),
	computed: {
		ordersList() {
			return this.orders.reduce((acc, order) => {
				const {
					updateDate,
					services,
					products,
					price,
					isSuccess,
					isCancel,
					isReserved,
					master,
					client,
				} = order;
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
						groomer: master
							? `${master.username} ${master.lastname}`
							: '-',
						client: client
							? `${client.username} ${client.lastname}`
							: '-',
						data: order,
					},
				];
			}, []);
		},
		pagination() {
			return {
				page: this.currentPage,
				itemsPerPage: this.itemsPerPage,
				pageStart: 0,
				pageStop:
					this.itemsLength - this.currentPage * this.itemsPerPage,
				pageCount: this.pageCount,
				itemsLength: this.itemsLength,
			};
		},
		options() {
			return {
				page: this.currentPage,
				itemsPerPage: this.itemsPerPage,
				sortBy: this.sortBy,
				sortDesc: [this.sortDesc],
				groupBy: [],
				groupDesc: [],
				mustSort: false,
				multiSort: false,
			};
		},
	},
	mounted() {},
	methods: {
		declOfNum,
		setCurrentPage({ page, pageCount }) {
			// this.currentPage = page;
			// this.pageCount = pageCount;
			this.$emit('setCurrentPage', page)
		},
		footerUpdate({ page, itemsPerPage }) {
			// this.currentPage = page;
			// this.itemsPerPage = itemsPerPage;
			this.$emit('setCurrentPage', page)
			this.$emit('setItemsPerPage', itemsPerPage)
			this.$emit('updateData')
		},
		showDetail(item) {
			this.$emit('onLineClick', item);
		},
	},
};
</script>

<style lang="scss">
.g-groomer-services-table {
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
