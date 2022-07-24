import { LoginData } from '@/models/user';
import { fetcherGQL } from '.';
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

		if (!username && !password) throw new Error('User data not found');

		return fetcherGQL({
			key: 'User.login',
			query: {
				query: loginQuery({
					username,
					password,
				}),
			},
		});
	}
}

export default User;
