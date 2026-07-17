export interface CartItem {
	id: number;
	productId: number;
	name: string;
	slug: string;
	image: string | null;
	price: number;
	size: string | null;
	color: string | null;
	quantity: number;
	stockQuantity: number;
	lineTotal: number;
}

export interface CartSummary {
	items: CartItem[];
	subtotal: number;
	discount: number;
	couponCode: string | null;
	shippingCost: number;
	total: number;
}
