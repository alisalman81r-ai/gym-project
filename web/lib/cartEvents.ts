export const CART_UPDATED_EVENT = "cart:updated";

/** Lets the Navbar's cart badge (a client component with no server props) know to refetch its count. */
export function notifyCartUpdated(): void {
	if (typeof window !== "undefined") window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
