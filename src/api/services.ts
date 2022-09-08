import Vue from 'vue';
import { fetcherGQL } from '.';
const API_URL = process.env.VUE_APP_API_URL;

export default class Services {
	static fetchAllServices() {
		return fetcherGQL({
			key: 'Services.fetchAllServices',
			query: {
				query: `
					query {
						allServices {
							${allServices}
						}
					}`,
			},
		});
	}

	static createService(data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'text') {
				return acc + `${key}: "${data[key]?.replaceAll('\n', '\\n')}"\n`;
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
							${allServices}
						}
					}`,
			},
		});
	}

	static updateService(id: number|string, data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'text') {
				return acc + `${key}: "${data[key]?.replaceAll('\n', '\\n')}"\n`;
			}

			return acc + `${key}: "${data[key]}"\n`;
		}, '');

		return fetcherGQL({
			key: 'Service.updateService',
			query: {
				query: `
					mutation {
						updateService (
							id: "${id}"
							serviceData: {
								${qStr}
							}
						) {
							${allServices}
						}
					}`,
			},
		});
	}

	static uploadImage(id: any, img: File) {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('file', img);

		const token = Vue.$cookies.get('JWTToken');

		try {
			return fetch(API_URL + '/api/upload-service-img', {
				method: 'POST',
				headers: {
					Authorization: `JWT ${token || ''}`,
				},
				body: formData,
			})
				.then(response => response.json())
				.catch(e => {
					console.log('Services.uploadImage response:', e);
					return { master: null };
				});
		} catch (e) {
			console.log('Services.uploadImage response:', e);
			return { master: null };
		}
	}

	static removeService(id: number|string) {
		return fetcherGQL({
			key: 'Products.removeService',
			query: {
				query: `
					mutation {
						removeService(
							id: "${id}"
						) {
							success
						}
					}`,
			},
		});
	}
}

const allServices = `
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
`