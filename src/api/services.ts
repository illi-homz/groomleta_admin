import { fetcherGQL } from '.';

export default class Services {
	static fetchAllServices() {
		return fetcherGQL({
			key: 'Services.fetchAllServices',
			query: {
				query: `
					query {
						allServices {
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
							allCategories {
								id
								title
							}
							allBreeds {
								id
								title
							}
						}
					}`,
			},
		});
	}

	static createService(data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'text') {
				return acc + `${key}: "${data[key]?.replace('\n', '\\n')}"\n`;
			}

			return acc + `${key}: "${data[key]}"\n`;
		}, '');

		return fetcherGQL({
			key: 'Service.createService',
			query: {
				query: `
					mutation {
						createService (
							serviceData: {
								${qStr}
							}
						) {
							service {
								id
							}
							allServices {
								id
								title
								text
								animal
								price
								time
								category
								breed
							}
							allCategories {
								id
								title
							}
							allBreeds {
								id
								title
							}
						}
					}`,
			},
		});
	}
}
