import type { Metadata } from "next";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { AddressForm } from "@/components/account/AddressForm";
import { requireCustomer } from "@/lib/customerAuth";
import { getAddressesForUser } from "@/lib/store/addresses";
import { deleteAddressAction, setDefaultAddressAction } from "@/lib/actions/account";

export const metadata: Metadata = { title: "Saved Addresses", robots: { index: false, follow: false } };

// Reads the customer's live saved addresses -- must not be statically cached.
export const dynamic = "force-dynamic";

export default async function AddressesPage() {
	const customer = await requireCustomer();
	const addresses = getAddressesForUser(customer.id);

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="My Account" title="Saved Addresses" />
			<main className="py-16">
				<Container className="grid gap-10 lg:grid-cols-[1fr_400px]">
					<div className="space-y-4">
						{addresses.length === 0 && <p className="text-text-muted">No saved addresses yet.</p>}
						{addresses.map((address) => {
							const removeAction = deleteAddressAction.bind(null, address.id);
							const defaultAction = setDefaultAddressAction.bind(null, address.id);
							return (
								<div key={address.id} className="rounded-2xl border border-border bg-secondary p-6">
									<div className="mb-2 flex items-center justify-between">
										<p className="font-semibold text-text">{address.fullName}</p>
										{address.isDefault && (
											<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Default</span>
										)}
									</div>
									<p className="text-sm text-text-muted">
										{address.addressLine}, {address.city} {address.postalCode}
									</p>
									<p className="text-sm text-text-muted">{address.phone}</p>
									<div className="mt-4 flex gap-4">
										{!address.isDefault && (
											<form action={defaultAction}>
												<button type="submit" className="text-sm text-primary hover:underline">
													Set as default
												</button>
											</form>
										)}
										<form action={removeAction}>
											<button type="submit" className="text-sm text-error hover:underline">
												Delete
											</button>
										</form>
									</div>
								</div>
							);
						})}
					</div>

					<AddressForm />
				</Container>
			</main>
			<Footer />
		</>
	);
}
