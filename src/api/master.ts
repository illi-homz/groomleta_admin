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
							}
							allEvents {
								id
							}
							allOrders {
								id
							}
						}
					}
				`,
			},
		});
	}

	static createMaster(data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'comment') {
				return acc + `${key}: "${data[key]?.replace('\n', '\\n')}"\n`;
			}

			return acc + `${key}: "${data[key]}"\n`;
		}, '');

		console.log('qStr', qStr);

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

		try {
			return fetch(API_URL + '/api/upload-master-avatar', {
				method: 'POST',
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
