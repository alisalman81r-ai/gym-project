"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Card, RevealImage, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { addToCartAction } from "@/lib/actions/cart";
import { toggleWishlistAction } from "@/lib/actions/wishlist";
import { notifyCartUpdated } from "@/lib/cartEvents";
import type { Product } from "@/types";

export interface ProductCardProps {
	product: Product;
	initialInWishlist?: boolean;
}

export function ProductCard({ product, initialInWishlist = false }: ProductCardProps) {
	const [isPending, startTransition] = useTransition();
	const [added, setAdded] = useState(false);
	const [inWishlist, setInWishlist] = useState(initialInWishlist);
	const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

	const effectivePrice = product.discountPrice ?? product.price;
	const isOutOfStock = product.stockQuantity <= 0;
	const image = product.images[0];

	function handleAddToCart() {
		startTransition(async () => {
			const result = await addToCartAction(product.id, 1, product.sizes[0] ?? null, product.colors[0] ?? null);
			if (!result.error) {
				setAdded(true);
				notifyCartUpdated();
				setTimeout(() => setAdded(false), 1800);
			}
		});
	}

	function handleToggleWishlist() {
		startTransition(async () => {
			const result = await toggleWishlistAction(product.id);
			if (result.error) {
				setWishlistMessage(result.error);
				setTimeout(() => setWishlistMessage(null), 2500);
			} else {
				setInWishlist(Boolean(result.inWishlist));
			}
		});
	}

	return (
		<Card className="group relative overflow-hidden p-0" hoverEffect>
			<button
				type="button"
				onClick={handleToggleWishlist}
				aria-pressed={inWishlist}
				aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
				className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-text backdrop-blur transition-colors hover:text-primary"
			>
				<Heart size={18} className={cn(inWishlist && "fill-primary text-primary")} />
			</button>

			<Link href={`/shop/${product.slug}`} className="block">
				<div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary-light">
					{image ? (
						<RevealImage
							src={image.url}
							alt={product.name}
							fill
							sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
							className="object-cover group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-text-subtle">No image</div>
					)}
					{product.discountPrice && (
						<Badge tone="error" className="absolute left-4 top-4">
							Sale
						</Badge>
					)}
					{product.featured && !product.discountPrice && (
						<Badge tone="gold" className="absolute left-4 top-4">
							Featured
						</Badge>
					)}
				</div>
			</Link>

			<div className="flex flex-col gap-3 p-6">
				<div className="flex items-start justify-between gap-3">
					<Link href={`/shop/${product.slug}`}>
						<h3 className="font-display text-lg font-semibold text-text hover:text-primary">{product.name}</h3>
					</Link>
					<div className="flex flex-col items-end whitespace-nowrap">
						<span className="font-display text-lg font-semibold text-primary">${effectivePrice.toFixed(2)}</span>
						{product.discountPrice && (
							<span className="text-xs text-text-subtle line-through">${product.price.toFixed(2)}</span>
						)}
					</div>
				</div>

				{product.ratingCount > 0 && (
					<div className="flex items-center gap-1 text-xs text-text-muted">
						<Star size={14} className="fill-primary text-primary" />
						{product.ratingAvg.toFixed(1)} ({product.ratingCount})
					</div>
				)}

				<p className="line-clamp-2 text-sm text-text-muted">{product.description}</p>

				{wishlistMessage && <p className="text-xs text-error">{wishlistMessage}</p>}

				<Button
					type="button"
					variant="secondary"
					size="sm"
					className="mt-2 w-full"
					disabled={isPending || isOutOfStock}
					onClick={handleAddToCart}
				>
					{isOutOfStock ? (
						"Out of Stock"
					) : added ? (
						"Added!"
					) : (
						<>
							<ShoppingCart size={16} /> Add to Cart
						</>
					)}
				</Button>
			</div>
		</Card>
	);
}
