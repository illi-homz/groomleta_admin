<template>
	<v-row v-if="data" class="user-card">
		<v-col class="flex-grow-0">
			<v-img :src="imageURl" width="126" height="126"></v-img>
		</v-col>
		<v-col class="flex-grow-1">
			<h5 class="text-h5 font-weight-bold text-left mb-4">
				{{data.username}} {{data.lastname}}
			</h5>
			<p class="mb-02 text-caption">Образование</p>
			<p class="mb-3 text-body-1">{{data.education}}</p>
			<p class="mb-02 text-caption">Должность</p>
			<p class="mb-0 text-body-1">{{posts[data.post]}}</p>
		</v-col>
	</v-row>
</template>

<script>
import { posts } from '@/variables';
const API_URL = process.env.VUE_APP_API_URL;
const MEDIAFILES = process.env.VUE_APP_MEDIAFILES;

export default {
	name: 'UserCard',
	data: () => ({
		posts
	}),
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		imageURl() {
			if (!this.data) return '';

			const { avatar } = this.data;

			return `${API_URL + MEDIAFILES}/${avatar}`;
		},
	},
};
</script>

<style lang="scss">
.user-card {
	p {
		line-height: 1rem !important;
	}
}
</style>
