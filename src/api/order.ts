import { FetchOrdersParamsType, DefaultCreateOrderDataType } from '@/types/orders';
import { fetcherGQL } from '.';

class Order {
	static fetchAllOrders() {
		return fetcherGQL({
			key: 'Order.fetchAllOrders',
			query: {
				query: `
					query {
						allOrders {
							${orderParams}
						}
					}
				`,
			},
		});
	}

	static fetchOrders({
		page,
		objectsPerPage = 15,
		sort = 'asc',
	}: FetchOrdersParamsType) {
		return fetcherGQL({
			key: 'Order.fetchOrders',
			query: {
				query: `
					query {
						orders(
							page: ${page},
							objectsPerPage: ${objectsPerPage},
							sort: "${sort}"
						) {
							nodes {
								${orderParams}
							}
							nodesSize
							pageCount
						}
					}
				`,
			},
		});
	}

	// static fetchOrderById(id: number | string) {
	// 	if (!id) throw 'Groomer ID exist';

	// 	return fetcherGQL({
	// 		key: 'Order.fetchOrderById',
	// 		query: {
	// 			query: `
	// 				query {
	// 					orderById(id: "${id}") {
	// 						${orderParams}
	// 					}
	// 				}
	// 			`,
	// 		},
	// 	});
	// }

	static createOrder(orderData: DefaultCreateOrderDataType) {
		return fetcherGQL({
			key: 'Order.createOrder',
			query: {
				query: `
					mutation {
						createOrder(
							orderData: {
								${orderDataCreator(orderData)}
							}
						) {
							order {
								${orderParams}
							}
							allOrders {
								${orderParams}
							}
						}
					}
				`,
			},
		});
	}

	static payForOrder(id: number) {
		if (!id) return;

		return fetcherGQL({
			key: 'Order.payForOrder',
			query: {
				query: `
					mutation {
						payForOrder(
							id: ${id}
						) {
							order {
								${orderParams}
							}
							allOrders {
								${orderParams}
							}
						}
					}
				`,
			},
		});
	}

	static updateAndPayOrder(id: number, orderData: any) {
		if (!id) return;

		return fetcherGQL({
			key: 'Order.updateAndPayOrder',
			query: {
				query: `
					mutation {
						updateAndPayOrder(
							id: ${id}
							orderData: {
								${orderDataCreator(orderData)}
							}
						) {
							order {
								${orderParams}
							}
							allOrders {
								${orderParams}
							}
						}
					}
				`,
			},
		});
	}

	static cancelOrder(id: number) {
		if (!id) return;

		return fetcherGQL({
			key: 'Order.cancelOrder',
			query: {
				query: `
					mutation {
						cancelOrder(
							id: ${id}
						) {
							order {
								${orderParams}
							}
							allOrders {
								${orderParams}
							}
						}
					}
				`,
			},
		});
	}
}

export default Order;

const orderParams = `
id
price
client { id }
master { id }
services {
	id
	count
	service {
		id
		title
		price
	}
}
products {
	id
	count
	product {
		id
		title
		price
	}
}
isSuccess
isCancel
isReserved
updateDate
createDate
`;

const orderDataCreator = (orderData: any) => `
	services: [${orderData.services
		?.map(
			(el: any) =>
				`{
					id: "${el.id || ''}",
					serviceId: ${el.serviceId},
					count: ${el.count} 
				}`,
		)
		.join(',')}]
	products: [${orderData.products
		?.map(
			(el: any) =>
				`{
					id: "${el.id || ''}",
					productId: ${el.productId},
					count: ${el.count} 
				}`,
		)
		.join(',')}]
	client: "${orderData.clientId || ''}"
	master: "${orderData.masterId || ''}"
	price: ${orderData.price}
	isSuccess: ${orderData.isSuccess || false}
	isReserved: ${orderData.isReserved || false}
`;
