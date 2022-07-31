// import {default as User} from './user'
import User from './user';
import Master from './master';
import Services from './services';
import Vue from 'vue';
const API_URL = process.env.VUE_APP_API_URL;

export const fetcherGQL = ({
	key = '',
	query = {},
}: {
	key: string,
	query: Object,
}) => {
	const token = Vue.$cookies.get('JWT');
	if (!token) throw new Error('Token exist');
	
	try {
		return fetch(API_URL + '/graphql/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `JWT ${token || ''}`,
			},
			body: JSON.stringify(query),
		})
			.then(response => {
				if (!response?.ok) {
					throw new Error(response.statusText);
				}
				return response.json();
			})
			.then(json => {
				return json.data;
			})
			.catch(e => {
				console.warn(`${key} exeption:`, e);
				return null;
			})
	} catch (e) {
		console.warn(`${key} exeption:`, e);
		return null;
	}
};

export default {
	user: User,
	master: Master,
	services: Services,
};
