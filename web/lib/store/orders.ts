import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { validateCouponForCheckout, incrementCouponUsage } from "@/lib/store/coupons";
import { SHIPPING_FLAT_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/store/cart";
import type { Order, OrderItem, OrderStatus, PaymentMethod } from "@/types";

export class OrderError extends Error {}

function generateOrderNumber(): string {
	const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const randomPart = randomBytes(3).toString("hex").toUpperCase();
	return `ORD-${datePart}-${randomPart}`;
}

interface OrderRow {
	id: number;
	order_number: string;
	user_id: number | null;
	customer_name: string;
	customer_email: string;
	customer_phone: string;
	address_line: string;
	city: string;
	postal_code: string;
	subtotal: number;
	discount: number;
	coupon_code: string | null;
	shipping_cost: number;
	total: number;
	payment_method: PaymentMethod;
	payment_status: Order["paymentStatus"];
	status: OrderStatus;
	courier_name: string | null;
	tracking_number: string | null;
	estimated_delivery_date: string | null;
	created_at: string;
}

interface OrderItemRow {
	id: number;
	order_id: number;
	product_id: number | null;
	product_name: string;
	price: number;
	quantity: number;
	size: string | null;
	color: string | null;
	subtotal: number;
}

function rowToOrderItem(row: OrderItemRow): OrderItem {
	return {
		id: row.id,
		productId: row.product_id,
		productName: row.product_name,
		price: row.price,
		quantity: row.quantity,
		size: row.size,
		color: row.color,
		subtotal: row.subtotal,
	};
}

function rowToOrder(row: OrderRow, items: OrderItem[]): Order {
	return {
		id: row.id,
		orderNumber: row.order_number,
		userId: row.user_id,
		customerName: row.customer_name,
		customerEmail: row.customer_email,
		customerPhone: row.customer_phone,
		addressLine: row.address_line,
		city: row.city,
		postalCode: row.postal_code,
		subtotal: row.subtotal,
		discount: row.discount,
		couponCode: row.coupon_code,
		shippingCost: row.shipping_cost,
		total: row.total,
		paymentMethod: row.payment_method,
		paymentStatus: row.payment_status,
		status: row.status,
		courierName: row.courier_name,
		trackingNumber: row.tracking_number,
		estimatedDeliveryDate: row.estimated_delivery_date,
		createdAt: row.created_at,
		items,
	};
}

function loadItems(orderId: number): OrderItem[] {
	const rows = db.prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC").all(orderId) as OrderItemRow[];
	return rows.map(rowToOrderItem);
}

export interface PlaceOrderInput {
	cartKey: string;
	userId: number | null;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	addressLine: string;
	city: string;
	postalCode: string;
	paymentMethod: PaymentMethod;
	couponCode: string | null;
}

export interface PlaceOrderResult {
	orderId: number;
	orderNumber: string;
	total: number;
}

interface CartRowForOrder {
	product_id: number;
	size: string | null;
	color: string | null;
	quantity: number;
	name: string;
	price: number;
	discount_price: number | null;
	stock_quantity: number;
}

/** Recomputes totals from the DB rather than trusting anything the client sent. */
export function placeOrder(input: PlaceOrderInput): PlaceOrderResult {
	const rows = db
		.prepare(
			`SELECT ci.product_id, ci.size, ci.color, ci.quantity, p.name, p.price, p.discount_price, p.stock_quantity
			 FROM cart_items ci
			 JOIN products p ON p.id = ci.product_id
			 WHERE ci.cart_key = ?`
		)
		.all(input.cartKey) as CartRowForOrder[];

	if (rows.length === 0) throw new OrderError("Your cart is empty.");

	for (const row of rows) {
		if (row.quantity > row.stock_quantity) {
			throw new OrderError(`"${row.name}" only has ${row.stock_quantity} left in stock.`);
		}
	}

	const subtotal = Math.round(rows.reduce((sum, row) => sum + (row.discount_price ?? row.price) * row.quantity, 0) * 100) / 100;
	const discount = input.couponCode ? validateCouponForCheckout(input.couponCode, subtotal).discount : 0;
	const discountedSubtotal = Math.max(0, subtotal - discount);
	const shippingCost = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
	const total = Math.round((discountedSubtotal + shippingCost) * 100) / 100;
	const orderNumber = generateOrderNumber();

	const insertOrder = db.prepare(
		`INSERT INTO orders
			(order_number, user_id, customer_name, customer_email, customer_phone, address_line, city, postal_code, subtotal, discount, coupon_code, shipping_cost, total, payment_method)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	);
	const insertItem = db.prepare(
		"INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	);
	const insertPayment = db.prepare("INSERT INTO payments (order_id, method, amount, status) VALUES (?, ?, ?, 'pending')");
	const reduceStock = db.prepare("UPDATE products SET stock_quantity = MAX(0, stock_quantity - ?) WHERE id = ?");
	const clearCart = db.prepare("DELETE FROM cart_items WHERE cart_key = ?");

	const run = db.transaction(() => {
		const result = insertOrder.run(
			orderNumber,
			input.userId,
			input.customerName,
			input.customerEmail,
			input.customerPhone,
			input.addressLine,
			input.city,
			input.postalCode,
			subtotal,
			discount,
			discount > 0 ? input.couponCode : null,
			shippingCost,
			total,
			input.paymentMethod
		);
		const orderId = Number(result.lastInsertRowid);

		for (const row of rows) {
			const unitPrice = row.discount_price ?? row.price;
			const lineTotal = Math.round(unitPrice * row.quantity * 100) / 100;
			insertItem.run(orderId, row.product_id, row.name, unitPrice, row.quantity, row.size, row.color, lineTotal);
			reduceStock.run(row.quantity, row.product_id);
		}

		insertPayment.run(orderId, input.paymentMethod, total);
		if (discount > 0 && input.couponCode) incrementCouponUsage(input.couponCode);
		clearCart.run(input.cartKey);

		return orderId;
	});

	return { orderId: run(), orderNumber, total };
}

export function getOrderById(id: number): Order | null {
	const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
	if (!row) return null;
	return rowToOrder(row, loadItems(row.id));
}

export function getOrderByNumber(orderNumber: string): Order | null {
	const row = db.prepare("SELECT * FROM orders WHERE order_number = ? COLLATE NOCASE").get(orderNumber) as
		| OrderRow
		| undefined;
	if (!row) return null;
	return rowToOrder(row, loadItems(row.id));
}

/** Tracking must require both fields -- an order number alone should not reveal an order to a stranger. */
export function trackOrder(orderNumber: string, phone: string): Order | null {
	const row = db
		.prepare("SELECT * FROM orders WHERE order_number = ? COLLATE NOCASE AND customer_phone = ?")
		.get(orderNumber.trim(), phone.trim()) as OrderRow | undefined;
	if (!row) return null;
	return rowToOrder(row, loadItems(row.id));
}

export function getOrdersForUser(userId: number): Order[] {
	const rows = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC").all(userId) as OrderRow[];
	return rows.map((row) => rowToOrder(row, loadItems(row.id)));
}

export interface SalesSummary {
	/** Money from orders the admin has accepted (confirmed or further) -- excludes pending and cancelled. */
	acceptedTotal: number;
	acceptedCount: number;
	/** Placed but not yet accepted -- money still awaiting a decision. */
	pendingTotal: number;
	pendingCount: number;
}

/**
 * Revenue split used by the Orders page banner. Accepting a pending order
 * moves its value from `pendingTotal` into `acceptedTotal`; cancelling an
 * order drops it from both. Cancelled orders never count as sales.
 */
export function getSalesSummary(): SalesSummary {
	const accepted = db
		.prepare("SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as total FROM orders WHERE status NOT IN ('pending', 'cancelled')")
		.get() as { count: number; total: number };
	const pending = db
		.prepare("SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as total FROM orders WHERE status = 'pending'")
		.get() as { count: number; total: number };

	return {
		acceptedTotal: accepted.total,
		acceptedCount: accepted.count,
		pendingTotal: pending.total,
		pendingCount: pending.count,
	};
}

export interface OrderFilters {
	search?: string;
	status?: OrderStatus;
	page?: number;
	pageSize?: number;
}

export function listOrders(filters: OrderFilters = {}): { orders: Order[]; total: number } {
	const conditions: string[] = [];
	const params: Array<string | number> = [];

	if (filters.status) {
		conditions.push("status = ?");
		params.push(filters.status);
	}
	if (filters.search) {
		conditions.push("(order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)");
		const like = `%${filters.search}%`;
		params.push(like, like, like, like);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
	const { count } = db.prepare(`SELECT COUNT(*) as count FROM orders ${whereClause}`).get(...params) as { count: number };

	const pageSize = filters.pageSize ?? 30;
	const page = filters.page ?? 1;
	const offset = (page - 1) * pageSize;

	const rows = db
		.prepare(`SELECT * FROM orders ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`)
		.all(...params, pageSize, offset) as OrderRow[];

	return { orders: rows.map((row) => rowToOrder(row, loadItems(row.id))), total: count };
}

/** Marks an order as reviewed by the admin -- clears it from the "new orders" badge. */
export function markOrderSeenByAdmin(orderId: number): void {
	db.prepare("UPDATE orders SET admin_seen = 1 WHERE id = ?").run(orderId);
}

export function updateOrderStatus(orderId: number, status: OrderStatus): void {
	if (status === "cancelled") {
		cancelOrder(orderId);
		return;
	}
	db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, orderId);
}

/** Restores stock for every line item -- inventory must reflect a cancelled order. */
export function cancelOrder(orderId: number): void {
	const items = db.prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?").all(orderId) as Array<{
		product_id: number | null;
		quantity: number;
	}>;

	const run = db.transaction(() => {
		for (const item of items) {
			if (item.product_id) {
				db.prepare("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?").run(item.quantity, item.product_id);
			}
		}
		db.prepare("UPDATE orders SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?").run(orderId);
	});
	run();
}

export interface TrackingInput {
	courierName: string;
	trackingNumber: string;
	estimatedDeliveryDate: string | null;
}

export function assignTracking(orderId: number, input: TrackingInput): void {
	db.prepare(
		"UPDATE orders SET courier_name = ?, tracking_number = ?, estimated_delivery_date = ?, updated_at = datetime('now') WHERE id = ?"
	).run(input.courierName, input.trackingNumber, input.estimatedDeliveryDate, orderId);
}

export function markPaymentStatus(orderId: number, status: Order["paymentStatus"], providerRef: string | null): void {
	db.prepare("UPDATE orders SET payment_status = ? WHERE id = ?").run(status, orderId);
	if (providerRef) {
		db.prepare("UPDATE payments SET status = ?, provider_ref = ? WHERE order_id = ?").run(status, providerRef, orderId);
	}
}

export interface DashboardStats {
	totalUsers: number;
	totalOrders: number;
	totalSales: number;
	totalProducts: number;
	pendingOrders: number;
	monthlySales: Array<{ month: string; total: number }>;
}

export function getDashboardStats(): DashboardStats {
	const totalUsers = (db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }).count;
	const totalOrders = (db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number }).count;
	const totalProducts = (db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number }).count;
	const pendingOrders = (
		db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get() as { count: number }
	).count;
	const totalSales = (
		db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'").get() as {
			total: number;
		}
	).total;

	const monthlySales = db
		.prepare(
			`SELECT strftime('%Y-%m', created_at) as month, COALESCE(SUM(total), 0) as total
			 FROM orders
			 WHERE status != 'cancelled' AND created_at >= datetime('now', '-6 months')
			 GROUP BY month
			 ORDER BY month ASC`
		)
		.all() as Array<{ month: string; total: number }>;

	return { totalUsers, totalOrders, totalSales, totalProducts, pendingOrders, monthlySales };
}
