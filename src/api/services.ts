const API_URL = process.env.VUE_APP_API_URL;

const getServicesQuery = `
query {
	allServices {
		id,
		title
	}
}
`;

export default class Services {
	static getServices(token: string) {
		try {
			if (!token) {
				return console.error("token don't exist");
			}

			return fetch(API_URL + '/graphql/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`,
				},
				body: JSON.stringify({
					query: getServicesQuery,
				}),
			})
				.then(response => {
					if (!response?.ok) {
						throw new Error(response.statusText);
					}

					console.log('getServices response', response);

					return response.json();
				})
				.then(json => json.data);
		} catch (e) {
			console.warn('Services.getServices exeption:', e);
			return null;
		}
	}
}
