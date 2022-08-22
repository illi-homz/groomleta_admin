export const orderToTableConvertor = order => {
	const { master, client, products, services } = order;

	const data = {};
	let orderItems = [];

	if (master) data.masterId = master;
	if (client) data.clientId = client;

	if (services?.length)
		orderItems = [
			...orderItems,
			...services?.map(({ count, id, service }) => ({
				count,
				id: service.id,
				orderId: id,
				type: 'service',
			})),
		];
	if (products?.length)
		orderItems = [
			...orderItems,
			...products?.map(({ count, id, product }) => ({
				count,
				id: product.id,
				orderId: id,
				type: 'product',
			})),
		];

	if (orderItems.length) data.orderItems = orderItems;

	return data
};
