import { fetcherGQL } from '.';

class Master {
	static fetchAllMasters() {
		return fetcherGQL({
			key: 'Master.fetchAllMasters',
			query: {
				query: all_groomers,
			},
		});
	}

	static fetchMasterById(id: number | string) {
		if (!id) throw 'Groomer ID exist';

		return fetcherGQL({
			key: 'Master.fetchMasterById',
			query: {
				query: grooberById(id),
			},
		});
	}
}

export default Master;

const grooberById = (id: string | number) => `
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
}`;

const all_groomers = `
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
}`;
