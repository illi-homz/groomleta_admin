<template>
	<div class="g-stock-services-table d-flex flex-column">
		<v-row class="flex-grow-0 my-0 mb-5">
			<v-col class="py-0" cols="3">
				<v-text-field
					v-model="searchStr"
					prepend-inner-icon="mdi-magnify"
					label="Поиск услуги"
					single-line
					hide-details
					color="#FFC11C"
					filled
					dense
				/>
			</v-col>
		</v-row>
		<!-- <h3>В разработке</h3> -->
		<v-data-table
			class="flex-grow-1"
			:items-per-page="15"
			:headers="headers"
			:items="currentServices"
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
					v-if="+writableServiceId !== +item.id || !currentService"
					class="pointer"
					@contextmenu.prevent="$emit('writeService', item.id)"
				>
					<td class="g-stock__td py-2">
						<span>{{ item.id }}</span>
					</td>
					<td class="g-stock__td py-2">
						<span>{{ item.title }}</span>
					</td>
					<td class="g-stock__td py-2">
						<span>{{ item.text }}</span>
					</td>
					<td class="g-stock__td py-2">
						<span>{{ item.animal }}</span>
					</td>
					<td class="g-stock__td py-2">
						<span>{{ item.price }}</span>
					</td>
					<td class="g-stock__td py-2">
						<span>{{ item.time }}</span>
					</td>
					<td class="g-stock__td py-2">
						<v-img
							:lazy-src="item.img"
							max-height="50"
							max-width="50"
							:src="item.img"
						/>
					</td>
					<td class="g-stock__td py-2">
						<span>{{ item.category.title }}</span>
					</td>
					<td
						class="g-stock__td text-xs-right py-2 d-flex align-center"
					>
						<div class="flex-grow-1">
							{{ item.breed.title }}
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

				<!-- <tr v-else>
					<td class="g-stock__td text-xs-right py-2">
						<span>{{ item.id }}</span>
					</td>
					<td
						v-for="key in ['vendorCode', 'title', 'count', 'price']"
						:key="key"
						class="g-stock__td text-xs-right py-2"
					>
						<v-text-field
							v-model="currentService[key]"
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
								v-model="currentService.description"
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
				</tr> -->
			</template>
		</v-data-table>
	</div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

export default {
	name: 'GStockServicesTable',
	props: ['services', 'writableServiceId', 'selectedService', 'oldService'],
	data: () => ({
		searchStr: '',
		headers: [
			{ text: 'ID', value: 'id', width: 70, align: 'center' },
			{ text: 'Название', value: 'title', width: 230 },
			{ text: 'Описание', value: 'text' },
			{ text: 'Животное', value: 'animal', width: 130 },
			{ text: 'Цена', value: 'price', width: 130 },
			{ text: 'Время', value: 'time', width: 130 },
			{ text: 'Иконка', value: 'img', width: 130 },
			{ text: 'Категория', value: 'category', width: 130 },
			{ text: 'Порода', value: 'breed', width: 200 },
		],
		currentPage: 0,
		pageCount: 0,
		currentService: {},
	}),
	computed: {
		currentServices() {
			return this.services.map(({img, ...serviceProps}) => {
				return {
					...serviceProps,
					img: API_URL + MEDIAFILES + '/' + img
				}
			});
		},
	},
	watch: {},
	methods: {
		setPageCount(v) {
			this.pageCount = v;
		},
		setCurrentPage({ page }) {
			this.currentPage = page;
		},
	},
};
</script>

<style lang="scss">
.g-stock-services-table {
}
</style>
