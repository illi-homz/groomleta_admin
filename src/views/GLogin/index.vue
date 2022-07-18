<template>
	<v-card
		class="g-login d-flex flex-column"
		color="white"
		elevation="0"
		height="320"
		width="327"
	>
		<div class="text-h4 text-center">Вход</div>
		<div class="flex-grow-1">
			<v-text-field
				ref="login"
				v-model="login"
				label="Логин"
				:rules="[() => !!login || 'Введите логин']"
				color="rgba(36, 49, 56, 0.38)"
			/>
			<v-text-field
				ref="password"
				v-model="password"
				label="Пароль"
				type="password"
				:rules="[
					v => !!v || 'Введите пароль',
					v => v.length > 5 || 'Короткий пароль',
				]"
				color="rgba(36, 49, 56, 0.38)"
			/>
		</div>
		<v-btn x-large color="#FFC11C" @click="onLogin">Войти</v-btn>
	</v-card>
</template>

<script lang="ts">
import './styles.scss';
import validator from '@/services/validator';
import { mapActions } from 'vuex';
// const URL = process.env.BASE_URL
// const URL = process.env.API_URL

export default {
	name: 'GLogin',
	data: () => ({
		login: '',
		password: '',
	}),
	computed: {
		form() {
			return {
				login: this.login,
				password: this.password,
			};
		},
	},
	methods: {
		...mapActions(['LOGIN']),
		async onLogin() {
			// const formHasErrors = validator.call(this, this.form)
			// if (formHasErrors) return;

			const response = await this.LOGIN({
				login: this.login,
				password: this.password,
			});

			// console.log('responseresponse', response);

			if (response.status === 'success') {
				this.$router.push('/');
			}
		},
	},
};
</script>
