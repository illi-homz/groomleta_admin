<template>
	<div class="main-layout d-flex flex-column">
		<v-app-bar elevation="0" class="white flex-grow-0">
			<router-link to="/">
				<div class="d-flex align-center">
					<v-img
						alt="Vuetify Logo"
						class="shrink mr-2"
						contain
						:src="require('../assets/logo.svg')"
						transition="scale-transition"
					/>
				</div>
			</router-link>

			<nav class="flex-grow-1 d-flex justify-center">
					<router-link
					v-for="(link) in links"
					:key="link.id"
					:to="link.url"
					class="text-decoration-none px-10 main-layout__border-bottom-on-hover"
					>
						<span
							class="body-1 grey--text text--darken-3 d-block main-layout__nav-link"
						>
							{{ link.title }}
						</span>
					</router-link>
			</nav>
			<div class="d-flex align-center pointer" @click="logout">
				<v-img
					alt="logout"
					class="shrink mr-2"
					contain
					:src="require('../assets/svg/logout.svg')"
				/>
				<span>Выйти</span>
			</div>
		</v-app-bar>
		<div class="px-8 pb-8 flex-grow-1 d-flex flex-column">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';

export default {
	name: 'MainLayout',
	data: () => ({
		links: [
			{ id: 0, title: 'Календарь', url: '/' },
			{ id: 1, title: 'Склад', url: '/stock' },
			{ id: 2, title: 'Заказы', url: '/orders' },
			{ id: 3, title: 'Клиенты', url: '/clients' },
			{ id: 4, title: 'Отзывы', url: '/feedbacks' },
			{ id: 5, title: 'Грумеры', url: '/groomers' },
		],
		logoIcon: require('../assets/logo.svg'),
		logoutIcon: require('../assets/svg/logout.svg'),
	}),
	methods: {
		...mapActions(['LOGOUT']),
		async logout() {
			const { status } = await this.LOGOUT();

			if (status === 'success') {
				this.$router.push('/login');
			}
		},
	},
};
</script>

<style lang="scss">
.main-layout {
	flex: 1;

	&__border-bottom-on-hover {
		&:hover {
			.main-layout__nav-link {
				border-bottom-color: #243138;
			}
		}
	}

	&__nav-link {
		border-width: 2px;
		border-color: transparent;
		border-style: solid;
		transition: all .2s ease;
	}
}
</style>
