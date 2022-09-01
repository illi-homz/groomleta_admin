import { LoginData } from '@/models/user';
import { fetcherGQL } from '.';

class User {
	static login(data: LoginData) {
		// console.log('data', data)
		const { username, password } = data;

		if (!username && !password) throw 'User data not found';

		return fetcherGQL({
			key: 'User.login',
			query: {
				query: `
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
				}`
			},
		});
	}

	static validateToken(token: string) {
		if (!token) return null

		return fetcherGQL({
			key: 'User.validateToken',
			query: {
				query: `
					mutation {
						verifyToken(token: "${token}") {
							payload
						}
				}`,
			},
		});
	}

	static updateRefreshToken(token: string) {
		if (!token) return null

		return fetcherGQL({
			key: 'User.getRefreshToken',
			query: {
				query: `
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
				`,
			},
		});
	}

	static revokeRefreshToken(token: string) {
		if (!token) return null

		return fetcherGQL({
			key: 'User.logout',
			query: {
				query: `
					mutation {
						revokeToken(
							refreshToken: "${token}",
						)
						{
							revoked
						}
				}`,
			},
		});
	}
}

export default User;
