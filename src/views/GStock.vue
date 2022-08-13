<template>
	<div class="g-stock">
		<h1 class="mb-4">Склад</h1>
		<v-row>
			<v-col cols="3">
				<v-text-field
					v-model="searchStr"
					prepend-inner-icon="mdi-magnify"
					label="Поиск товара"
					single-line
					hide-details
					color="#FFC11C"
					filled
					dense
				/>
			</v-col>
			<v-col class="d-flex">
				<v-spacer />
				<v-btn
					x-large
					color="#FFC11C"
					tile
					dark
					elevation="0"
					@click="createProduct"
				>
					<v-icon>mdi-plus</v-icon>
					Добавить новый товар
				</v-btn>
			</v-col>
		</v-row>
		<v-row class="flex-grow-1">
			<v-col>
				<v-data-table
					:items-per-page="15"
					:headers="headers"
					:items="currentProducts"
					:search="search"
					no-data-text="Ничего найти не получилось"
					no-results-text="Ничего найти не получилось"
					loading-text="Загрузка"
					:footer-props="{
						itemsPerPageText: 'Мастеров на странице',
						itemsPerPageAllText: 'Все',
						showCurrentPage: true,
						showFirstLastPage: true,
						pageText: `${currentPage} из ${pageCount}`,
					}"
					@pagination="setCurrentPage"
					@pageCount="setPageCount"
				>
					<template v-slot:item="{ item }">
						<tr
							v-if="
								+writableProductId !== +item.id ||
								!selectedProduct
							"
							class="pointer"
							@contextmenu.prevent="writeProduct(item.id)"
						>
							<td
								v-for="key in ['id', 'vendorCode', 'title']"
								:key="key"
								class="g-stock__td text-xs-right py-2"
							>
								<span>{{ item[key] }}</span>
							</td>
							<td class="g-stock__td text-right py-2">
								<span>{{ item.count }}</span>
							</td>
							<td class="g-stock__td text-right py-2">
								<span>{{ item.price }}</span>
							</td>
							<td
								class="g-stock__td text-xs-right py-2 d-flex align-center"
							>
								<div class="flex-grow-1">
									{{ item.description }}
								</div>
								<v-menu open-on-hover offset-y left>
									<template v-slot:activator="{ on, attrs }">
										<v-icon v-bind="attrs" v-on="on">
											mdi-dots-horizontal
										</v-icon>
									</template>

									<v-list>
										<v-list-item
											@click="writeProduct(item.id)"
										>
											<v-icon class="mr-3">
												mdi-pencil-outline
											</v-icon>
											Изменить
										</v-list-item>
										<v-list-item
											@click="removeProduct(item.id)"
										>
											<v-icon class="mr-3">
												mdi-trash-can-outline
											</v-icon>
											Удалить
										</v-list-item>
									</v-list>
								</v-menu>
							</td>
						</tr>

						<tr v-else>
							<td class="g-stock__td text-xs-right py-2">
								<span>{{ item.id }}</span>
							</td>
							<td
								v-for="key in [
									'vendorCode',
									'title',
									'count',
									'price',
								]"
								:key="key"
								class="g-stock__td text-xs-right py-2"
							>
								<v-text-field
									v-model="selectedProduct[key]"
									filled
									dense
									color="#FFC11C"
									light
									hide-details
									:type="
										['price', 'count'].includes(key)
											? 'number'
											: 'text'
									"
								/>
							</td>
							<td
								class="g-stock__td text-xs-right py-2 d-flex flex-column"
							>
								<div class="d-flex align-center">
									<v-textarea
										v-model="selectedProduct.description"
										class="lex-grow-1"
										filled
										color="#FFC11C"
										light
										hide-details
										no-resize
										rows="3"
									/>
								</div>
								<div class="py-2 d-flex">
									<v-btn
										elevation="0"
										class="flex-grow-1 mr-4"
										x-large
										@click="cancelWritingProduct"
									>
										Отменить
									</v-btn>
									<v-btn
										elevation="0"
										class="flex-grow-1"
										x-large
										color="#FFC11C"
										tile
										dark
										@click="saveProduct"
									>
										Сохранить
									</v-btn>
								</div>
							</td>
						</tr>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
		<v-dialog v-model="removeDialog" persistent max-width="290">
			<v-card>
				<v-card-title class="text-h5"> Удалить событие? </v-card-title>
				<v-card-text>
					После удаления данные будут недоступны
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn
						color="green darken-1"
						text
						@click="cancelRemoveProduct"
					>
						Отмена
					</v-btn>
					<v-btn
						color="red darken-1"
						text
						@click="confirmedRemoveProduct"
					>
						Удалить
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
const defaultProduct = {
	id: -1,
	title: '',
	vendorCode: '',
	count: 0,
	price: 0,
	description: '',
};

