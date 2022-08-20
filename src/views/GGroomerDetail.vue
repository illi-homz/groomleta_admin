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
				<v-col cols="1" class="flex-grow-0">
					<v-img
						:src="imageURl"
						width="126"
						height="126"
						class="pointer"
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
						@click="onInputClick"
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
						<v-col cols="4">
							<v-text-field
								v-model="master.education"
								class="text-h5"
								label="Образование"
								color="#FFC11C"
								light
							/>
						</v-col>
						<v-col cols="4">
							<v-text-field
								v-model="master.comment"
								class="text-h5"
								label="Дополнительно"
								color="#FFC11C"
								light
							/>
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
				<v-tab @click="tableType = 'services'">Услуги</v-tab>
				<v-tab @click="tableType = 'orders'">Заказы</v-tab>
			</v-tabs>
			<v-divider />
			<GGroomerServicesTable
				v-if="tableType === 'services' && !!orders"
				:orders="orders"
				class="flex-grow-1"
			/>
			<GGroomerOrdersTable
				v-if="tableType === 'orders' && !!orders"
				:orders="orders"
				class="flex-grow-1"
			/>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import { posts, postsList, defaultColors } from '@/variables';
import { getExperience } from '@/services/index';
import { GColorSelector, GGroomerServicesTable, GGroomerOrdersTable } from '@/components';
import API from '@/api';
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

export default {
	name: 'GGroomerDetail',
	components: { GColorSelector, GGroomerServicesTable, GGroomerOrdersTable },
	data: () => ({
		tableType: 'services', // | 'orders'
		isLoading: true,
		master: null,
		orders: null,
		avatar: '',
		posts,
		postsList,
		oldMaster: {},
		colors: defaultColors,
	}),
	computed: {
		breadcrumbs() {
			if (!this.master) return [];

			const { username, lastname } = this.master;

			return [
				{
					text: 'Груммеры',
					disabled: false,
					href: '/groomers',
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
			if (!this.master) return '';
			const { avatar } = this.master;
			return `${API_URL + MEDIAFILES}/${avatar}`;
		},
	},
	mounted() {
		this.getData();
	},
	methods: {
		...mapActions(['GET_MASTER_BY_ID', 'UPDATE_MASTER']),
		getExperience,
		async getData() {
			const id = this.$route.params.id;

			const {
				data: { master, allOrders },
			} = await this.GET_MASTER_BY_ID(id);
			this.master = JSON.parse(JSON.stringify(master));
			this.oldMaster = master;
			this.orders = allOrders;

			this.isLoading = false;
		},
		loadImage() {
			this.$refs.avatar.click();
		},
		async onUploadImages({ target }) {
			await API.master.uploadAvatar(
				this.$route.params.id,
				target.files[0],
			);
			this.getData();
		},
		onInputClick(data) {
			console.log('onInputClick', data);
		},
		setRate(v) {
			const value = v.replace(/\D/g, '');

			if (this.master.rate === +value) {
				this.master.rate = v;
			}

			setTimeout(() => (this.master.rate = +value), 0);
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

			console.log('formData', formData)

			const { data: master } = await this.UPDATE_MASTER({ id, formData });

			this.master = JSON.parse(JSON.stringify(master));
			this.oldMaster = master;
		},
	},
};
</script>

<style lang="scss">
.g-groomer-detail {
	p {
		line-height: 1rem !important;
	}
}
</style>
