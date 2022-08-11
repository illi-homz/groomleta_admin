import { fetcherGQL } from ".";

class Products {
	static getProducts() {
		return fetcherGQL({
			key: 'Products.getProducts',
			query: {
				query: `
					query {
						allProducts {
							id
							title
							vendorCode
							count
							price
							description
						}
					}`,
			},
		});
	}
	static createProduct(data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'description') {
				return acc + `${key}: "${data[key]?.replace('\n', '\\n')}"`
			}

			if (typeof data[key] === 'number') {
				return acc + `${key}: ${data[key]}`
			}
			
			return acc + `${key}: "${data[key]}"`
		}, '')
		
		return fetcherGQL({
			key: 'Products.createProduct',
			query: {
				query: `
					mutation {
						createProduct(
							productData: {
								${qStr}
							}
						) {
							product {
								id
							}
							allProducts {
								id
								title
								vendorCode
								count
								price
								description
							}
						}
					}`,
			},
		});
	}

	static updateProduct(id: number|string, data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'description') {
				return acc + `${key}: "${data[key]?.replace('\n', '\\n')}"`
			}
			
			if (typeof data[key] === 'number') {
				return acc + `${key}: ${data[key]}`
			}
			
			return acc + `${key}: "${data[key]}"`
		}, '')
		
		return fetcherGQL({
			key: 'Products.updateProduct',
			query: {
				query: `
					mutation {
						updateProduct(
							id: "${id}"
							productData: {
								${qStr}
							}
						) {
							product {
								id
							}
							allProducts {
								id
								title
								vendorCode
								count
								price
								description
							}
						}
					}`,
			},
		});
	}

	static removeProduct(id: number|string) {
		return fetcherGQL({
			key: 'Products.removeProduct',
			query: {
				query: `
					mutation {
						removeProduct(
							id: "${id}"
						) {
							product {
								id
							}
							allProducts {
								id
								title
								vendorCode
								count
								price
								description
							}
							success
						}
					}`,
			},
		});
	}
}

export default Products