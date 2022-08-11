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
}

export default Products