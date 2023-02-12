<template>
	<v-dialog
		content-class="g-detail-order-modal-shield"
		:value="IS_DETAIL_ORDER_SHOW"
		max-width="60%"
		@click:outside="closeModal"
		@keydown="onKeyDown"
	>
		<v-card v-if="order" class="pt-4">
			<v-card-title class="px-8 mb-4 d-block">
				<div class="d-flex">
					<span class="text-h4">
						Заказ - #{{ order.id }} ({{
							new Date(order.updateDate).toLocaleDateString()
						}})
					</span>
					<v-spacer />
					<v-btn icon large @click="closeModal">
						<v-icon large>mdi-close</v-icon>
					</v-btn>
				</div>
				<v-divider />
			</v-card-title>
			<v-card-text class="px-5">
				<v-container>
					<v-row>
						<v-col>
							<v-select
								:value="order.master"
								:items="groomersList"
								disabled
								label="Грумер"
								color="#FFC11C"
								item-color="warning"
							/>
							<!-- @input="v => (order.master = v)" -->
						</v-col>
						<v-col>
							<v-select
								:value="order.client"
								:items="clientsList"
								disabled
								label="Клиент"
								color="#FFC11C"
								item-color="warning"
							/>
							<!-- @input="v => (order.client = v)" -->
						</v-col>
						<v-col></v-col>
					</v-row>
					<v-data-table
						class="g-groomer-services-table"
						:items-per-page="100"
						:headers="headers"
						:items="tableListData"
						no-data-text="Ничего найти не получилось"
						no-results-text="Ничего найти не получилось"
						loading-text="Загрузка"
						color="#FFC11C"
						hide-default-footer
					>
						<template v-slot:item="{ item }">
							<tr class="pointer" @click="showDetail(item.data)">
								<td class="py-2">
									{{ item.title }}
								</td>
								<td class="text-xs-right py-2">
									{{ item.count }}
								</td>
								<td class="text-xs-right py-2">
									{{ item.price }}
								</td>
								<td class="text-xs-right py-2">
									{{ item.fullPrice }}
								</td>
							</tr>
						</template>
					</v-data-table>
				</v-container>
			</v-card-text>
			<v-card-actions class="pb-8 px-8">
				<v-spacer />
				<span class="text-h6 font-weight-bold mr-4">
					Всего: {{ fullPrice }}р
				</span>
				<v-btn
					color="red lighten-1"
					dark
					tile
					outlined
					elevation="0"
					class="px-6 ml-4"
					@click="cancelOrder"
				>
					Отменить
				</v-btn>
				<v-btn
					v-if="isOrderComplete"
					color="#FFC11C"
					tile
					dark
					elevation="0"
					class="px-6 ml-4"
					@click="toNewOrder"
				>
					Повторить
				</v-btn>
				<v-btn
					v-if="isOrderReserved"
					color="green lighten-1"
					dark
					tile
					elevation="0"
					class="px-6 ml-4"
					@click="toUpdateOrder"
				>
					Изменить
				</v-btn>
				<v-btn
					v-if="isOrderReserved"
					color="orange lighten-1"
					dark
					tile
					elevation="0"
					class="px-6 ml-4"
					@click="payForOrder"
				>
					Оплатить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { orderToTableConvertor } from '@/utils/order';
import { parsePrice } from '@/services';

export default {
	name: 'GDetailOrderModalShield',
	data: () => ({
		order: null,
		oldOrder: null,
		headers: [
			{ text: 'Название', value: 'title' },
			{ text: 'Количество', value: 'count', width: 130 },
			{ text: 'Сумма ₽, шт', value: 'price', width: 130 },
			{ text: 'Всего ₽', value: 'fullPrice', width: 130 },
		],
		statuses: {
			success: 'Выполнен',
			cancel: 'Отменен',
			reserved: 'Забронирован',
		},
	}),
	computed: {
		...mapGetters([
			'IS_DETAIL_ORDER_SHOW',
			'DETAIL_ORDER_SHIELD_DATA',
			'GROOMERS',
			'CLIENTS',
		]),
		isOrderComplete() {
			return this.order.isCancel || this.order.isSuccess;
		},
		isOrderReserved() {
			return (
				!this.order.isCancel &&
				!this.order.isSuccess
			);
		},
		groomersList() {
			return this.GROOMERS.map(({ id, username, lastname }) => ({
				text: `${username} ${lastname}`,
				value: id,
			}));
		},
		clientsList() {
			return this.CLIENTS.map(({ id, username, lastname }) => ({
				text: `${username} ${lastname}`,
				value: id,
			}));
		},
		tableListData() {
			const data = [];

			for (let { count, service } of this.order?.services) {
				data.push({
					title: service.title,
					count,
					price: service.price,
					fullPrice: count * +parsePrice(service.price),
					type: 'service',
					data: service,
				});
			}

			for (let { count, product } of this.order?.products) {
				data.push({
					title: product.title,
					count,
					price: product.price,
					fullPrice: count * +parsePrice(product.price),
					type: 'product',
					data: product,
				});
			}

			return data;
		},
		fullPrice() {
			return (
				this.order?.services.reduce(
					(acc, { count, service }) =>
						acc + +parsePrice(service.price) * count,
					0,
				) +
				this.order?.products.reduce(
					(acc, { count, product }) =>
						acc + +parsePrice(product.price) * count,
					0,
				)
			);
		},
	},
	watch: {
		DETAIL_ORDER_SHIELD_DATA(data) {
			if (!data) {
				this.oldOrder = null;
				this.order = null;

				return;
			}

			const { master, client, ...anyData } =
				this.DETAIL_ORDER_SHIELD_DATA;

			const order = {
				...anyData,
				master: master?.id || '',
				client: client?.id || '',
			};

			this.oldOrder = order;
			this.order = JSON.parse(JSON.stringify(order));
		},
	},
	mounted() {},
	methods: {
		...mapMutations(['CLOSE_ORDER_DETAIL_SHIELD', 'SHOW_ORDER_FORM']),
		...mapActions(['PAY_FOR_ORDER', 'CANCEL_ORDER']),
		parsePrice,
		closeModal() {
			this.CLOSE_ORDER_DETAIL_SHIELD();
		},
		onKeyDown({ keyCode }) {
			// on Escape press
			if (keyCode === 27) {
				this.CLOSE_ORDER_DETAIL_SHIELD();
			}
		},
		toNewOrder() {
			const data = orderToTableConvertor(this.order);

			this.SHOW_ORDER_FORM(data);
			this.CLOSE_ORDER_DETAIL_SHIELD();
		},
		async payForOrder() {
			if (!confirm('Оплатить заказ?')) return;

			await this.PAY_FOR_ORDER(this.order.id);
			this.CLOSE_ORDER_DETAIL_SHIELD();
		},
		toUpdateOrder() {
			const data = orderToTableConvertor(this.order);
			data.orderId = this.order.id;

			this.SHOW_ORDER_FORM(data);
			this.CLOSE_ORDER_DETAIL_SHIELD();
		},
		cancelOrder() {
			if (!confirm('Отменить заказ?')) return;

			this.CANCEL_ORDER(this.order.id)
			this.CLOSE_ORDER_DETAIL_SHIELD();
		}
	},
};
</script>

<style lang="scss">
.g-detail-order-modal-shield {
}
</style>
