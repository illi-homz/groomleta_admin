import { LoginData } from '@/models/user';
import { fetcherGQL } from '.';

class User {
	static login(data: LoginData) {
		const { username, password } = data;

		if (!username && !password) throw 'User data not found';

		return fetcherGQL({
			key: 'User.login',
			query: {
				query: getAccessTokenMutation({
					username,
					password,
				}),
			},
		});
	}

	static validateToken(token: string) {
		if (!token) return null

		return fetcherGQL({
			key: 'User.validateToken',
			query: {
				query: validateRefreshTokenMutation(token),
			},
		});
	}

	static updateRefreshToken(token: string) {
		if (!token) return null

		return fetcherGQL({
			key: 'User.getRefreshToken',
			query: {
				query: updateRefreshTokenMutation(token),
			},
		});
	}

	static revokeRefreshToken(token: string) {
		if (!token) return null

		return fetcherGQL({
			key: 'User.logout',
			query: {
				query: revokeRefreshTokenMutation(token),
			},
		});
	}
}

export default User;

const getAccessTokenMutation = ({ username, password }: LoginData) => `
	mutation {
		tokenAuth(
			username: "${username}",
			password: "${password}"
		)
		{
			token
			payload
			refreshExpiresIn
			refreshToken
		}
}`;

const updateRefreshTokenMutation = (token: string) => `
	mutation {
		refreshToken(
			refreshToken: "${token}",
		) {
			token
			payload
			refreshExpiresIn
			refreshToken
		}
	}
`

const revokeRefreshTokenMutation = (token: string) => `
	mutation {
		revokeToken(
			refreshToken: "${token}",
		)
		{
			revoked
		}
}`;

const validateRefreshTokenMutation = (token: string) => `
	mutation {
		verifyToken(token: "${token}") {
			payload
		}
}`;