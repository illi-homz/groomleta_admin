import { DefaultCreateOrderDataType } from '@/models/order';
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

	static fetchOrderById(id: number | string) {
		if (!id) throw 'Groomer ID exist';

		return fetcherGQL({
			key: 'Order.fetchOrderById',
			query: {
				query: `
					query {
						orderById(id: "${id}") {
							${orderParams}
						}
					}
				`,
			},
		});
	}

	static createOrder(orderData: DefaultCreateOrderDataType) {
		return fetcherGQL({
			key: 'Order.createOrder',
			query: {
				query: `
					mutation {
						createOrder(
							orderData: {
								services: [${orderData.services
									?.map(
										el =>
											`{
												id: "${el.id || ''}",
												serviceId: ${el.serviceId},
												count: ${el.count} 
											}`,
									)
									.join(',')}]
								products: [${orderData.products
									?.map(
										el =>
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
								isSuccess: ${orderData.isSuccess}
							}
						) {
							order {
								${orderParams}
							}
						}
					}
				`,
			},
		});
	}

	static payOrder(id: number) {
		if (!id) return;

		return fetcherGQL({
			key: 'Order.payOrder',
			query: {
				query: `
					mutation {
						payOrder(
							id: ${id}
						) {
							order {
								${orderParams}
							}
							success
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
	service { id }
}
products {
	id
	count
	product { id }
}
isSuccess
updateDate
createDate
`;
