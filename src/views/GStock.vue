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
					v-if="tableType === 'products'"
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
				<v-btn
					v-if="tableType === 'services'"
					x-large
					color="#FFC11C"
					tile
					dark
					elevation="0"
					@click="createProduct"
				>
					<v-icon>mdi-plus</v-icon>
					Добавить новую услугу
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
		<GStockServicesTable v-if="tableType === 'services'" :services="services" />
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
	components: { GStockProductsTable, GStockServicesTable },
	data: () => ({
		tableType: 'products', // services
		removeDialog: false,
		products: [],
		services: [],
		writableProductId: null,
		selectedProduct: null,
		oldProducts: null,
		oldProduct: null,
		removeProductId: null,
	}),
	computed: {},
	mounted() {
		this.getProducts();
		this.getServices();
	},
	methods: {
		...mapActions([
			'GET_ALL_PRODUCTS',
			'CREATE_PRODUCT',
			'UPDATE_PRODUCT',
			'REMOVE_PRODUCT',
			'GET_SERVICES',
		]),
		async getProducts() {
			const { data } = await this.GET_ALL_PRODUCTS();
			this.products = data;
		},
		async getServices() {
			const { data } = await this.GET_SERVICES();
			this.services = data;
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
