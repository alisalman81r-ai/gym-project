import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { getCartKeyReadonly, getCartSummary, getAppliedCouponCode } from "@/lib/store/cart";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { getAddressesForUser } from "@/lib/store/addresses";
import { isStripeEnabled } from "@/lib/stripe";

export const metadata: Metadata = { title: "Checkout" };

// Reads the cart cookie/DB live -- must not be statically cached.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
	const cartKey = await getCartKeyReadonly();
	const couponCode = await getAppliedCouponCode();
	const summary = await getCartSummary(cartKey, couponCode);

	if (summary.items.length === 0) redirect("/cart");

	const customer = await getCurrentCustomer();
	const defaultAddress = customer ? getAddressesForUser(customer.id)[0] : undefined;

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="Checkout" title="Complete Your Order" />
			<main className="py-16">
				<Container>
					<div className="grid gap-10 lg:grid-cols-[1fr_360px]">
						<CheckoutForm
							isStripeEnabled={isStripeEnabled}
							defaults={{
								name: customer?.name ?? defaultAddress?.fullName ?? "",
								email: customer?.email ?? "",
								phone: customer?.phone ?? defaultAddress?.phone ?? "",
								addressLine: defaultAddress?.addressLine ?? "",
								city: defaultAddress?.city ?? "",
								postalCode: defaultAddress?.postalCode ?? "",
							}}
						/>

						<div className="flex h-fit flex-col gap-4 rounded-2xl border border-border bg-secondary p-6">
							<h2 className="font-display text-lg font-semibold text-text">Order Summary</h2>
							<div className="max-h-72 space-y-3 overflow-y-auto">
								{summary.items.map((item) => (
									<div key={item.id} className="flex justify-between gap-3 text-sm">
										<span className="text-text-muted">
											{item.name} × {item.quantity}
											{(item.size || item.color) && (
												<span className="block text-xs text-text-subtle">
													{[item.size, item.color].filter(Boolean).join(" / ")}
												</span>
											)}
										</span>
										<span className="whitespace-nowrap text-text">${item.lineTotal.toFixed(2)}</span>
									</div>
								))}
							</div>

							<div className="space-y-2 border-t border-border pt-4 text-sm">
								<div className="flex justify-between text-text-muted">
									<span>Subtotal</span>
									<span>${summary.subtotal.toFixed(2)}</span>
								</div>
								{summary.discount > 0 && (
									<div className="flex justify-between text-primary">
										<span>Discount{summary.couponCode ? ` (${summary.couponCode})` : ""}</span>
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
						</div>
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
