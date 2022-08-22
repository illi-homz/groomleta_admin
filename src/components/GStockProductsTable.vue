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
			:items-per-page="15"
			:headers="headers"
			:items="currentProducts"
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
					v-if="+writableProductId !== +item.id || !currentProduct"
					class="pointer"
					@contextmenu.prevent="$emit('writeProduct', item.id)"
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
									@click="$emit('writeProduct', item.id)"
								>
									<v-icon class="mr-3">
										mdi-pencil-outline
									</v-icon>
									Изменить
								</v-list-item>
								<v-list-item @click="removeProduct(item.id)">
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
						</div>
						<div class="py-2 d-flex">
							<v-btn
								elevation="0"
								class="flex-grow-1 mr-4"
								x-large
								@click="$emit('cancelWritingProduct')"
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
	</div>
</template>

<script>
export default {
	name: 'GStockProductsTable',
	props: ['products', 'selectedProduct', 'writableProductId', 'oldProduct'],
	data: () => ({
		searchStr: '',
		currentPage: 0,
		pageCount: 0,
		newProduct: null,
		currentProduct: {},
		headers: [
			{ text: 'ID', value: 'id', width: 70, align: 'center' },
			{ text: 'Артикул', value: 'vendorCode', width: 100 },
			{ text: 'Название', value: 'title' },
			{ text: 'Количество', value: 'count', width: 130, align: 'end' },
			{ text: 'Цена, руб', value: 'price', width: 130, align: 'end' },
			{ text: 'Описание', value: 'description', width: '30%' },
		],
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
	watch: {
		selectedProduct(data) {
			this.currentProduct = { ...data };
		},
	},
	methods: {
		setPageCount(v) {
			this.pageCount = v;
		},
		setCurrentPage({ page }) {
			this.currentPage = page;
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

				if (!Object.keys(data).length) {
					return this.$emit('cancelWritingProduct');
				}

				this.$emit('updateProduct', product.id, data);
			}
		},
	},
};
</script>

<style lang="scss">
.g-stock-products-table {
}
</style>