export default {
	name: 'GStock',
	data: () => ({
		currentPage: 0,
		pageCount: 0,
		searchStr: '',
		search: '',
		removeDialog: false,
		headers: [
			{ text: 'ID', value: 'id', width: 70, align: 'center' },
			{ text: 'Артикул', value: 'vendorCode', width: 100 },
			{ text: 'Название', value: 'title' },
			{ text: 'Количество', value: 'count', width: 130, align: 'end' },
			{ text: 'Цена, руб', value: 'price', width: 130, align: 'end' },
			{ text: 'Описание', value: 'description', width: '30%' },
		],
		products: [],
		writableProductId: null,
		selectedProduct: null,
		oldProducts: null,
		oldProduct: null,
		removeProductId: null,
	}),
	computed: {
		currentProducts() {
			return this.products.filter(
				el =>
					el.title.includes(this.searchStr) ||
					el.vendorCode.includes(this.searchStr),
			);
		},
	},
	mounted() {
		this.getProducts();
	},
	methods: {
		...mapActions([
			'GET_ALL_PRODUCTS',
			'CREATE_PRODUCT',
			'UPDATE_PRODUCT',
			'REMOVE_PRODUCT',
		]),
		async getProducts() {
			const { data } = await this.GET_ALL_PRODUCTS();
			this.products = data;
		},
		createProduct() {
			this.oldProducts = JSON.parse(JSON.stringify(this.products));
			this.products = [{ ...defaultProduct }, ...this.products];
			this.writableProductId = -1;
			this.selectedProduct = this.products[0];
		},
		async saveProduct() {
			if (!this.selectedProduct?.title) return;

			const product = this.selectedProduct;

			if (product.id === -1) {
				const data = {
					title: product.title,
					vendorCode: product.vendorCode || '',
					count: +product.count || 0,
					price: +product.price || 0,
					description: product.description || '',
				};

				const {
					data: { allProducts },
				} = await this.CREATE_PRODUCT(data);
				this.products = allProducts;
				this.selectedProduct = null;
				this.writableProductId = null;
				this.oldProducts = null;
			} else {
				const data = {};
				if (this.oldProduct.title !== product.title)
					data.title = product.title?.trim();
				if (this.oldProduct.vendorCode !== product.vendorCode)
					data.vendorCode = product.vendorCode?.trim();
				if (+this.oldProduct.count !== +product.count)
					data.count = +product.count;
				if (+this.oldProduct.price !== +product.price)
					data.price = +product.price;
				if (this.oldProduct.description !== product.description)
					data.description = product.description?.trim();

				if (!Object.keys(data).length) {
					return this.cancelWritingProduct();
				}

				const {
					data: { allProducts },
				} = await this.UPDATE_PRODUCT({ id: product.id, data });
				this.products = allProducts;
				this.selectedProduct = null;
				this.writableProductId = null;
				this.oldProducts = null;
			}
		},
		setPageCount(v) {
			this.pageCount = v;
		},
		setCurrentPage({ page }) {
			this.currentPage = page;
		},
		writeProduct(id) {
			this.cancelWritingProduct();

			this.writableProductId = id;
			this.selectedProduct = this.products.find(el => +el.id === +id);
			this.oldProduct = { ...this.selectedProduct };
		},
		cancelWritingProduct() {
			if (this.oldProducts) {
				this.products = [...this.oldProducts];
				this.oldProducts = null;
			}

			if (this.oldProduct) {
				this.products = [...this.products].map(el => {
					if (el.id === this.writableProductId) {
						return { ...this.oldProduct };
					}

					return el;
				});
				this.oldProduct = null;
			}

			this.selectedProduct = null;
			this.writableProductId = null;
		},
		removeProduct(id) {
			console.log('removeProduct', id);
			this.removeProductId = id;
			this.removeDialog = true;
		},
		cancelRemoveProduct() {
			this.removeProductId = null;
			this.removeDialog = false;
		},
		async confirmedRemoveProduct() {
			if (this.removeProductId) {
				const {
					data: { allProducts },
				} = await this.REMOVE_PRODUCT(this.removeProductId);

				this.products = allProducts;
			}

			this.removeProductId = null;
			this.removeDialog = false;
		},
	},
};
</script>

<style lang="scss">
.g-stock {
	&__td {
		height: auto !important;
		vertical-align: top;
	}
}
</style>
