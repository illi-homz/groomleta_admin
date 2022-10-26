<template>
	<v-dialog
		content-class="g-create-order-modal-form"
		:value="IS_CREATE_ORDER_SHOW"
		max-width="55%"
		@click:outside="closeModal"
		@keydown="onKeyDown"
	>
		<v-card class="pt-4">
			<v-card-title class="px-8 d-block">
				<div class="d-flex">
					<span class="text-h4">Оформление заказа</span>
					<v-spacer />
					<v-btn icon large @click="closeModal">
						<v-icon large>mdi-close</v-icon>
					</v-btn>
				</div>
				<v-divider class="mt-4" />
			</v-card-title>
			<v-card-text class="px-5">
				<v-container>
					<v-row>
						<v-col cols="4">
							<v-autocomplete
								v-model="masterId"
								:items="
									GROOMERS.map(el => ({
										text: `${el.username} ${el.lastname}`,
										value: el.id,
									}))
								"
								color="rgba(36, 49, 56, 0.38)"
								item-color="rgb(36, 49, 56)"
								:no-data-text="'Ничего не найдено'"
								label="Мастер"
								hide-details
								dense
								background-color="#FFF"
								clearable
							/>
						</v-col>
						<v-col cols="4">
							<v-autocomplete
								v-model="clientId"
								:items="
									CLIENTS.map(el => ({
										text: `${el.username} ${el.lastname}`,
										value: el.id,
									}))
								"
								color="rgba(36, 49, 56, 0.38)"
								item-color="rgb(36, 49, 56)"
								:no-data-text="'Ничего не найдено'"
								label="Клиент"
								hide-details
								dense
								background-color="#FFF"
								clearable
							/>
						</v-col>
						<v-col class="d-flex justify-end" cols="4">
							<v-btn
								v-if="checkedItems.length"
								text
								x-small
								color="#FF5252"
								class="mr-2"
								@click="removeSelected"
							>
								Удалить выбранные
							</v-btn>
							<v-btn text x-small @click="clearAll">
								Удалить все
							</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="4">
							<v-text-field
								v-model="client.lastname"
								dense
								color="gray"
								label="Фамилия"
								light
								hide-details
								type="text"
								:disabled="!!clientId"
							/>
						</v-col>
						<v-col cols="4">
							<v-text-field
								v-model="client.username"
								dense
								color="gray"
								label="Имя"
								light
								hide-details
								type="text"
								:disabled="!!clientId"
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="4">
							<v-text-field
								:value="client?.phone || ''"
								class="text-h5"
								label="Телефон"
								color="#FFC11C"
								light
								dense
								:disabled="!!clientId"
								@input="
									v =>
										client?.phone &&
										(client.phone = onPhoneInput(v))
								"
							/>
						</v-col>
						<v-col cols="4">
							<div
								v-if="isNewClient"
								class="d-flex justify-space-between"
							>
								<v-btn
									outlined
									tile
									@click="cancelClientCreation"
								>
									Отменить
								</v-btn>
								<v-btn
									tile
									dark
									color="#FFC11C"
									elevation="0"
									@click="createClient"
								>
									Создать клиента
								</v-btn>
							</div>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="8">
							<v-autocomplete
								:value="search"
								:items="[...servicesList, ...productsList]"
								color="gray"
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
											<div class="d-flex align-center">
												<v-checkbox
													:value="
														checkCheckedId({
															id,
															type,
														})
													"
													color="#FFC11C"
													class="d-inline ma-0 pa-0"
													hide-details
													@change="
														toggleChecked({
															id,
															type,
														})
													"
												/>
												<span v-if="type === 'product'">
													{{ productsObj[id].title }}
												</span>
												<span v-if="type === 'service'">
													{{ servicesObj[id].title }}
												</span>
												{{ id }}
											</div>
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
												<!-- {{
													parsePrice(
														productsObj[id].price,
													)
												}} -->
												<v-text-field
													v-model="
														costomProductsPrices[id]
													"
													filled
													dense
													color="#FFC11C"
													light
													hide-details
													type="text"
												/>
											</span>
											<span v-if="type === 'service'">
												<!-- {{
													parsePrice(
														servicesObj[id].price,
													)
												}} -->
												<v-text-field
													v-model="
														costomServicesPrices[id]
													"
													filled
													dense
													color="#FFC11C"
													light
													hide-details
													type="text"
												/>
											</span>
										</td>
										<td class="g-stock__td text-right py-2">
											<span v-if="type === 'product'">
												{{
													parsePrice(
														costomProductsPrices[
															id
														],
													) * count
												}}
											</span>
											<span v-if="type === 'service'">
												{{
													parsePrice(
														costomServicesPrices[
															id
														],
													) * count
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
					v-if="!orderId"
					:disabled="!isFormValid"
					tile
					elevation="0"
					class="px-6 ml-4"
					outlined
					@click="reserveOrder"
				>
					Забронировать
				</v-btn>
				<v-btn
					v-if="!orderId"
					color="#FFC11C"
					:dark="isFormValid"
					:disabled="!isFormValid"
					tile
					elevation="0"
					class="px-6 ml-4"
					@click="createOrder"
				>
					Оформить
				</v-btn>
				<v-btn
					v-if="orderId"
					color="#FFC11C"
					:dark="isFormValid"
					:disabled="!isFormValid"
					tile
					elevation="0"
					class="px-6 ml-4"
					@click="pyForOrder"
				>
					Оплатить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { onPhoneInput } from '@/utils/phoneMask';
import { parsePrice } from '@/services';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const defaultData = {
	orderItems: [],
	checkedItems: [],
	clientId: '',
	masterId: '',
	eventId: '',
	search: '',
};

const keys = {
	product: 'productId',
	service: 'serviceId',
};

const defaultClient = {
	username: '',
	lastname: '',
	phone: '',
};

export default {
	name: 'GCreateOrderModalForm',
	data: () => ({
		client: {
			username: '',
			lastname: '',
			phone: '',
		},
		orderItems: [],
		checkedItems: [],
		costomProductsPrices: {},
		costomServicesPrices: {},
		clientId: '',
		masterId: '',
		eventId: '',
		orderId: '',
		search: '',
		headers: [
			{ text: 'Название', value: 'title' },
			{ text: 'Количество', value: 'count', width: 130 },
			{ text: 'Сумма ₽, шт', value: 'price', width: 130 },
			{ text: 'Всего ₽', value: 'finalPrice', width: 130 },
		],
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
		isNewClient() {
			const { username, lastname } = this.client;
			return !!(!this.clientId && username && lastname);
		},
		servicesList() {
			return this.SERVICES.map(el => {
				console.log('SERVICES el', el)
				return {
					text: `${el.breed.title} - ${el.title}`,
					value: { id: el.id, type: 'service' },
				};
			});
		},
		productsList() {
			return this.PRODUCTS.filter(el => +el.count).map(el => ({
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
				service: this.costomServicesPrices,
				product: this.costomProductsPrices,
			};
		},
		finalPrice() {
			return this.orderItems.reduce((acc, { id, type, count }) => {
				const price = this.parsePrice(this.currentObj[type][id]);
				return acc + price * count;
			}, 0);
		},
		form() {
			const { service: services, product: products } =
				this.orderItems.reduce(
					(acc, { id, type, count, orderId }) => {
						const currentKey = keys[type];

						return {
							...acc,
							[type]: [
								...acc[type],
								{
									[currentKey]: id,
									count,
									id: orderId,
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
		orderItems(items) {
			for (let { id, type } of items) {
				if (type === 'service') {
					this.costomServicesPrices = {
						...this.costomServicesPrices,
						[id]: this.servicesObj[id].price,
					};
				}
				if (type === 'product') {
					this.costomProductsPrices = {
						...this.costomProductsPrices,
						[id]: this.productsObj[id].price,
					};
				}
			}
		},
		DEFAULT_ORDER_DATA(defaultData) {
			if (!defaultData) return;

			for (let param in defaultData) {
				this[param] = defaultData[param];
			}
		},
		clientId(id) {
			this.client = { ...this.CLIENTS.find(el => el.id === id) };
		},
	},
	methods: {
		...mapActions([
			'CREATE_ORDER',
			'SUCCESS_EVENT',
			'UPDATE_AND_PAY_ORDER',
			'CREATE_CLIENT',
		]),
		...mapMutations(['CLOSE_ORDER_FORM']),
		onPhoneInput,
		parsePrice,
		closeModal() {
			this.CLOSE_ORDER_FORM();
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
					if (idx !== -1) {
						this.orderItems[idx].count += 1;
						throw false;
					}
					this.orderItems.push({ type: 'service', id, count: 1 });
					// this.costomServicesPrices = {
					// 	...this.costomServicesPrices,
					// 	[id]: this.servicesObj[id].price,
					// };
				}

				if (type === 'product') {
					if (idx !== -1) {
						this.orderItems[idx].count += 1;
						throw false;
					}
					this.orderItems.push({ type: 'product', id, count: 1 });
					// this.costomProductsPrices = {
					// 	...this.costomProductsPrices,
					// 	[id]: this.productsObj[id].price,
					// };
				}

				throw false;
			} catch (e) {
				setTimeout(() => (this.search = ''), 0);
			}
		},
		async createOrder({ isSuccess = true, isReserved = false }) {
			if (!confirm('Продолжить?')) return;

			const { data } = await this.CREATE_ORDER({
				...this.form,
				clientId: this.clientId,
				masterId: this.masterId,
				isSuccess: isSuccess,
				isReserved: isReserved,
			});

			if (data && this.eventId) {
				await this.SUCCESS_EVENT(this.eventId);
			}

			this.clearFrom();
			this.closeModal();
		},
		async pyForOrder() {
			if (!confirm('Продолжить?')) return;

			const { data } = await this.UPDATE_AND_PAY_ORDER({
				id: this.orderId,
				orderData: {
					...this.form,
					clientId: this.clientId,
					masterId: this.masterId,
				},
			});

			this.clearFrom();
			this.closeModal();
		},
		reserveOrder() {
			this.createOrder({ isSuccess: false, isReserved: true });
		},
		increment({ id, type }) {
			const idx = this.orderItems.findIndex(
				el => el.id === id && el.type === type,
			);
			if (type === 'service') {
				return this.orderItems[idx].count++;
			}

			const product = this.productsObj[this.orderItems[idx].id];

			if (product.count > this.orderItems[idx].count) {
				this.orderItems[idx].count++;
			}
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
				}

				return;
			}

			this.orderItems[idx].count--;
		},
		clearAll() {
			if (confirm('Очистить карзину?')) {
				this.clearFrom();
			}
		},
		toggleChecked({ id, type }) {
			const isItem = el => el.id === id && el.type === type;

			const idx = this.checkedItems.findIndex(el => isItem(el));

			if (idx === -1) {
				this.checkedItems = [...this.checkedItems, { id, type }];
				return;
			}

			this.checkedItems = this.checkedItems.filter(el => !isItem(el));
		},
		removeSelected() {
			this.orderItems = this.orderItems.filter(
				({ id, type }) =>
					!this.checkedItems.find(
						el => el.id === id && el.type === type,
					),
			);
			this.checkedItems = [];
		},
		checkCheckedId({ id, type }) {
			return !!this.checkedItems.find(
				el => el.id === id && el.type === type,
			);
		},
		cancelClientCreation() {
			this.client = { ...defaultClient };
		},
		async createClient() {
			const { username, lastname, phone } = this.client;

			const {
				data: { client },
			} = await this.CREATE_CLIENT({
				username: username?.trim(),
				lastname: lastname?.trim() || '',
				phone: phone?.trim() || '',
				comment: '',
				animal: '',
			});

			this.clientId = client.id;
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
