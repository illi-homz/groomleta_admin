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
			:items-per-page="itemsPerPage"
			:headers="headers"
			:items="currentServices"
			no-data-text="Ничего найти не получилось"
			no-results-text="Ничего найти не получилось"
			loading-text="Загрузка"
			hide-default-footer
			:page="currentPage"
			@pagination="setCurrentPage"
		>
			<template v-slot:item="{ item }">
				<tr
					v-if="+writableServiceId !== +item.id || !currentService"
					class="pointer"
					@contextmenu.prevent="$emit('writeService', item.id)"
				>
					<td class="g-stock-services-table__td py-2">
						<span>{{ item.id }}</span>
					</td>
					<td class="g-stock-services-table__td py-2">
						<span>{{ item.title }}</span>
					</td>
					<td class="g-stock-services-table__td py-2">
						<span>{{ item.text }}</span>
					</td>
					<td class="g-stock-services-table__td py-2">
						<span>{{ animals[item.animal] }}</span>
					</td>
					<td class="g-stock-services-table__td py-2">
						<span>{{ item.price }}</span>
					</td>
					<td class="g-stock-services-table__td py-2">
						<span>{{ item.time }}</span>
					</td>
					<td class="g-stock-services-table__td py-2">
						<v-img
							contain
							:lazy-src="item.img"
							:src="item.img"
							max-height="38"
							max-width="38"
							class="mx-auto"
						/>
					</td>
					<td class="g-stock-services-table__td py-2">
						<span>{{ item.category.title }}</span>
					</td>
					<td class="g-stock-services-table__td py-2 text-right">
						<div class="float-left">
							{{ item.breed?.title || 'любая порода' }}
						</div>
						<v-menu open-on-hover offset-y left>
							<template v-slot:activator="{ on, attrs }">
								<v-icon v-bind="attrs" v-on="on">
									mdi-dots-horizontal
								</v-icon>
							</template>

							<v-list>
								<v-list-item
									@click="$emit('writeService', item.id)"
								>
									<v-icon class="mr-3">
										mdi-pencil-outline
									</v-icon>
									Изменить
								</v-list-item>
								<v-list-item
									@click="$emit('removeService', item.id)"
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
					<td class="g-stock-services-table__td py-2">
						<span>{{ item.id }}</span>
					</td>
					<td class="g-stock-services-table__td py-2">
						<v-text-field
							ref="title"
							v-model="currentService.title"
							filled
							dense
							color="#FFC11C"
							light
							type="text"
							:rules="[
								() =>
									!!currentService.title ||
									'Введите название',
							]"
						/>
					</td>
					<td class="g-stock-services-table__td py-2">
						<v-textarea
							v-model="currentService.text"
							class="lex-grow-1"
							filled
							color="#FFC11C"
							light
							hide-details
							no-resize
							rows="3"
						/>
					</td>
					<td class="g-stock-services-table__td text-xs-right py-2">
						<v-select
							v-model="currentService.animal"
							:items="animalsList"
							filled
							dense
							color="#FFC11C"
							light
							hide-details
							item-color="warning"
						/>
					</td>
					<td class="g-stock-services-table__td text-xs-right py-2">
						<v-text-field
							v-model="currentService.price"
							filled
							dense
							color="#FFC11C"
							light
							hide-details
							type="text"
						/>
					</td>
					<td class="g-stock-services-table__td text-xs-right py-2">
						<v-text-field
							v-model="currentService.time"
							filled
							dense
							color="#FFC11C"
							light
							hide-details
							type="text"
						/>
					</td>
					<td class="g-stock-services-table__td py-2">
						<v-img
							v-if="previewImage || currentService.img"
							contain
							:src="previewImage || item.img"
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
							accept=".svg"
							hidden
							@change="onUploadImages"
						/>
					</td>
					<td class="g-stock-services-table__td py-2">
						<v-autocomplete
							ref="category"
							v-model="currentService.categoryId"
							:items="categoriesForSelect"
							color="#FFC11C"
							light
							dense
							filled
							auto-select-first
							item-color="warning"
							:rules="[
								() =>
									!!currentService.categoryId ||
									'Выберите категорию',
							]"
						>
							<template v-slot:append-item>
								<v-btn
									elevation="0"
									tile
									small
									block
									class="justify-start"
								>
									<v-icon class="mr-2">mdi-plus</v-icon>
									<span class="text-caption">Добавить</span>
								</v-btn>
							</template>
						</v-autocomplete>
					</td>
					<td class="g-stock-services-table__td py-2">
						<div class="d-flex justify-space-between">
							<v-autocomplete
								ref="breed"
								v-model="currentService.breedId"
								:items="breedsForSelect"
								color="#FFC11C"
								light
								dense
								filled
								auto-select-first
								item-color="warning"
								:rules="[
									() =>
										!!currentService.breedId ||
										'Выберите породу',
								]"
							>
								<template v-slot:append-item>
									<v-btn
										elevation="0"
										tile
										small
										block
										class="justify-start"
									>
										<v-icon class="mr-2">mdi-plus</v-icon>
										<span class="text-caption">
											Добавить
										</span>
									</v-btn>
								</template>
							</v-autocomplete>
							<div class="ml-4 d-flex flex-column">
								<v-btn
									elevation="0"
									class="mb-1"
									color="#FFC11C"
									tile
									dark
									@click="saveService"
								>
									Сохранить
								</v-btn>
								<v-btn
									elevation="0"
									tile
									@click="cancelWritingService"
								>
									Отменить
								</v-btn>
							</div>
						</div>
					</td>
				</tr>
			</template>
			<template v-slot:footer="{ props: { options, pagination } }">
				<div class="v-data-footer__wrapper d-flex align-center pl-2">
					<div class="v-data-footer__info">
						Всего: {{ currentServices.length }}
						{{ declOfNum(currentServices.length, titles) }}
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
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;
import validator from '@/services/validator';
import { declOfNum } from '@/services';

