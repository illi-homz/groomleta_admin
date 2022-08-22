<template>
	<div class="g-stock flex-grow-1 d-flex flex-column">
		<h1 class="mb-4">Склад</h1>
		<v-divider class="mb-5" />
		<v-row class="flex-grow-0 my-0 mb-5">
			<v-col class="py-0 d-flex align-end">
				<v-tabs color="#FFC11C">
					<v-tab @click="tableType = 'products'"> Товары </v-tab>
					<v-tab @click="tableType = 'services'"> Услуги </v-tab>
				</v-tabs>
			</v-col>
			<v-col class="d-flex py-0">
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
		<GStockProductsTable
			v-if="tableType === 'products'"
			class="flex-grow-1"
			:products="products"
			:old-product="oldProduct"
			:selected-product="selectedProduct"
			:writable-product-id="writableProductId"
			@createProduct="successCreateProduct"
			@updateProduct="successSaveProduct"
			@cancelWritingProduct="cancelWritingProduct"
			@writeProduct="writeProduct"
		/>
		<GStockServicesTable v-if="tableType === 'services'" />
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
import { GStockProductsTable, GStockServicesTable } from '@/components';

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
	components: {GStockProductsTable, GStockServicesTable},
	data: () => ({
		tableType: 'products', // services
		removeDialog: false,
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
		async successCreateProduct(data) {
			const {
				data: { allProducts },
			} = await this.CREATE_PRODUCT(data);

			this.products = allProducts;
			this.selectedProduct = null;
			this.writableProductId = null;
			this.oldProducts = null;
		},
		async successSaveProduct(id, data) {
			const {
				data: { allProducts },
			} = await this.UPDATE_PRODUCT({ id, data });

			this.products = allProducts;
			this.selectedProduct = null;
			this.writableProductId = null;
			this.oldProducts = null;
		},
		// async saveProduct() {
		// 	if (!this.selectedProduct?.title) return;

		// 	const product = this.selectedProduct;

		// 	if (product.id === -1) {
		// 		const data = {
		// 			title: product.title,
		// 			vendorCode: product.vendorCode || '',
		// 			count: +product.count || 0,
		// 			price: +product.price || 0,
		// 			description: product.description || '',
		// 		};

		// 		const {
		// 			data: { allProducts },
		// 		} = await this.CREATE_PRODUCT(data);
		// 		this.products = allProducts;
		// 		this.selectedProduct = null;
		// 		this.writableProductId = null;
		// 		this.oldProducts = null;
		// 	} else {
		// 		const data = {};
		// 		if (this.oldProduct.title !== product.title)
		// 			data.title = product.title?.trim();
		// 		if (this.oldProduct.vendorCode !== product.vendorCode)
		// 			data.vendorCode = product.vendorCode?.trim();
		// 		if (+this.oldProduct.count !== +product.count)
		// 			data.count = +product.count;
		// 		if (+this.oldProduct.price !== +product.price)
		// 			data.price = +product.price;
		// 		if (this.oldProduct.description !== product.description)
		// 			data.description = product.description?.trim();

		// 		if (!Object.keys(data).length) {
		// 			return this.cancelWritingProduct();
		// 		}

		// 		const {
		// 			data: { allProducts },
		// 		} = await this.UPDATE_PRODUCT({ id: product.id, data });
		// 		this.products = allProducts;
		// 		this.selectedProduct = null;
		// 		this.writableProductId = null;
		// 		this.oldProducts = null;
		// 	}
		// },
		// setPageCount(v) {
		// 	this.pageCount = v;
		// },
		// setCurrentPage({ page }) {
		// 	this.currentPage = page;
		// },
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
