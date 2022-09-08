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
							address
							createDate
						}
					}`,
			},
		});
	}

	static createClient(data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'comment') {
				return acc + `${key}: "${data[key]?.replaceAll('\n', '\\n')}"`
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
								address
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
				return acc + `${key}: "${data[key]?.replaceAll('\n', '\\n')}"`
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
								username
								lastname
								phone
								comment
								animal
								createDate
								address
							}
							allClients {
								id
								username
								lastname
								phone
								comment
								animal
								address
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
								address
								createDate
							}
							success
						}
					}`,
			},
		});
	}

	static fetchClientById(id: number | string) {
		if (!id) throw 'Client ID exist';

		return fetcherGQL({
			key: 'client.fetchClientById',
			query: {
				query: `
					query {
						clientById(id: "${id}") {
							client {
								id
								username
								lastname
								phone
								comment
								animal
								createDate
								address
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
}

export default Clients;
