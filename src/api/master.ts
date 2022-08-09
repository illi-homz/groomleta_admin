import { fetcherGQL } from '.';

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
						grooberById(id: "${id}") {
							id
							username
							lastname
							avatar
							education
							phone
							post
							createDate
						}
					}
				`,
			},
		});
	}
}

export default Master;
