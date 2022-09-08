<template>
	<div class="g-stock flex-grow-1 d-flex flex-column">
		<h1 class="mb-4">Склад</h1>
		<v-divider class="mb-5" />
		<v-row class="flex-grow-0 my-0 mb-5">
			<v-col class="py-0 d-flex align-end">
				<v-tabs v-model="activeTabIdx" color="#FFC11C">
					<v-tab @click="activeTabIdx = 'products'"> Товары </v-tab>
					<v-tab @click="activeTabIdx = 'services'"> Услуги </v-tab>
				</v-tabs>
			</v-col>
			<v-col class="d-flex py-0">
				<v-spacer />
				<v-btn
					v-if="activeTabIdx === 0"
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
					v-if="activeTabIdx === 1"
					x-large
					color="#FFC11C"
					tile
					dark
					elevation="0"
					@click="createService"
				>
					<v-icon>mdi-plus</v-icon>
					Добавить новую услугу
				</v-btn>
			</v-col>
		</v-row>
		<GStockProductsTable
			v-if="activeTabIdx === 0"
			class="flex-grow-1"
			:products="products"
			:old-product="oldProduct"
			:selected-product="selectedProduct"
			:writable-product-id="writableProductId"
			@createProduct="successCreateProduct"
			@updateProduct="successSaveProduct"
			@cancelWritingProduct="cancelWritingProduct"
			@writeProduct="writeProduct"
			@removeProduct="removeProduct"
		/>
		<GStockServicesTable
			v-if="activeTabIdx === 1"
			class="flex-grow-1"
			:services="services"
			:old-service="oldService"
			:selected-service="selectedService"
			:writable-service-id="writableServiceId"
			:categories="categories"
			:breeds="breeds"
			@createService="successCreateService"
			@updateService="successSaveService"
			@cancelWritingService="cancelWritingService"
			@writeService="writeService"
			@removeService="removeService"
		/>
		<v-dialog v-model="removeDialog" persistent max-width="290">
			<v-card>
				<v-card-title class="text-h5">
					{{ removeDialogTitle }}
				</v-card-title>
				<v-card-text>
					{{ removeDialogText }}
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
						@click="removeDialogCb && removeDialogCb()"
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
const defaultService = {
	id: -1,
	title: '',
	text: '',
	animal: 'ANY',
	price: '0',
	time: '1 час',
	img: null,
	category: null,
	breed: null,
};

export default {
	name: 'GStock',
	components: { GStockProductsTable, GStockServicesTable },
	data: () => ({
		activeTabIdx: 0, // 0 | 1
		removeDialog: false,
		removeDialogTitle: '',
		removeDialogText: 'Отменить действие будет невозможно',
		removeDialogCb: null,
		products: [],
		services: [],
		breeds: [],
		categories: [],
		writableProductId: null,
		writableServiceId: null,
		selectedProduct: null,
		selectedService: null,
		oldProducts: null,
		oldServices: null,
		oldProduct: null,
		oldService: null,
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
			'CREATE_SERVICE',
			'UPDATE_SERVICE',
			'REMOVE_SERVICE',
			'UPLOAD_SERVICE_IMAGE',
		]),
		async getProducts() {
			const { data } = await this.GET_ALL_PRODUCTS();
			this.products = data;
		},
		async getServices() {
			const { data } = await this.GET_SERVICES();
			const { allServices, allBreeds, allCategories } = data;
			this.services = allServices || [];
			this.breeds = allBreeds || [];
			this.categories = allCategories || [];
		},
		createProduct() {
			this.oldProducts = JSON.parse(JSON.stringify(this.products));
			this.products = [{ ...defaultProduct }, ...this.products];
			this.writableProductId = -1;
			this.selectedProduct = this.products[0];
		},
		createService() {
			this.oldServices = JSON.parse(JSON.stringify(this.services));
			this.services = [{ ...defaultService }, ...this.services];
			this.writableServiceId = -1;
			this.selectedService = this.services[0];
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
		async successCreateService({ img, ...data }) {
			const {
				data: { service },
			} = await this.CREATE_SERVICE(data);

			if (img && service && service?.id) {
				await this.UPLOAD_SERVICE_IMAGE({ id: service.id, img });
			}

			this.selectedService = null;
			this.writableServiceId = null;
			this.oldServices = null;
			this.getServices();
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
		async successSaveService(id, { img, ...data }) {
			if (Object.keys(data).length) {
				const { data: respData } = await this.UPDATE_SERVICE({
					id,
					data,
				});
				if (!respData) return;
			}

			if (img) {
				await this.UPLOAD_SERVICE_IMAGE({ id, img });
			}

			this.selectedService = null;
			this.writableServiceId = null;
			this.oldServices = null;
			this.getServices();
		},
		writeProduct(id) {
			this.cancelWritingProduct();

			this.writableProductId = id;
			this.selectedProduct = this.products.find(el => +el.id === +id);
			this.oldProduct = JSON.parse(JSON.stringify(this.selectedProduct));
		},
		writeService(id) {
			this.cancelWritingService();

			this.writableServiceId = id;
			this.selectedService = this.services.find(el => +el.id === +id);
			this.oldService = JSON.parse(JSON.stringify(this.selectedService));
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
		cancelWritingService() {
			if (this.oldServices) {
				this.services = [...this.oldServices];
				this.oldServices = null;
			}

			if (this.oldService) {
				this.services = [...this.services].map(el => {
					if (el.id === this.writableServiceId) {
						return { ...this.oldService };
					}

					return el;
				});
				this.oldService = null;
			}

			this.selectedService = null;
			this.writableServiceId = null;
		},
		removeProduct(id) {
			this.removeProductId = id;
			this.removeDialog = true;
			this.removeDialogTitle = `Удалить продукт #${id}?`;
			this.removeDialogCb = this.confirmedRemoveProduct;
		},
		removeService(id) {
			this.removeServiceId = id;
			this.removeDialog = true;
			this.removeDialogTitle = `Удалить услугу #${id}?`;
			this.removeDialogCb = this.confirmedRemoveService;
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
		async confirmedRemoveService() {
			if (this.removeServiceId) {
				const { data } = await this.REMOVE_SERVICE(
					this.removeServiceId,
				);

				if (data.success) {
					this.getServices();
				}
			}

			this.removeServiceId = null;
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

	.v-window {
		flex: 1;
		display: flex;
		flex-direction: column;

		&__container {
			// height: 100%;
			flex: 1;
		}
	}
}
</style>
