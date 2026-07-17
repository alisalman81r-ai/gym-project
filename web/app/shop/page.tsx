import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { ProductCard } from "@/components/cards";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { listProducts, getCategories, type ProductSort } from "@/lib/store/products";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { getWishlistProductIds } from "@/lib/store/wishlist";
import type { ProductType } from "@/types";

export const metadata: Metadata = {
	title: "Shop — Gym Clothing & Supplements",
};

// Reads products/stock live -- must not be statically cached.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;
const VALID_SORTS: ProductSort[] = ["newest", "price_asc", "price_desc", "popularity"];

interface ShopPageProps {
	searchParams: Promise<{ type?: string; category?: string; q?: string; sort?: string; page?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
	const params = await searchParams;
	const productType: ProductType | undefined =
		params.type === "clothing" || params.type === "supplement" ? params.type : undefined;
	const categoryId = params.category ? Number(params.category) : undefined;
	const sort: ProductSort = VALID_SORTS.includes(params.sort as ProductSort) ? (params.sort as ProductSort) : "newest";
	const page = Math.max(1, Number(params.page) || 1);

	const { products, total } = listProducts({
		productType,
		categoryId,
		search: params.q,
		sort,
		page,
		pageSize: PAGE_SIZE,
	});
	const categories = getCategories(productType);

	const customer = await getCurrentCustomer();
	const wishlistIds = customer ? new Set(getWishlistProductIds(customer.id)) : new Set<number>();

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const buildPageHref = (targetPage: number) => {
		const next = new URLSearchParams();
		if (params.type) next.set("type", params.type);
		if (params.category) next.set("category", params.category);
		if (params.q) next.set("q", params.q);
		if (params.sort) next.set("sort", params.sort);
		next.set("page", String(targetPage));
		return `/shop?${next.toString()}`;
	};

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="Shop" title="Gym Clothing & Supplements" />
			<main className="py-16">
				<Container>
					<ShopFilters categories={categories} />

					{products.length === 0 ? (
						<p className="py-16 text-center text-text-muted">No products match your filters.</p>
					) : (
						<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{products.map((product) => (
								<ProductCard key={product.id} product={product} initialInWishlist={wishlistIds.has(product.id)} />
							))}
						</div>
					)}

					{totalPages > 1 && (
						<div className="mt-12 flex items-center justify-center gap-2">
							{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
								<Link
									key={pageNumber}
									href={buildPageHref(pageNumber)}
									className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
										pageNumber === page ? "bg-primary text-background" : "border border-border text-text-muted hover:border-primary/60"
									}`}
								>
									{pageNumber}
								</Link>
							))}
						</div>
					)}
				</Container>
			</main>
			<Footer />
		</>
	);
}
