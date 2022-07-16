interface UserState {
    token: string | null,
  }

export default {
	state: (): UserState => ({
		token: 'dfbdfbdfbdfeqr3drt43434dt34',
		// token: null,
	}),
	mutations: {},
	actions: {},
    getters: {
		TOKEN: (s: UserState) => s.token,
	},
};
