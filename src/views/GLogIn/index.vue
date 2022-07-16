<template>
	<div class="g-log-in">
		<h1>Hello Grummer</h1>
	</div>
</template>

<script lang="ts">
import './styles.scss';
import { mapGetters } from 'vuex';

export default {
	name: 'GLogIn',
	data: () => ({
	}),
	computed: {
		...mapGetters(['TOKEN']),
	},
	created() {
		// document.title = 'Авторизация'
	},
	mounted() {
		console.log('TOKEN', this.TOKEN)
	},
};
</script>

