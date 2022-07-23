import { LoginData } from '@/models/user';
const API_URL = process.env.VUE_APP_API_URL;

const loginQuery = ({
	username,
	password,
}: {
	username: string;
	password: string;
}) => {
	return `
	mutation {
		tokenAuth(
			username: "${username}",
			password: "${password}"
		)
		{
			token
			payload
			refreshExpiresIn
		}
	}`;
};

class User {
	static login(data: LoginData) {
		const { login: username, password } = data;
		console.log('username, password', username, password)

		try {
			return fetch(API_URL + '/graphql/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: loginQuery({
						username,
						password,
					}),
				}),
			})
				.then(response => {
					if (!response?.ok) {
						throw new Error(response.statusText);
					}
					// console.log('response', response);

					return response.json();
				})
				.then(json => {
					console.log('json.data', json.data)
					return json.data
				});
		} catch (e) {
			console.warn('User.login exeption:', e);
			return null;
		}
	}
}

export default User;
