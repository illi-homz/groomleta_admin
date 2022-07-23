import Services from '@/api/services'
import Vue from 'vue';

export default {
	state: () => ({
	}),
	mutations: {
	},
	actions: {
		async GET_SERVICES({ commit }: { commit: Function }) {
			const token = Vue.$cookies.get('JWT')
			if (!token) throw new Error('Token exist')

			const services = await Services.getServices(token)
			console.log('services', services)

			return {
				status: 'success',
				ok: true,
			};
		},
	},
	getters: {
	},
};
