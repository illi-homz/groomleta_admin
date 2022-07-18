<template>
	<div class="empty-layout flex-grow-1">
		<v-app-bar
			elevation="0"
			app
			class="white"
		>
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
		</v-app-bar>
		<div
			class="empty-layout__container d-flex flex-column justify-center align-center"
		>
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'EmptyLayout',
	data: () => ({
		// logoIcon: require('../assets/logo.svg'),
	}),
};
</script>

<style lang="scss">
.empty-layout {
	// flex: 1;

	&__container {
		height: 100%;
	}
}
</style>
