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
							phone
							comment
							animal
							createDate
						}
					}`,
			},
		});
	}

	static createClient(data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'comment') {
				return acc + `${key}: "${data[key]?.replace('\n', '\\n')}"`
			}
			
			return acc + `${key}: "${data[key]}"`
		}, '')
		
		return fetcherGQL({
			key: 'Clients.createClient',
			query: {
				query: `
					mutation {
						createClient(
							clientData: {
								${qStr}
							}
						) {
							client {
								id
							}
							allClients {
								id
								username
								lastname
								phone
								comment
								animal
								createDate
							}
						}
					}`,
			},
		});
	}

	static updateClient(id: number|string, data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'comment') {
				return acc + `${key}: "${data[key]?.replace('\n', '\\n')}"`
			}
			
			return acc + `${key}: "${data[key]}"`
		}, '')
		
		return fetcherGQL({
			key: 'Clients.updateClient',
			query: {
				query: `
					mutation {
						updateClient(
							id: "${id}"
							clientData: {
								${qStr}
							}
						) {
							client {
								id
							}
							allClients {
								id
								username
								lastname
								phone
								comment
								animal
								createDate
							}
						}
					}`,
			},
		});
	}

	static removeClient(id: number|string) {
		return fetcherGQL({
			key: 'Clients.removeClient',
			query: {
				query: `
					mutation {
						removeClient(
							id: "${id}"
						) {
							client {
								id
							}
							allClients {
								id
								username
								lastname
								phone
								comment
								animal
								createDate
							}
							success
						}
					}`,
			},
		});
	}
}

export default Clients;
