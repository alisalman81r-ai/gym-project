export type OrderStatus = "pending" | "confirmed" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "stripe";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export const ORDER_STATUSES: OrderStatus[] = [
	"pending",
	"confirmed",
	"packed",
	"shipped",
	"out_for_delivery",
	"delivered",
	"cancelled",
];

export interface OrderItem {
	id: number;
	productId: number | null;
	productName: string;
	price: number;
	quantity: number;
	size: string | null;
	color: string | null;
	subtotal: number;
}

export interface Order {
	id: number;
	orderNumber: string;
	userId: number | null;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	addressLine: string;
	city: string;
	postalCode: string;
	subtotal: number;
	discount: number;
	couponCode: string | null;
	shippingCost: number;
	total: number;
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
	status: OrderStatus;
	courierName: string | null;
	trackingNumber: string | null;
	estimatedDeliveryDate: string | null;
	createdAt: string;
	items: OrderItem[];
}
