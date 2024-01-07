<template>
	<div class="g-groomer-detail d-flex flex-column flex-grow-1">
		<div
			v-if="isLoading"
			class="d-flex align-center flex-grow-1 justify-center"
		>
			<v-progress-circular
				:size="60"
				:width="5"
				color="amber"
				indeterminate
			/>
		</div>
		<div v-else class="flex-grow-1 d-flex flex-column">
			<v-breadcrumbs :items="breadcrumbs">
				<template v-slot:divider>
					<v-icon>mdi-chevron-right</v-icon>
				</template>
			</v-breadcrumbs>
			<h1 class="mb-6">{{ master.username }} {{ master.lastname }}</h1>
			<v-row v-if="master" class="user-card flex-grow-0">
				<v-col
					cols="1"
					class="flex-grow-0 d-flex justify-center"
				>
					<v-img
						v-if="imageURl"
						:src="imageURl"
						width="126"
						height="126"
						class="pointer"
						@click="loadImage"
					/>

					<v-btn v-else icon x-large @click="loadImage">
						<v-icon>mdi-camera</v-icon>
					</v-btn>

					<input
						ref="avatar"
						type="file"
						name="images"
						multiple
						accept=".jpg,.png"
						hidden
						@change="onUploadImages"
					/>
				</v-col>
				<v-col class="flex-grow-1">
					<v-row>
						<v-col cols="5" class="pb-0">
							<v-select
								:value="master.post"
								:items="postsList"
								label="Должность"
								color="#FFC11C"
								item-color="warning"
								@input="v => (master.post = v)"
							/>
						</v-col>
						<v-col cols="2" class="pb-0">
							<v-text-field
								:value="getExperience(master.createDate)"
								class="text-h5"
								label="Стаж"
								color="#FFC11C"
								light
								readonly
							/>
						</v-col>
						<v-col cols="1" class="pb-0">
							<v-text-field
								:value="master.rate + '%'"
								class="text-h5"
								label="Ставка"
								color="#FFC11C"
								light
								@input="setRate"
							/>
						</v-col>
						<v-col v-if="master" class="py-0 d-flex align-center">
							<GColorSelector
								v-model="master.color"
								:data="colors"
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="2">
							<v-text-field
								:value="master.phone"
								class="text-h5"
								label="Телефон"
								color="#FFC11C"
								light
								@input="setPhone"
							/>
						</v-col>
						<!-- <v-col cols="2">
							<v-text-field
								v-model="master.education"
								class="text-h5"
								label="Образование"
								color="#FFC11C"
								light
							/>
						</v-col> -->
						<v-col cols="6">
							<label class="text-label mb-2">Дополнительно</label>
							<v-textarea
								v-model="master.comment"
								auto-grow
								outlined
								rows="10"
								row-height="15"
								color="#FFC11C"
							>
						</v-textarea>
							<!-- <v-text-field
								v-model="master.comment"
								class="text-h5"
								label="Дополнительно"
								color="#FFC11C"
								light
							/> -->
						</v-col>
						<v-col>
							<div v-if="isChanged" class="d-flex">
								<v-btn
									outlined
									tile
									class="mr-4"
									@click="cancelUpdates"
								>
									Отменить
								</v-btn>
								<v-btn
									tile
									elevation="0"
									color="#FFC11C"
									dark
									@click="successUpdates"
								>
									Сoхранить изменения
								</v-btn>
							</div>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-tabs color="grey darken-1" class="flex-grow-0">
				<!-- <v-tab @click="tableType = 'services'">Услуги</v-tab> -->
				<v-tab @click="tableType = 'orders'">Заказы</v-tab>
			</v-tabs>
			<!-- <GGroomerServicesTable
				v-if="tableType === 'services' && !!orders"
				:orders="orders"
				class="flex-grow-1"
			/> -->
			<GDetailPageOrdersTable
				v-if="tableType === 'orders' && !!orders"
				:orders="orders"
				class="flex-grow-1"
				:items-per-page="itemsPerPage"
				:items-length="itemsLength"
				:current-page="currentPage"
				:page-count="pageCount"
				@onLineClick="showOrderModal"
				@setCurrentPage="setCurrentPage"
				@setItemsPerPage="setItemsPerPage"
				@updateData="getData"
			/>
			<!-- <v-row class="flex-grow-0">
				<v-col class="d-flex flex-column justify-end align-start">
					<v-btn tile text>
						Сохранить отчет
						<v-icon class="ml-1"> mdi-download-outline </v-icon>
					</v-btn>
				</v-col>
				<v-col>
					<div class="text-end text-h6 font-weight-black">
						Итого: 3 000 ₽
					</div>
					<div class="text-end text-h6 font-weight-bold">
						ЗП грумера: 200 ₽
					</div>
				</v-col>
			</v-row> -->
		</div>
	</div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { posts, postsList, defaultColors } from '@/variables';
