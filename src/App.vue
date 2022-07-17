<template>
	<v-app>
		<component :is="layout">
			<router-view />
		</component>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import EmptyLayout from './layouts/EmptyLayout.vue';
import MainLayout from './layouts/MainLayout.vue';
import './assets/styles/index.scss';

export default Vue.extend({
	name: 'App',
	components: {
		EmptyLayout,
		MainLayout,
	},
	computed: {
		layout() {
			const layout = this.$route.meta?.layout || 'empty';
			return `${layout}-layout`;
		},
	},
});
</script>
