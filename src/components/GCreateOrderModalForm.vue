<template>
	<v-dialog
		content-class="g-create-order-modal-form"
		:value="IS_CREATE_ORDER_SHOW"
		max-width="50%"
		@click:outside="closeModal"
		@keydown="onKeyDown"
	>
		<v-card class="pt-4">
			<v-card-title class="px-8 d-block">
				<span class="text-h4">Оформление заказа</span>
				<v-divider class="mt-4" />
			</v-card-title>
			<v-card-text class="px-5">
				<v-container>
					<v-row>
						<v-col>
							<v-autocomplete
								:value="search"
								:items="[...servicesList, ...productsList]"
								color="#FFC11C"
								prepend-inner-icon="mdi-magnify"
								item-color="#FFC11C"
								:no-data-text="'Ничего не найдено'"
								placeholder="Поиск товара или услуги"
								hide-details
								outlined
								dense
								background-color="#FFF"
								clearable
								@change="setBasket"
							/>
						</v-col>
						<v-col>
							<v-autocomplete
								v-model="masterId"
								:items="
									GROOMERS.map(el => ({
										text: `${el.username} ${el.lastname}`,
										value: el.id,
									}))
								"
								color="#FFC11C"
								prepend-inner-icon="mdi-magnify"
								item-color="#FFC11C"
								:no-data-text="'Ничего не найдено'"
								placeholder="Мастер"
								hide-details
								outlined
								dense
								background-color="#FFF"
								clearable
							/>
						</v-col>
						<v-col>
							<v-autocomplete
								v-model="clientId"
								:items="
									CLIENTS.map(el => ({
										text: `${el.username} ${el.lastname}`,
										value: el.id,
									}))
								"
								color="#FFC11C"
								prepend-inner-icon="mdi-magnify"
								item-color="#FFC11C"
								:no-data-text="'Ничего не найдено'"
								placeholder="Клиент"
								hide-details
								outlined
								dense
								background-color="#FFF"
								clearable
							/>
						</v-col>
						<v-col cols="2">
							<v-btn text @click="clearAll"> Удалить все </v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-data-table
								:headers="headers"
								:items="orderItems"
								no-data-text="Ничего не выбрано"
								no-results-text="Ничего не выбрано"
								loading-text="Загрузка"
								hide-default-footer
							>
								<template
									v-slot:item="{ item: { count, id, type } }"
								>
									<tr>
										<td class="g-stock__td py-2">
											<span v-if="type === 'product'">
												{{ productsObj[id].title }}
											</span>
											<span v-if="type === 'service'">
												{{ servicesObj[id].title }}
											</span>
										</td>
										<td
											class="g-stock__td text-center py-2"
										>
											<v-icon
												@click="decrement({ id, type })"
											>
												mdi-minus
											</v-icon>
											<span class="mx-2">{{
												count
											}}</span>
											<v-icon
												@click="increment({ id, type })"
											>
												mdi-plus
											</v-icon>
										</td>
										<td class="g-stock__td text-right py-2">
											<span v-if="type === 'product'">
												{{ productsObj[id].price }}
											</span>
											<span v-if="type === 'service'">
												{{ servicesObj[id].price }}
											</span>
										</td>
										<td class="g-stock__td text-right py-2">
											<span v-if="type === 'product'">
												{{
													productsObj[id].price *
													count
												}}
											</span>
											<span v-if="type === 'service'">
												{{
													servicesObj[id].price *
													count
												}}
											</span>
										</td>
									</tr>
								</template>
							</v-data-table>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions class="pb-8 px-8">
				<v-spacer />
				<div class="mr-5">
					<b class="mr-2">Итого:</b>
					<b>{{ finalPrice }}</b>
				</div>
				<v-btn
					tile
					class="px-6"
					:disabled="!isFormValid"
					outlined
					@click="createOrder(true)"
				>
					Оплатить
				</v-btn>
				<v-btn
					color="#FFC11C"
					:dark="isFormValid"
					:disabled="!isFormValid"
					tile
					elevation="0"
					class="px-6 ml-4"
					@click="createOrder(false)"
				>
					Заказать
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

const defaultData = {
	orderItems: [],
	clientId: '',
	masterId: '',
	eventId: '',
	search: '',
};

