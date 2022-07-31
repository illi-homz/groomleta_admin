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
			></v-progress-circular>
		</div>
		<div v-else class="flex-grow-1 d-flex flex-column">
			<v-breadcrumbs :items="breadcrumbs">
				<template v-slot:divider>
					<v-icon>mdi-chevron-right</v-icon>
				</template>
			</v-breadcrumbs>
			<UserCard :data="groomer" />
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import { UserCard } from '@/components';

export default {
	name: 'GGroomerDetail',
	components: { UserCard },
	mounted() {
		this.getData();
	},
	data: () => ({
		isLoading: true,
		groomer: null,
	}),
	computed: {
		breadcrumbs() {
			if (!this.groomer) return [];

			const {username, lastname} = this.groomer

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
	},
	methods: {
		...mapActions(['GET_MASTER_BY_ID']),
		async getData() {
			const id = this.$route.params.id;

			const { data: groomer } = await this.GET_MASTER_BY_ID(id);
			this.groomer = groomer;
			console.log('groomer', groomer);

			setTimeout(() => {
				this.isLoading = false;
			}, 1000);
		},
	},
};
</script>

<style lang="scss">
.g-groomer-detail {
}
</style>
