<template>
	<div class="g-orders">
		<h1>Заказы</h1>
		<v-divider />
		<v-row class="flex-grow-0">
			<v-col class="d-flex justify-space-between">
				<v-text-field
					v-model="searchStr"
					append-icon="mdi-magnify"
					label="Поиск грумера"
					class="flex-grow-0"
					single-line
					hide-details
					color="#FFC11C"
				/>
				<v-btn x-large tile outlined elevation="0" @click="createOrder">
					<v-icon>mdi-plus</v-icon>
					Создать заказ
				</v-btn>
			</v-col>
		</v-row>
		<v-data-table
			class="flex-grow-1"
			:items-per-page="10"
			:headers="headers"
			:items="currentOrders"
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
		</v-data-table>
	</div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

const dateFormatter = date => {
	return new Intl.DateTimeFormat('ru-RU', {
		// year: 'numeric',
		// month: 'long',
		// day: 'numeric',
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(date));
};

export default {
	name: 'GOrders',
	data: () => ({
		searchStr: '',
		headers: [
			{ text: 'Номер заказа', value: 'id' },
			{ text: 'Время заказа', value: 'createDate' },
			{ text: 'Статус заказа', value: 'status' },
			{ text: 'Сумма заказа', value: 'price' },
		],
		orders: [],
		currentPage: 0,
		pageCount: 0,
		statuses: {
			reserved: 'Забронировано',
			success: 'Продано',
			cancel: 'Отменен',
			overdue: 'Просрочен',
		},
	}),
	computed: {
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
	},
	async mounted() {
		const { data } = await this.GET_ALL_ORDERS();
		this.orders = data;
	},
	methods: {
		...mapActions(['GET_ALL_ORDERS']),
		...mapMutations(['SHOW_ORDER_FORM']),
		createOrder() {
			this.SHOW_ORDER_FORM();
		},
		setCurrentPage({ page, pageCount }) {
			this.currentPage = page;
			this.pageCount = pageCount;
		},
		showDetail({ data: order }) {
			console.log('order', order);
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
