import store from '@/store';
import Vue from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import * as Views from '../views/index';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'g-calendar',
		meta: {
			title: 'Календарь',
			requiresAuth: true,
			layout: 'main',
		},
		component: Views.GCalendar,
	},
	{
		path: '/login',
		name: 'g-login',
		meta: {
			title: 'Авторизация',
			requiresAuth: false,
			layout: 'empty',
		},
		component: Views.GLogIn,
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach(async (to, from, next) => {
	const isAuth = await store.dispatch('CHECK_USER')

	const { path: fromPath } = from;
	const { matched: toMatched, meta, path: toPath } = to;

	const requiresAuth = toMatched.some(record => record.meta.requiresAuth);

	if (requiresAuth && !isAuth) {
		fromPath !== '/login' && router.push('/login');
		return;
	}

	if (isAuth && toPath === '/login') {
		router.push('/')
		return
	}

	document.title = meta?.title || 'Админ панель Groomleta';

	next();
});

export default router;
