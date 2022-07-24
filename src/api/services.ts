import { fetcherGQL } from ".";

// const API_URL = process.env.VUE_APP_API_URL;

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
		if (!token) {
			return console.error("token don't exist");
		}

		return fetcherGQL({
			key: 'Services.getServices',
			query: {query: getServicesQuery},
			token,
		});
	}
}
