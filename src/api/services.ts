import { fetcherGQL } from ".";

const getServicesQuery = `
query {
	allServices {
		id,
		title
	}
}
`;

export default class Services {
	static getServices() {
		return fetcherGQL({
			key: 'Services.getServices',
			query: {query: getServicesQuery},
		});
	}
}
