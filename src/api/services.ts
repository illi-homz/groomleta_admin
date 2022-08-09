import { fetcherGQL } from '.';

export default class Services {
	static getServices() {
		return fetcherGQL({
			key: 'Services.getServices',
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