const animals = {
	CAT: 'кот',
	DOG: 'собака',
	ANY: 'не задано',
};

const defaultParams = {
	image: null,
	previewImage: null,
	searchStr: '',
	currentPage: 0,
	pageCount: 0,
	currentService: {},
};

export default {
	name: 'GStockServicesTable',
	props: [
		'services',
		'writableServiceId',
		'selectedService',
		'oldService',
		'categories',
		'breeds',
	],
	data: () => ({
		image: null,
		previewImage: null,
		animals,
		searchStr: '',
		headers: [
			{ text: 'ID', value: 'id', width: 70, align: 'center' },
			{ text: 'Название', value: 'title', width: 230 },
			{ text: 'Описание', value: 'text' },
			{ text: 'Животное', value: 'animal', width: 130 },
			{ text: 'Цена', value: 'price', width: 130 },
			{ text: 'Продолж.', value: 'time', width: 130 },
			{ text: 'Иконка', value: 'img', width: 130, align: 'center' },
			{ text: 'Категория', value: 'category', width: 200 },
			{ text: 'Порода', value: 'breed', width: 400 },
		],
		animalsList: [
			{ text: 'кот', value: 'CAT' },
			{ text: 'собака', value: 'DOG' },
			{ text: 'не задано', value: 'ANY' },
		],
		currentPage: 0,
		itemsPerPage: 15,
		pageCount: 0,
		currentService: {},
		titles: ['услуга', 'услуги', 'услуг'],
	}),
	computed: {
		currentServices() {
			return this.services
				.filter(({ title }) =>
					title.toLowerCase().includes(this.searchStr),
				)
				.map(({ img, ...serviceProps }) => {
					return {
						...serviceProps,
						img: API_URL + MEDIAFILES + '/' + img,
					};
				});
		},
		categoriesForSelect() {
			return this.categories.map(({ id, title }) => ({
				value: id,
				text: title,
			}));
		},
		breedsForSelect() {
			return this.breeds.map(({ id, title }) => ({
				value: id,
				text: title,
			}));
		},
	},
	watch: {
		selectedService(data) {
			if (!data) {
				return {};
			}

			this.currentService = {
				...data,
				categoryId: data.category?.id || null,
				breedId: data.breed?.id || null,
			};
		},
	},
	mounted() {},
	methods: {
		declOfNum,
		setCurrentPage({ page, pageCount }) {
			this.currentPage = page;
			this.pageCount = pageCount;
		},
		saveService() {
			const formHasErrors = validator.call(this, [
				'title',
				'category',
				'breed',
			]);

			if (formHasErrors) {
				return;
			}

			const service = this.currentService;

			if (service.id === -1) {
				const data = {
					title: service.title?.trim() || '',
					text: service.text?.trim() || '',
					animal: service.animal?.toLowerCase() || 'any',
					price: service.price?.trim() || 'от 1',
					time: service.time?.trim() || '',
					img: this.image || null,
					category: service.categoryId || '',
					breed: service.breedId || '',
				};

				this.$emit('createService', data);
			} else {
				const data = {};
				if (this.oldService.title !== service.title)
					data.title = service.title?.trim();
				if (this.oldService.text !== service.text)
					data.text = service.text?.trim();
				if (this.oldService.animal !== service.animal)
					data.animal = service.animal?.toLowerCase();
				if (this.oldService.price !== service.price)
					data.price = service.price?.trim();
				if (this.oldService.time !== service.time)
					data.time = service.time?.trim();
				if (this.oldService.category.id !== service.categoryId)
					data.category = service.categoryId;
				if (this.oldService.breed.id !== service.breedId)
					data.breed = service.breedId;
				if (this.image) data.img = this.image;

				if (!Object.keys(data).length) {
					return this.cancelWritingService();
				}

				this.$emit('updateService', service.id, data);
			}

			this.cancelWritingService()
		},
		loadImage() {
			this.$refs.avatar.click();
		},
		async onUploadImages({ target }) {
			const file = target.files[0];
			this.image = file;
			this.previewImage = URL.createObjectURL(this.image);
		},
		cancelWritingService() {
			for (let prop in defaultParams) {
				this[prop] = defaultParams[prop];
			}

			this.$emit('cancelWritingService');
		},
		footerUpdate({ page, itemsPerPage }) {
			this.currentPage = page;
			this.itemsPerPage = itemsPerPage;
		},
	},
};
</script>

<style lang="scss">
.g-stock-services-table {
	&__td {
		vertical-align: top;
		// vertical-align: middle;
		// text-align: right;
	}

	&__image-wrapper {
		background-color: rgba(0, 0, 0, 0.06);
		width: 38px;
		height: 38px;
		border-radius: 30%;
	}
}
</style>
