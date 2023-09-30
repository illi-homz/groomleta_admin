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