export default {
	name: 'GCreateOrderModalForm',
	data: () => ({
		orderItems: [],
		clientId: '',
		masterId: '',
		eventId: '',
		search: '',
		headers: [
			{ text: 'Название', value: 'title' },
			{ text: 'Количество', value: 'count', width: 130 },
			{ text: 'Сумма ₽, шт', value: 'price', width: 130 },
			{ text: 'Всего ₽', value: 'finalPrice', width: 130 },
		],
		keys: {
			product: 'productId',
			service: 'serviceId',
		},
	}),
	computed: {
		...mapGetters([
			'EVENTS',
			'CLIENTS',
			'GROOMERS',
			'SERVICES',
			'PRODUCTS',
			'IS_CREATE_ORDER_SHOW',
			'DEFAULT_ORDER_DATA',
		]),
		servicesList() {
			return this.SERVICES.map(el => ({
				text: `${el.breed.title} - ${el.title}`,
				value: { id: el.id, type: 'service' },
			}));
		},
		productsList() {
			return this.PRODUCTS.map(el => ({
				text: el.title,
				value: { id: el.id, type: 'product' },
			}));
		},
		servicesObj() {
			return this.SERVICES.reduce(
				(acc, el) => ({ ...acc, [el.id]: el }),
				{},
			);
		},
		productsObj() {
			return this.PRODUCTS.reduce(
				(acc, el) => ({ ...acc, [el.id]: el }),
				{},
			);
		},
		isFormValid() {
			return !!this.orderItems.length;
		},
		currentObj() {
			return {
				service: this.servicesObj,
				product: this.productsObj,
			};
		},
		finalPrice() {
			return this.orderItems.reduce((acc, { id, type, count }) => {
				return acc + this.currentObj[type][id].price * count;
			}, 0);
		},
		form() {
			const { service: services, product: products } =
				this.orderItems.reduce(
					(acc, { id, type, count }) => {
						const currentKey = this.keys[type];

						return {
							...acc,
							[type]: [
								...acc[type],
								{
									[currentKey]: id,
									count,
								},
							],
						};
					},
					{
						service: [],
						product: [],
					},
				);

			return {
				services,
				products,
				price: this.finalPrice,
			};
		},
	},
	watch: {
		IS_CREATE_ORDER_SHOW(v) {
			if (!v) {
				this.clearFrom();
			}
		},
		DEFAULT_ORDER_DATA(defaultData) {
			if (!defaultData) return;

			for (let param in defaultData) {
				this[param] = defaultData[param];
			}
		},
	},
	methods: {
		...mapActions(['CREATE_ORDER']),
		...mapMutations(['CLOSE_ORDER_FORM']),
		closeModal() {
			// this.clearFrom();
			// this.$emit('onModalClose');
			this.CLOSE_ORDER_FORM();
		},
		submitForm() {
			if (!this.isFormValid) return;

			this.$emit('onSubmitEvent', this.form);
			this.closeModal();
		},
		// },
		clearFrom() {
			Object.keys(defaultData).forEach(key => {
				this[key] = defaultData[key];
			});
		},
		onKeyDown({ keyCode }) {
			// on Escape press
			if (keyCode === 27) {
				this.closeModal();
			}
		},
		setBasket({ id, type }) {
			try {
				if (!id || !type) throw false;

				this.search = '-';
				const idx = this.orderItems.findIndex(
					el => el.id === id && el.type === type,
				);

				if (type === 'service') {
					if (idx !== -1) throw false;
					this.orderItems.push({ type: 'service', id, count: 1 });
				}

				if (type === 'product') {
					if (idx !== -1) throw false;
					this.orderItems.push({ type: 'product', id, count: 1 });
				}

				throw false;
			} catch (e) {
				setTimeout(() => (this.search = ''), 0);
			}
		},
		async createOrder(isSuccess = false) {
			const { data } = await this.CREATE_ORDER({
				...this.form,
				clientId: this.clientId,
				masterId: this.masterId,
				isSuccess,
				isReserved: isSuccess ? false : true,
			});
			console.log('data', data);
		},
		increment({ id, type }) {
			const idx = this.orderItems.findIndex(
				el => el.id === id && el.type === type,
			);
			this.orderItems[idx].count++;
		},
		decrement({ id, type }) {
			const idx = this.orderItems.findIndex(
				el => el.id === id && el.type === type,
			);

			if (this.orderItems[idx].count === 1) {
				if (confirm('Удалить?')) {
					this.orderItems = this.orderItems.filter(
						(_, i) => i !== idx,
					);

					return;
				}
			}

			this.orderItems[idx].count--;
		},
		clearAll() {
			if (confirm('Удалить карзину?')) {
				this.orderItems = [];
			}
		},
	},
};
</script>

<style lang="scss">
.g-create-order-modal-form {
	td {
		vertical-align: middle;
		border: 1px solid rgba(36, 49, 56, 0.2);
		border-top-color: transparent;
	}
}
</style>
