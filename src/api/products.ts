import Vue from 'vue';
const API_URL = process.env.VUE_APP_API_URL;
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
							img
						}
					}`,
			},
		});
	}

	static createProduct(data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'description') {
				return acc + `${key}: "${data[key]?.replaceAll('\n', '\\n')}"`
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
								img
							}
						}
					}`,
			},
		});
	}

	static updateProduct(id: number|string, data: any) {
		const qStr = Object.keys(data).reduce((acc: any, key: string) => {
			if (key === 'description') {
				return acc + `${key}: "${data[key]?.replaceAll('\n', '\\n')}"`
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
								img
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
								img
							}
							success
						}
					}`,
			},
		});
	}

	static uploadImage(id: any, img: File) {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('file', img);

		const token = Vue.$cookies.get('JWTToken');

		try {
			return fetch(API_URL + '/api/upload-product-img', {
				method: 'POST',
				headers: {
					Authorization: `JWT ${token || ''}`,
				},
				body: formData,
			})
				.then(response => response.json())
				.catch(e => {
					console.log('Products.uploadImage response:', e);
					return { master: null };
				});
		} catch (e) {
			console.log('Products.uploadImage response:', e);
			return { master: null };
		}
	}
}

export default Products