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
							<v-btn text> Удалить все </v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-data-table
								:headers="headers"
								:items="servicesForTable"
								no-data-text="Ничего не выбрано"
								no-results-text="Ничего не выбрано"
								loading-text="Загрузка"
								hide-default-footer
							>
								<template v-slot:item="{ item, index }">
									<tr>
										<td class="g-stock__td py-2">
											<span>{{ item.title }}</span>
										</td>
										<td
											class="g-stock__td text-center py-2"
										>
											<v-icon
												:disabled="item.count === 1"
												@click="services[index].count--"
											>
												mdi-minus
											</v-icon>
											<span class="mx-2">{{
												item.count
											}}</span>
											<v-icon
												@click="services[index].count++"
											>
												mdi-plus
											</v-icon>
										</td>
										<td class="g-stock__td text-right py-2">
											<span>{{ item.price }}</span>
										</td>
										<td class="g-stock__td text-right py-2">
											<span>{{ item.finalPrice }}</span>
										</td>
									</tr>
								</template>
							</v-data-table>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-data-table
								:headers="headers"
								:items="productsForTable"
								no-data-text="Ничего не выбрано"
								no-results-text="Ничего не выбрано"
								loading-text="Загрузка"
								hide-default-footer
							>
								<template v-slot:item="{ item, index }">
									<tr>
										<td class="g-stock__td py-2">
											<span>{{ item.title }}</span>
										</td>
										<td
											class="g-stock__td text-center py-2"
										>
											<v-icon
												:disabled="item.count === 1"
												@click="products[index].count--"
											>
												mdi-minus
											</v-icon>
											<span class="mx-2">{{
												item.count
											}}</span>
											<v-icon
												@click="products[index].count++"
											>
												mdi-plus
											</v-icon>
										</td>
										<td class="g-stock__td text-right py-2">
											<span>{{ item.price }}</span>
										</td>
										<td class="g-stock__td text-right py-2">
											<span>{{ item.finalPrice }}</span>
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
	products: [],
	services: [],
	clientId: '',
	masterId: '',
	eventId: '',
};

export default {
	name: 'GCreateOrderModalForm',
	data: () => ({
		services: [],
		products: [],
		clientId: '',
		masterId: '',
		eventId: '',
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
		servicesForTable() {
			return this.services.map(({ serviceId, count }) => ({
				title: this.servicesObj[serviceId].title,
				count,
				price: this.servicesObj[serviceId].price,
				finalPrice: this.servicesObj[serviceId].price * count,
			}));
		},
		productsForTable() {
			return this.products.map(({ productId, count }) => ({
				title: this.productsObj[productId].title,
				count,
				price: this.productsObj[productId].price,
				finalPrice: this.productsObj[productId].price * count,
			}));
		},
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
			return !!this.services.length || !!this.products.length;
		},
		finalPrice() {
			return (
				this.services.reduce(
					(acc, el) =>
						acc + el.count * this.servicesObj[el.serviceId].price,
					0,
				) +
				this.products.reduce(
					(acc, el) =>
						acc + el.count * this.productsObj[el.productId].price,
					0,
				)
			);
		},
		form() {
			return {
				services: this.services,
				products: this.products,
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
		setBasket(item) {
			if (!item) return
			
			if (item.type === 'service') {
				if (this.products.find(el => el.serviceId === item.id)) return

				this.services.push({ serviceId: item.id, count: 1 });
			}

			if (item.type === 'product') {
				if (this.products.find(el => el.productId === item.id)) return
				
				this.products.push({ productId: item.id, count: 1 });
			}
		},
		async createOrder(isSuccess = false) {
			const { data } = await this.CREATE_ORDER({
				...this.form,
				isSuccess,
			});
			console.log('data', data);
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
