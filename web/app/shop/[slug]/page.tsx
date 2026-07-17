import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import { Navbar, Footer, Container } from "@/components/layout";
import { RevealImage, Badge } from "@/components/ui";
import { ProductCard } from "@/components/cards";
import { ProductPurchasePanel } from "@/components/shop/ProductPurchasePanel";
import { ReviewForm } from "@/components/shop/ReviewForm";
import { getProductBySlug, getRelatedProducts } from "@/lib/store/products";
import { getApprovedReviewsForProduct } from "@/lib/store/reviews";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { isInWishlist } from "@/lib/store/wishlist";

// Reads live stock/price/reviews -- must not be statically cached.
export const dynamic = "force-dynamic";

interface ProductPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
	const { slug } = await params;
	const product = getProductBySlug(slug);
	return { title: product ? `${product.name} — Shop` : "Product Not Found" };
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { slug } = await params;
	const product = getProductBySlug(slug);
	if (!product) notFound();

	const reviews = getApprovedReviewsForProduct(product.id);
	const related = getRelatedProducts(product);
	const customer = await getCurrentCustomer();
	const inWishlist = customer ? isInWishlist(customer.id, product.id) : false;
	const effectivePrice = product.discountPrice ?? product.price;

	return (
		<>
			<Navbar />
			<main className="pb-24 pt-36">
				<Container>
					<div className="grid gap-12 lg:grid-cols-2">
						<div className="flex flex-col gap-4">
							<div className="aspect-square w-full overflow-hidden rounded-2xl border border-border bg-secondary-light">
								{product.images[0] ? (
									<RevealImage
										src={product.images[0].url}
										alt={product.name}
										width={800}
										height={800}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full items-center justify-center text-text-subtle">No image</div>
								)}
							</div>
							{product.images.length > 1 && (
								<div className="grid grid-cols-4 gap-3">
									{product.images.slice(1).map((image) => (
										<div key={image.id} className="aspect-square overflow-hidden rounded-lg border border-border">
											<RevealImage
												src={image.url}
												alt={product.name}
												width={200}
												height={200}
												className="h-full w-full object-cover"
											/>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="flex flex-col gap-5">
							<div>
								{product.brandName && (
									<p className="text-xs font-bold uppercase tracking-wider text-text-subtle">{product.brandName}</p>
								)}
								<h1 className="font-display text-3xl font-bold text-text">{product.name}</h1>
								{product.categoryName && (
									<Badge tone="neutral" className="mt-3">
										{product.categoryName}
									</Badge>
								)}
							</div>

							{product.ratingCount > 0 && (
								<div className="flex items-center gap-2 text-sm text-text-muted">
									<div className="flex items-center gap-1">
										{Array.from({ length: 5 }, (_, index) => (
											<Star
												key={index}
												size={16}
												className={index < Math.round(product.ratingAvg) ? "fill-primary text-primary" : "text-border"}
											/>
										))}
									</div>
									{product.ratingAvg.toFixed(1)} ({product.ratingCount} review{product.ratingCount === 1 ? "" : "s"})
								</div>
							)}

							<div className="flex items-baseline gap-3">
								<span className="font-display text-3xl font-semibold text-primary">${effectivePrice.toFixed(2)}</span>
								{product.discountPrice && (
									<span className="text-lg text-text-subtle line-through">${product.price.toFixed(2)}</span>
								)}
							</div>

							<p className="text-text-muted">{product.description}</p>
							{product.weightOrFlavor && <p className="text-sm text-text-subtle">{product.weightOrFlavor}</p>}

							<p className="text-sm text-text-subtle">
								{product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Currently out of stock"}
							</p>

							<ProductPurchasePanel product={product} initialInWishlist={inWishlist} />
						</div>
					</div>

					{related.length > 0 && (
						<section className="mt-24">
							<h2 className="mb-6 font-display text-2xl font-bold text-text">You Might Also Like</h2>
							<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
								{related.map((relatedProduct) => (
									<ProductCard key={relatedProduct.id} product={relatedProduct} />
								))}
							</div>
						</section>
					)}

					<section className="mt-24 max-w-2xl">
						<h2 className="mb-6 font-display text-2xl font-bold text-text">Reviews</h2>
						<div className="mb-8 space-y-6">
							{reviews.length === 0 && <p className="text-text-muted">No reviews yet — be the first.</p>}
							{reviews.map((review) => (
								<div key={review.id} className="rounded-2xl border border-border bg-secondary p-6">
									<div className="mb-2 flex items-center gap-2">
										{Array.from({ length: 5 }, (_, index) => (
											<Star key={index} size={14} className={index < review.rating ? "fill-primary text-primary" : "text-border"} />
										))}
										<span className="text-sm font-semibold text-text">{review.customerName}</span>
									</div>
									<p className="text-sm text-text-muted">{review.comment}</p>
									{review.imageUrl && (
										<div className="mt-3 h-32 w-32 overflow-hidden rounded-lg border border-border">
											<RevealImage src={review.imageUrl} alt="Review photo" width={150} height={150} className="h-full w-full object-cover" />
										</div>
									)}
								</div>
							))}
						</div>

						{customer ? (
							<ReviewForm productId={product.id} />
						) : (
							<p className="text-sm text-text-muted">
								<Link href="/account/login" className="text-primary hover:underline">
									Sign in
								</Link>{" "}
								to leave a review.
							</p>
						)}
					</section>
				</Container>
			</main>
			<Footer />
		</>
	);
}
