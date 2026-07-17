import type { Metadata } from "next";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader, Button } from "@/components/ui";
import { CartItemRow } from "@/components/shop/CartItemRow";
import { CouponForm } from "@/components/shop/CouponForm";
import { getCartKeyReadonly, getCartSummary, getAppliedCouponCode, FREE_SHIPPING_THRESHOLD } from "@/lib/store/cart";

export const metadata: Metadata = { title: "Your Cart" };

// Reads the cart cookie/DB live -- must not be statically cached.
export const dynamic = "force-dynamic";

export default async function CartPage() {
	const cartKey = await getCartKeyReadonly();
	const couponCode = await getAppliedCouponCode();
	const summary = await getCartSummary(cartKey, couponCode);

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="Cart" title="Your Cart" />
			<main className="py-16">
				<Container>
					{summary.items.length === 0 ? (
						<div className="rounded-2xl border border-border bg-secondary p-16 text-center">
							<p className="mb-6 text-text-muted">Your cart is empty.</p>
							<Button href="/shop">Browse the Shop</Button>
						</div>
					) : (
						<div className="grid gap-10 lg:grid-cols-[1fr_360px]">
							<div className="rounded-2xl border border-border bg-secondary p-6">
								{summary.items.map((item) => (
									<CartItemRow key={item.id} item={item} />
								))}
							</div>

							<div className="flex h-fit flex-col gap-5 rounded-2xl border border-border bg-secondary p-6">
								<h2 className="font-display text-lg font-semibold text-text">Order Summary</h2>
								<CouponForm appliedCode={summary.couponCode} />

								<div className="space-y-2 border-t border-border pt-4 text-sm">
									<div className="flex justify-between text-text-muted">
										<span>Subtotal</span>
										<span>${summary.subtotal.toFixed(2)}</span>
									</div>
									{summary.discount > 0 && (
										<div className="flex justify-between text-primary">
											<span>Discount</span>
											<span>-${summary.discount.toFixed(2)}</span>
										</div>
									)}
									<div className="flex justify-between text-text-muted">
										<span>Shipping</span>
										<span>{summary.shippingCost === 0 ? "Free" : `$${summary.shippingCost.toFixed(2)}`}</span>
									</div>
									<div className="flex justify-between border-t border-border pt-2 font-display text-base font-semibold text-text">
										<span>Total</span>
										<span>${summary.total.toFixed(2)}</span>
									</div>
								</div>

								{summary.subtotal < FREE_SHIPPING_THRESHOLD && (
									<p className="text-xs text-text-subtle">
										Add ${(FREE_SHIPPING_THRESHOLD - summary.subtotal).toFixed(2)} more for free shipping.
									</p>
								)}

								<Button href="/checkout" className="w-full">
									Proceed to Checkout
								</Button>
							</div>
						</div>
					)}
				</Container>
			</main>
			<Footer />
		</>
	);
}
