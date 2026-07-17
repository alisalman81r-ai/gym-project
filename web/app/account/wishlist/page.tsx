import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { ProductCard } from "@/components/cards";
import { requireCustomer } from "@/lib/customerAuth";
import { getWishlist } from "@/lib/store/wishlist";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: false } };

// Reads the customer's live wishlist -- must not be statically cached.
export const dynamic = "force-dynamic";

export default async function WishlistPage() {
	const customer = await requireCustomer();
	const products = getWishlist(customer.id);

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="My Account" title="Wishlist" />
			<main className="py-16">
				<Container>
					{products.length === 0 ? (
						<p className="text-text-muted">
							Your wishlist is empty.{" "}
							<Link href="/shop" className="text-primary hover:underline">
								Browse the shop
							</Link>
							.
						</p>
					) : (
						<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{products.map((product) => (
								<ProductCard key={product.id} product={product} initialInWishlist />
							))}
						</div>
					)}
				</Container>
			</main>
			<Footer />
		</>
	);
}
