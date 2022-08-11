export const convertTimestampToLocalDateTime = (timestamp: number | Date): string => {
	const nativeDate = new Date(timestamp);
	const date = nativeDate.toLocaleDateString().split('.').reverse().join('-');
	const time = nativeDate.toLocaleTimeString();

	return `${date}T${time}`;
};

export const getDeffData = (nativeEvent: any, currentSelectedEvent: any) => {
	return Object.keys(nativeEvent)?.reduce((acc: Object, key: string) => {
		if (key === 'services') {
			const currentSelectedEventIds = currentSelectedEvent.services?.map(
				(el: any) => el.id,
			);
			const nativeEventIds = nativeEvent.services?.map((el: any) => el.id);
			if (
				nativeEventIds.join(',') !== currentSelectedEventIds.join(',')
			) {
				return { ...acc, [key]: currentSelectedEventIds };
			}
			return acc;
		}
		if (key === 'client') {
			if (nativeEvent.client?.id !== currentSelectedEvent.client?.id) {
				return { ...acc, [key]: currentSelectedEvent.client?.id };
			}
			return acc;
		}
		if (key === 'master') {
			if (nativeEvent.master?.id !== currentSelectedEvent.master?.id) {
				return { ...acc, [key]: currentSelectedEvent.master?.id };
			}
			return acc;
		}

		if (nativeEvent[key] !== currentSelectedEvent[key]) {
			return { ...acc, [key]: currentSelectedEvent[key] };
		}

		return acc;
	}, {});
};
