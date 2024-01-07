<template>
	<div class="g-orders flex-grow-1 d-flex flex-column">
		<h1 class="mb-4">Заказы</h1>
		<v-divider class="mb-5" />
		<v-row class="flex-grow-0 my-0 mb-5">
			<v-col cols="3" class="py-0 d-flex align-end">
				<!-- <v-text-field
					v-model="searchStr"
					prepend-inner-icon="mdi-magnify"
					label="Поиск заказа"
					single-line
					hide-details
					color="#FFC11C"
					filled
					dense
				/> -->
			</v-col>
			<v-col class="d-flex py-0">
				<v-spacer />
				<v-btn x-large tile outlined elevation="0" @click="createOrder">
					<v-icon>mdi-plus</v-icon>
					Оформить заказ
				</v-btn>
			</v-col>
		</v-row>
		<v-data-table
			class="flex-grow-1"
			:items-per-page="itemsPerPage"
			:headers="headers"
			:items="currentOrders"
			no-data-text="Загрузка"
			no-results-text="Ничего найти не получилось"
			loading-text="Загрузка"
			hide-default-footer
			:page="currentPage"
			:sort-by.sync="sortBy"
			:sort-desc.sync="sortDesc"
			:footer-props="{}"
			@update:sort-by="onSortByChange"
			@update:sort-desc="onSortChange"
		>
			<!-- @pagination="setCurrentPage" -->
			<template v-slot:item="{ item }">
				<tr class="pointer" @click="showDetail(item)">
					<td class="py-2">
						{{ item.id }}
					</td>
					<td class="text-xs-right py-2">
						{{ item.createDate }}
					</td>
					<td class="text-xs-right py-2" :class="`is-${item.status}`">
						{{ statuses[item.status] }}
					</td>
					<td class="text-xs-right py-2">
						{{ item.price }}
					</td>
				</tr>
			</template>
			<!-- <template v-slot:footer="{ props: { options } }"> -->
			<template v-slot:footer>
				<div class="v-data-footer__wrapper d-flex align-center pl-2">
					<div class="v-data-footer__info">
						Всего: {{ currentOrders.length }}
						{{ declOfNum(currentOrders.length, titles) }}
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
	</div>
</template>

<script>
import { declOfNum } from '@/services';
import { mapActions, mapMutations, mapGetters } from 'vuex';

const dateFormatter = date => {
	return new Intl.DateTimeFormat('ru-RU', {
		// year: 'numeric',
		// month: 'long',
		// day: 'numeric',
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(date));
};

export default {
	name: 'GOrders',
	data: () => ({
		sortBy: ['id'],
		sortDesc: true,
		searchStr: '',
		headers: [
			{ text: 'Номер заказа', value: 'id' },
			{ text: 'Время заказа', value: 'create_date' },
			{ text: 'Статус заказа', value: 'status' },
			{ text: 'Сумма заказа', value: 'price' },
		],
		orders: [],
		currentPage: 1,
		pageCount: 0,
		itemsPerPage: 15,
		itemsLength: 0,
		statuses: {
			reserved: 'Забронировано',
			success: 'Продано',
			cancel: 'Отменен',
			overdue: 'Просрочен',
		},
		titles: ['заказ', 'заказа', 'заказов'],
	}),
	computed: {
		...mapGetters(['ALL_ORDERS']),
		currentOrders() {
			return this.orders.map(order => {
				let status = 'reserved';

				if (order.isCancel) status = 'cancel';
				else if (order.isSuccess) status = 'success';

				return {
					id: order.id,
					createDate: dateFormatter(order.createDate),
					price: order.price,
					status,
					data: order,
				};
			});
		},
		sort() {
			return this.sortDesc ? 'desc' : 'asc';
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
	// watch: {
	// 	ALL_ORDERS(orders) {
	// 		this.orders = orders || [];
	// 	},
	// },
	mounted() {
		// this.GET_ALL_ORDERS();
		this.updateData();
	},
	methods: {
		...mapActions(['GET_ALL_ORDERS', 'GET_ORDERS']),
		...mapMutations(['SHOW_ORDER_FORM', 'SHOW_ORDER_DETAIL_SHIELD']),
		declOfNum,
		createOrder() {
			this.SHOW_ORDER_FORM();
		},
		setCurrentPage({ page, pageCount }) {
			if (this.currentPage === 0) {
				this.currentPage = page;
				return;
			}
		},
		showDetail({ data: order }) {
			this.SHOW_ORDER_DETAIL_SHIELD(order);
		},
		footerUpdate({ page, itemsPerPage, ...args }) {
			// console.log('footerUpdate itemsPerPage', itemsPerPage);
			this.currentPage = page;
			this.itemsPerPage = itemsPerPage;
			// this.options.page = page;
			this.updateData();
		},
		onSortByChange(sortBy) {
			// this.sortBy = sortBy;
			this.updateData();
		},
		onSortChange(sortDesc) {
			this.sortDesc = sortDesc;
			console.log('onSortChange');
			this.updateData();
		},
		async updateData() {
			const { nodes, nodesSize, pageCount } = await this.GET_ORDERS({
				page: this.currentPage,
				sort: this.sort,
				objectsPerPage: this.itemsPerPage,
			});
			this.pageCount = pageCount;
			this.itemsLength = nodesSize;
			this.orders = nodes || {};
		},
	},
};
</script>

<style lang="scss">
.g-orders {
	td {
		&.is-reserved {
			color: #72c565;
		}
		&.is-success {
			color: rgba(36, 49, 56, 0.38);
		}
		&.is-cancel {
			color: #ff5252;
		}
	}
}
</style>
