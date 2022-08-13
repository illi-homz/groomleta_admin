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
			<v-row v-if="master" class="user-card">
				<v-col cols="1" class="flex-grow-0">
					<v-img
						:src="imageURl"
						width="126"
						height="126"
						@click="loadImage"
						class="pointer"
					/>
				</v-col>
				<v-col class="flex-grow-1">
					<h5 class="text-h5 font-weight-bold text-left mb-4">
						{{ master.username }} {{ master.lastname }}
					</h5>
					<p class="mb-02 text-caption">Образование</p>
					<p class="mb-3 text-body-1">{{ master.education }}</p>
					<p class="mb-02 text-caption">Должность</p>
					<p class="mb-0 text-body-1">{{ posts[master.post] }}</p>
				</v-col>
			</v-row>
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
		</div>
	</div>
</template>

<script>
import { posts } from '@/variables';
import { mapActions } from 'vuex';
import API from '@/api';
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

export default {
	name: 'GGroomerDetail',
	data: () => ({
		isLoading: true,
		master: null,
		events: null,
		orders: null,
		avatar: '',
		posts,
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
		...mapActions(['GET_MASTER_BY_ID']),
		async getData() {
			const id = this.$route.params.id;

			const {
				data: { master, allEvents, allOrders },
			} = await this.GET_MASTER_BY_ID(id);
			this.master = master;
			this.events = allEvents;
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
