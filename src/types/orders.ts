export type FetchOrdersParamsType = {
	page: number;
	objectsPerPage?: number;
	sort?: 'asc' | 'desc',
};

export type ServiceOrderType = {
	id?: number
	serviceId: number
	count: number
}

export type ProductOrderType = {
	id?: number
	productId: number
	count: number
}

export type DefaultOrderDataType = {
	services?: ServiceOrderType[]
	products?: ProductOrderType[]
	clientId?: number|string
	masterId?: number|string
	eventId?: number|string
	isSuccess?: boolean
}

export type DefaultCreateOrderDataType = {
	services?: ServiceOrderType[]
	products?: ProductOrderType[]
	clientId?: number|string
	masterId?: number|string
	eventId?: number|string
	isSuccess?: boolean
	isReserved?: boolean
	price?: number
}

export type OrderType = {
	id: number;
	price: number;
	client: {
		id: number;
	};
	master: {
		id: number;
	};
	services: {
		id: number;
		count: number;
		service: {
			id: number;
			title: string;
			price: number;
		}
	};
	products: {
		id: number;
		count: number;
		product: {
			id: number;
			title: string;
			price: number;
		}
	};
	isSuccess: boolean;
	isCancel: boolean;
	isReserved: boolean;
	updateDate: Date;
	createDate: Date;
}