import { fetcherGQL } from '.';

export default class Services {
	static fetchAllServices() {
		return fetcherGQL({
			key: 'Services.fetchAllServices',
			query: {
				query: `
					query {
						allServices {
							id
							title
							text
							animal
							price
							time
							img
							category {
								id
								title
							}
							breed {
								id
								title
							}
						}
					}`,
			},
		});
	}
}
