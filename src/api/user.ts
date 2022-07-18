import { LoginData } from '@/models/user';
const API_URL = process.env.VUE_APP_API_URL;

const token: string = 'sfkjvbdkjfnsdflbndlf';

const query = `
	query {
		allServices {
		id
			title
			text
		}
	}
`;

class User {
	static login(data: LoginData) {
		try {
			return fetch(API_URL + '/graphql/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ query }),
			})
				.then(response => {
					if (!response?.ok) {
						throw new Error(response.statusText);
					}

					return response.json();
				})
				.then(json => json.data)
		} catch (e) {
			console.warn('USER.login exeption:', e);
			return null;
		}
	}
}

export default User;