import { getExperience } from '@/services/index';
import {
	GColorSelector,
	// GGroomerServicesTable,
	GDetailPageOrdersTable,
} from '@/components';
import API from '@/api';
import { onPhoneInput } from '@/utils/phoneMask';
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

export default {
	name: 'GGroomerDetail',
	components: {
		GColorSelector,
		// GGroomerServicesTable,
		GDetailPageOrdersTable,
	},
	data: () => ({
		// tableType: 'services', // | 'orders'
		tableType: 'orders',
		isLoading: true,
		master: null,
		orders: null,
		avatar: '',
		posts,
		postsList,
		oldMaster: {},
		colors: defaultColors,
		currentPage: 1,
		pageCount: 0,
		itemsPerPage: 15,
		itemsLength: 0,
	}),
	computed: {
		breadcrumbs() {
			if (!this.master) return [];

			const { username, lastname } = this.master;

			return [
				{
					text: 'Груммеры',
					disabled: false,
					// href: '/groomers',
					to: { name: 'g-groomers' },
				},
				{
					text: `${username} ${lastname}`,
					disabled: true,
				},
			];
		},
		isChanged() {
			return !Object.keys(this.oldMaster).every(key => {
				return this.oldMaster[key] === this.master[key];
			});
		},
		imageURl() {
			if (!this.master || !this.master.avatar) return '';

			const { avatar } = this.master;
			return `${API_URL + MEDIAFILES}/${avatar}`;
		},
		pagination() {
			return {
				page: this.currentPage,
				itemsPerPage: this.itemsPerPage,
				pageStart: 0,
				pageStop:
					this.itemsLength - this.currentPage * this.itemsPerPage,
				pageCount: this.pageCount,
				itemsLength: this.itemsLength,
			};
		},
	},
	mounted() {
		this.getData();
	},
	methods: {
		...mapActions(['GET_MASTER_BY_ID', 'UPDATE_MASTER']),
		...mapMutations(['SHOW_ORDER_DETAIL_SHIELD']),
		getExperience,
		async getData() {
			const id = this.$route.params.id;

			const { data } = await this.GET_MASTER_BY_ID({
				id,
				ordersPage: this.currentPage,
				ordersPerPage: this.itemsPerPage,
			});
			const { master, allOrders, orders, ordersSize, ordersPagesSize } = data || {};

			this.master = JSON.parse(JSON.stringify(master));
			this.oldMaster = master;
			// this.orders = allOrders;
			this.isLoading = false;

			this.pageCount = ordersPagesSize;
			this.itemsLength = ordersSize;
			this.orders = orders
		},
		loadImage() {
			this.$refs.avatar.click();
		},
		async onUploadImages({ target }) {
			const file = target.files[0];

			await API.master.uploadAvatar(this.$route.params.id, file);
			this.getData();
		},
		onInputClick(data) {
			console.log('onInputClick', data);
		},
		cancelUpdates() {
			this.master = JSON.parse(JSON.stringify(this.oldMaster));
		},
		async successUpdates() {
			const id = this.$route.params.id;

			const formData = {};

			Object.keys(this.oldMaster).forEach(key => {
				if (this.oldMaster[key] !== this.master[key]) {
					formData[key] = this.master[key];
				}
			});

			const { data: master } = await this.UPDATE_MASTER({ id, formData });

			this.master = JSON.parse(JSON.stringify(master));
			this.oldMaster = master;
		},
		setRate(v) {
			const value = v.replace(/\D/g, '');

			if (this.master.rate === +value) {
				this.master.rate = v;
			}

			setTimeout(() => (this.master.rate = +value), 0);
		},
		setPhone(v) {
			const value = onPhoneInput(v);

			if (this.master.phone === value) {
				this.master.phone = v;
			}

			setTimeout(() => (this.master.phone = value), 0);
		},
		showOrderModal(item) {
			console.log('showOrderModal', item);
			this.SHOW_ORDER_DETAIL_SHIELD(item);
		},
		setCurrentPage(page) {
			this.currentPage = page
		},
		setItemsPerPage(count) {
			this.itemsPerPage = count
		}
	},
};
</script>

<style lang="scss">
.g-groomer-detail {
	p {
		line-height: 1rem !important;
	}

	.text-label {
		display: inline-block;
		font-size: 12px;
		line-height: 14px;
		color: rgba(0, 0, 0, 0.6);
	}
}
</style>
