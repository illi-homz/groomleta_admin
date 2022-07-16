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

router.beforeEach((to, from, next) => {
	const token = store.getters.TOKEN;
	const { path: fromPath } = from;
	const { matched: toMatched, meta } = to;

	const requiresAuth = toMatched.some(record => record.meta.requiresAuth);

	if (requiresAuth && !token) {
		fromPath !== '/login' && router.push('/login');
		return;
	}

	document.title = meta?.title || 'Админ панель Groomleta';

	next();
});

export default router;
