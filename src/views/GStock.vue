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
				></v-text-field>
			</v-col>
			<v-col class="d-flex">
				<v-spacer></v-spacer>
				<v-btn
					x-large
					color="#FFC11C"
					tile
					dark
					elevation="0"
					@click="createNewGroomer"
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
					:items="PRODUCTS"
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
					@page-count="setPageCount"
				>
					<template v-slot:item="{ item, index }">
						<tr @click="gotoDetail(item)" class="pointer">
							<td class="text-xs-right py-2">
								{{ item.vendorCode }}
							</td>
							<td class="text-xs-right py-2">{{ item.title }}</td>
							<td class="text-xs-right py-2">{{ item.count }}</td>
							<td class="text-xs-right py-2">{{ item.price }}</td>
							<td class="text-xs-right py-2 d-flex align-center">
								<div class="flex-grow-1">
									{{ item.description }}
								</div>
								<v-menu open-on-hover offset-y left>
									<template v-slot:activator="{ on, attrs }">
										<v-icon v-bind="attrs" v-on="on"
											>mdi-dots-horizontal</v-icon
										>
									</template>

									<v-list>
										<v-list-item
											@click="writeProduct(index)"
										>
											<v-icon class="mr-3"
												>mdi-pencil-outline</v-icon
											>
											Изменить
										</v-list-item>
										<v-list-item @click="removeProduct(item.id)">
											<v-icon class="mr-3"
												>mdi-trash-can-outline</v-icon
											>Удалить
										</v-list-item>
									</v-list>
								</v-menu>
							</td>
						</tr>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'GStock',
	data: () => ({
		currentPage: 0,
		pageCount: 0,
		searchStr: '',
		search: '',
		headers: [
			{ text: 'Артикул', value: 'vendorCode' },
			{ text: 'Название', value: 'title' },
			{ text: 'Количество', value: 'count' },
			{ text: 'Цена', value: 'price' },
			{ text: 'Описание', value: 'description' },
		],
		writableProductIdx: null,
	}),
	computed: {
		...mapGetters(['PRODUCTS']),
	},
	mounted() {
		// this.getAllGroomers();
		this.GET_ALL_PRODUCTS();
	},
	methods: {
		...mapActions(['GET_ALL_PRODUCTS']),
		setPageCount(v) {
			// this.pageCount = v
		},
		setCurrentPage({ page }) {
			// this.currentPage = page
		},
		createNewGroomer() {
			console.log('createNewGroomer');
		},
		gotoDetail({ id }) {
			// this.$router.push({ name: 'g-groomerdetail', params: { id } });
		},
		writeProduct(idx) {
			console.log('writeProduct', idx)
			this.writableProductIdx = idx;
		},
		removeProduct(id) {
			console.log('removeProduct', id)
		},
	},
};
</script>

<style lang="scss">
.g-stock {
}
</style>
