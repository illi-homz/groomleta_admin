<template>
	<div class="g-stock-products-table d-flex flex-column">
		<v-row class="flex-grow-0 my-0 mb-5">
			<v-col class="py-0" cols="3">
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
		</v-row>
		<v-data-table
			class="flex-grow-1"
			:items-per-page="itemsPerPage"
			:headers="headers"
			:items="currentProducts"
			no-data-text="Ничего найти не получилось"
			no-results-text="Ничего найти не получилось"
			loading-text="Загрузка"
			hide-default-footer
			:page="currentPage"
			@pagination="setCurrentPage"
		>
			<template v-slot:item="{ item }">
				<tr
					v-if="+writableProductId !== +item.id || !currentProduct"
					class="pointer"
					@contextmenu.prevent="$emit('writeProduct', item.id)"
				>
					<td class="g-stock__td py-2">
						<span>{{ item.id }}</span>
					</td>
					<td class="g-stock__td py-2">
						<v-img
							v-if="item.img"
							contain
							:lazy-src="`${API_URL + MEDIAFILES}/${item.img}`"
							:src="`${API_URL + MEDIAFILES}/${item.img}`"
							max-height="38"
							max-width="38"
							class="mx-auto"
						/>
					</td>
					<td
						v-for="key in ['vendorCode', 'title']"
						:key="key"
						class="g-stock__td text-xs-right py-2"
					>
						<span>{{ item[key] }}</span>
					</td>
					<td class="g-stock__td py-2">
						<span>{{ item.count }}</span>
					</td>
					<td class="g-stock__td py-2">
						<span>{{ item.price }}</span>
					</td>
					<td class="g-stock__td text-xs-right py-2">
						<div class="d-flex align-center">
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
										@click="$emit('writeProduct', item.id)"
									>
										<v-icon class="mr-3">
											mdi-pencil-outline
										</v-icon>
										Изменить
									</v-list-item>
									<v-list-item
										@click="$emit('removeProduct', item.id)"
									>
										<v-icon class="mr-3">
											mdi-trash-can-outline
										</v-icon>
										Удалить
									</v-list-item>
								</v-list>
							</v-menu>
						</div>
					</td>
				</tr>

				<tr v-else>
					<td class="g-stock__td text-xs-right py-2">
						<span>{{ item.id }}</span>
					</td>
					<td class="g-stock-services-table__td py-2">
						<v-img
							v-if="previewImage || currentProduct.img"
							contain
							:src="
								previewImage ||
								`${API_URL + MEDIAFILES}/${currentProduct.img}`
							"
							max-height="38"
							max-width="38"
							class="mx-auto pointer"
							@click="loadImage"
						/>
						<div
							v-else
							class="g-stock-services-table__image-wrapper mx-auto pointer"
							@click="loadImage"
						/>
						<input
							ref="avatar"
							type="file"
							name="images"
							multiple
							accept=".jpg,.png"
							hidden
							@change="onUploadImages"
						/>
					</td>
					<td
						v-for="key in ['vendorCode', 'title', 'count', 'price']"
						:key="key"
						class="g-stock__td text-xs-right py-2"
					>
						<v-text-field
							v-model="currentProduct[key]"
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
								v-model="currentProduct.description"
								class="lex-grow-1"
								filled
								color="#FFC11C"
								light
								hide-details
								no-resize
								rows="3"
							/>
							<div class="py-2 ml-4">
								<v-btn
									elevation="0"
									class="flex-grow-1 mb-2"
									block
									@click="cancelWritingProducts"
								>
									Отменить
								</v-btn>
								<v-btn
									elevation="0"
									class="flex-grow-1"
									color="#FFC11C"
									tile
									dark
									block
									@click="saveProduct"
								>
									Сохранить
								</v-btn>
							</div>
						</div>
					</td>
				</tr>
			</template>
			<template v-slot:footer="{ props: { options, pagination } }">
				<div class="v-data-footer__wrapper d-flex align-center pl-2">
					<div class="v-data-footer__info">
						Всего: {{currentProducts.length}} {{declOfNum(currentProducts.length, titles)}}
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
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

const defaultParams = {
	image: null,
	previewImage: null,
	searchStr: '',
	currentPage: 0,
	pageCount: 0,
	currentProduct: {},
};

export default {
	name: 'GStockProductsTable',
	props: ['products', 'selectedProduct', 'writableProductId', 'oldProduct'],
	data: () => ({
		API_URL,
		MEDIAFILES,
		searchStr: '',
		currentPage: 0,
		itemsPerPage: 15,
		pageCount: 0,
		newProduct: null,
		currentProduct: {},
		headers: [
			{ text: 'ID', value: 'id', width: 70, align: 'center' },
			{ text: 'Превью', value: 'img', width: 100, align: 'center' },
			{ text: 'Артикул', value: 'vendorCode', width: 100 },
			{ text: 'Название', value: 'title' },
			{ text: 'Количество', value: 'count', width: 130, align: 'end' },
			{ text: 'Цена, руб', value: 'price', width: 130, align: 'end' },
			{ text: 'Описание', value: 'description', width: '40%' },
		],
		image: null,
		previewImage: null,
		titles: ['товар', 'товара', 'товаров']
	}),
	computed: {
		currentProducts() {
			return this.products.filter(
				el =>
					el.title.toLowerCase().includes(this.searchStr) ||
					el.vendorCode.toLowerCase().includes(this.searchStr),
			);
		},
	},
	watch: {
		selectedProduct(data) {
			this.currentProduct = { ...data };
		},
	},
	methods: {
		declOfNum,
		setCurrentPage({ page, pageCount }) {
			this.currentPage = page;
			this.pageCount = pageCount;
		},
		async saveProduct() {
			if (!this.currentProduct?.title) return;

			const product = this.currentProduct;

			if (product.id === -1) {
				const data = {
					title: product.title,
					vendorCode: product.vendorCode || '',
					count: +product.count || 0,
					price: +product.price || 0,
					description: product.description || '',
					img: this.image || null,
				};

				this.$emit('createProduct', data);
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
				if (this.image) data.img = this.image;

				if (!Object.keys(data).length) {
					return this.$emit('cancelWritingProduct');
				}

				this.$emit('updateProduct', product.id, data);
			}
		},
		loadImage() {
			this.$refs.avatar.click();
		},
		async onUploadImages({ target }) {
			const file = target.files[0];
			this.image = file;
			this.previewImage = URL.createObjectURL(this.image);
		},
		cancelWritingProducts() {
			for (let prop in defaultParams) {
				this[prop] = defaultParams[prop];
			}

			this.$emit('cancelWritingProduct');
		},
		footerUpdate({page, itemsPerPage}) {
			this.currentPage = page
			this.itemsPerPage = itemsPerPage
		},
	},
};
</script>

<style lang="scss">
.g-stock-products-table {
	&__image-wrapper {
		background-color: rgba(0, 0, 0, 0.06);
		width: 38px;
		height: 38px;
		border-radius: 30%;
	}

	&__footer {
		background-color: #F5F5F5;
	}
}
</style>
