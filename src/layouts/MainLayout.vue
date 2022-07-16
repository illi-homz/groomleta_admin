<template>
	<div class="main-layout">
		<v-app-bar elevation="0" class="white">
			<router-link to="/">
				<div class="d-flex align-center">
					<v-img
						alt="Vuetify Logo"
						class="shrink mr-2"
						contain
						:src="logoIcon"
						transition="scale-transition"
					/>
				</div>
			</router-link>

			<nav class="flex-grow-1 d-flex justify-center">
				<router-link
					v-for="(link, i) in links"
					:key="link.id"
					:to="link.url"
					:class="{ 'mr-4': i !== links.length - 1 }"
					class="body-1 grey--text text--darken-3 text-decoration-none"
				>
					{{ link.title }}
				</router-link>
			</nav>
			<div class="d-flex align-center pointer" @click="logout">
				<v-img alt="logout" class="shrink mr-2" contain :src="logoutIcon" />
				<span>Выйти</span>
			</div>
		</v-app-bar>
		<slot></slot>
	</div>
</template>

<script lang="ts">
export default {
	name: 'MainLayout',
	data: () => ({
		links: [
			{ id: 0, title: 'Главная', url: '/' },
			{ id: 1, title: 'Login', url: '/login' },
		],
		logoIcon: require('../assets/logo.svg'),
		logoutIcon: require('../assets/svg/logout.svg'),
	}),
	methods: {
		logout() {
			console.log('logout');
		},
	},
};
</script>

<style lang="scss">
.main-layout {
}
</style>
