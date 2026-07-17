import type { OrderStatus } from "@/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	pending: "Pending",
	confirmed: "Confirmed",
	packed: "Packed",
	shipped: "Shipped",
	out_for_delivery: "Out for Delivery",
	delivered: "Delivered",
	cancelled: "Cancelled",
};

/** The normal fulfillment sequence -- excludes "cancelled", which is a terminal branch, not a step. */
export const ORDER_STATUS_STEPS: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];
