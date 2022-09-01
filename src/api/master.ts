import Vue from 'vue';
import { fetcherGQL } from '.';
const API_URL = process.env.VUE_APP_API_URL;

// comment
class Master {
	static fetchAllMasters() {
		return fetcherGQL({
			key: 'Master.fetchAllMasters',
			query: {
				query: `
					query {
						allGroomers {
							id
							username
							lastname
							avatar
							education
							phone
							post
							color
							createDate
							address
							rate
						}
					}
				`,
			},
		});
	}

	static fetchMasterById(id: number | string) {
		if (!id) throw 'Groomer ID exist';

		return fetcherGQL({
			key: 'Master.fetchMasterById',
			query: {
				query: `
					query {
						masterById(id: "${id}") {
							master {
								id
								username
								lastname
								avatar
								education
								phone
								post
								color
								createDate
								address
								rate
								comment
							}
							allOrders {
								id
								services {
									count
									service {
										id
										title
										price
									}
								}
								products {
									count
									product {
										id
										title
										price
									}
								}
								master {
									id
									username
									lastname
								}
								client {
									id
									username
									lastname
								}
								price
								isSuccess
								isCancel
								isReserved
								updateDate
							}
						}
					}
				`,
			},
		});
	}

	static createMaster(data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'rate') {
				return acc + `${key}: ${data[key]}\n`;
			}

			if (key === 'comment') {
				return acc + `${key}: "${data[key]?.replace('\n', '\\n')}"\n`;
			}

			return acc + `${key}: "${data[key]}"\n`;
		}, '');

		return fetcherGQL({
			key: 'Master.createMaster',
			query: {
				query: `
					mutation {
						createMaster (
							masterData: {
								${qStr}
							}
						) {
							master {
								id
							}
							allMasters {
								id
								username
								lastname
								avatar
								education
								phone
								post
								color
								createDate
								address
								rate
							}
						}
					}`,
			},
		});
	}

	static updateMaster(id: any, data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'rate') {
				return acc + `${key}: ${data[key]}\n`;
			}

			if (key === 'comment') {
				return acc + `${key}: "${data[key]?.replace('\n', '\\n')}"\n`;
			}

			return acc + `${key}: "${data[key]}"\n`;
		}, '');

		return fetcherGQL({
			key: 'Master.updateMaster',
			query: {
				query: `
					mutation {
						updateMaster (
							id: "${id}",
							masterData: {
								${qStr}
							}
						) {
							master {
								id
								username
								lastname
								avatar
								education
								phone
								post
								color
								createDate
								address
								rate
								comment
							}
							allMasters {
								id
								username
								lastname
								avatar
								education
								phone
								post
								color
								createDate
								address
								rate
							}
						}
					}`,
			},
		});
	}

	static uploadAvatar(id: any, avatar: File) {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('file', avatar);

		const token = Vue.$cookies.get('JWTToken');

		try {
			return fetch(API_URL + '/api/upload-master-avatar', {
				method: 'POST',
				headers: {
					Authorization: `JWT ${token || ''}`,
				},
				body: formData,
			})
				.then(response => {
					console.log('response', response)
					return response.json()
				})
				.then(json => {
					console.log('json', json);
					return json;
				})
				.catch(e => {
					console.log('Master.uploadAvatar response:', e);
					return { master: null };
				});
		} catch (e) {
			console.log('Master.uploadAvatar response:', e);
			return { master: null };
		}
	}
}

export default Master;
