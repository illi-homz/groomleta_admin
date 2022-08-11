import { fetcherGQL } from '.';

class Events {
	static getEvents() {
		return fetcherGQL({
			key: 'Events.getEvents',
			query: {
				query: `
					query {
						allEvents {${eventProps}}
					}`,
			},
		});
	}

	static createEvent({
		title,
		startDate,
		endDate,
		services,
		client,
		master,
		comment,
	}: EventType) {
		return fetcherGQL({
			key: 'Events.getEvents',
			query: {
				query: `
					mutation {
						createEvent(
							eventData: {
								title: "${title}"
								startDate: "${startDate}"
								endDate: "${endDate}"
								services: [${services?.join(',') || ''}]
								client: "${client || ''}"
								master: "${master || ''}"
								comment: "${comment?.replaceAll('\n', '\\n')}"
							}
						  ) {
							event {${eventProps}}
						}
					}`,
			},
		});
	}

	static updateEvent({ id, data }: { id: number | string; data: any }) {
		if (!id || !data) {
			return console.warn('event id or data is undefined');
		}

		const qStr = Object.keys(data).reduce((acc: string, dataKey: any) => {
			if (dataKey === 'services') {
				return acc + `\nservices: [${data.services.join(',') || ''}]`;
			}
			if (dataKey === 'comment') {
				return (
					acc +
					`\ncomment: "${data.comment?.replaceAll('\n', '\\n')}"`
				);
			}

			return acc + `\n${dataKey}: "${data[dataKey] || ''}"`;
		}, '');

		return fetcherGQL({
			key: 'Events.getEvents',
			query: {
				query: `
					mutation {
						updateEvent(
							id: "${id}"
							eventData: {${qStr}}
						) {
							event {${eventProps}}
						}
					}`,
			},
		});
	}
	static removeEvent(id: number | any) {
		if (!id) {
			return console.warn('event id is undefined');
		}

		return fetcherGQL({
			key: 'Events.getEvents',
			query: {
				query: `
					mutation {
						removeEvent(
							id: "${id}"
						) {
							event {${eventProps}}
						}
					}`,
			},
		});
	}
}

export default Events;

type EventType = {
	id?: string | number;
	title?: string;
	startDate?: string;
	endDate?: string;
	services?: Array<string | number>;
	client?: string;
	master?: string;
	comment?: string;
};

const eventProps = `
id
title
startDate
endDate
client {
	id
	username
	lastname
}
services {
	id
	title
	breed {
		id
		title
	}
}
master {
	id
	username
	lastname
	color
}
comment
createDate
`;
