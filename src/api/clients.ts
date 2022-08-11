import { fetcherGQL } from '.';

class Clients {
	static fetchAllClients() {
		return fetcherGQL({
			key: 'Clients.fetchAllClients',
			query: {
				query: `
					query {
						allClients {
							id
							username
							lastname
							avatar
							phone
							comment
							createDate
						}
					}`,
			},
		});
	}
}

export default Clients;
