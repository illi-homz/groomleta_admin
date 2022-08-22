export const declOfNum = (n: number, titles: string[]) => {
	return titles[
		n % 10 === 1 && n % 100 !== 11
			? 0
			: n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
			? 1
			: 2
	];
};

export const getExperience = (createDate: string) => {
	const startDate = new Date(createDate).getTime();
	const month_diff = Date.now() - startDate;
	const age_dt = new Date(month_diff);
	const month = age_dt.getMonth();
	const day = age_dt.getDate();
	const year = age_dt.getUTCFullYear();
	const age = Math.abs(year - 1970);

	if (age) {
		return `${age} ${declOfNum(age, ['год', 'года', 'лет'])}`;
	}

	if (month) {
		return `${month} ${declOfNum(month, ['месяц', 'месяца', 'месяцев'])}`;
	}

	return `${day} ${declOfNum(day, ['день', 'дня', 'дней'])}`
};

export const parsePrice = (price: string|number) => {
	if (typeof price === 'number') return price
	return price?.replace(/[^\d.]/g, '');
}