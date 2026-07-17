"use client";

import { useState, useTransition } from "react";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { addToCartAction } from "@/lib/actions/cart";
import { toggleWishlistAction } from "@/lib/actions/wishlist";
import { notifyCartUpdated } from "@/lib/cartEvents";
import type { Product } from "@/types";

export interface ProductPurchasePanelProps {
	product: Product;
	initialInWishlist: boolean;
}

export function ProductPurchasePanel({ product, initialInWishlist }: ProductPurchasePanelProps) {
	const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
	const [color, setColor] = useState<string | null>(product.colors[0] ?? null);
	const [quantity, setQuantity] = useState(1);
	const [isPending, startTransition] = useTransition();
	const [added, setAdded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [inWishlist, setInWishlist] = useState(initialInWishlist);

	const isOutOfStock = product.stockQuantity <= 0;

	function handleAddToCart() {
		setError(null);
		startTransition(async () => {
			const result = await addToCartAction(product.id, quantity, size, color);
			if (result.error) {
				setError(result.error);
			} else {
				setAdded(true);
				notifyCartUpdated();
				setTimeout(() => setAdded(false), 2000);
			}
		});
	}

	function handleToggleWishlist() {
		startTransition(async () => {
			const result = await toggleWishlistAction(product.id);
			if (result.error) setError(result.error);
			else setInWishlist(Boolean(result.inWishlist));
		});
	}

	return (
		<div className="flex flex-col gap-6">
			{product.sizes.length > 0 && (
				<div>
					<p className="mb-2 text-sm font-semibold text-text-muted">Size</p>
					<div className="flex flex-wrap gap-2">
						{product.sizes.map((option) => (
							<button
								key={option}
								type="button"
								onClick={() => setSize(option)}
								className={cn(
									"rounded-md border px-4 py-2 text-sm font-semibold transition-colors",
									size === option ? "border-primary bg-primary text-background" : "border-border text-text-muted hover:border-primary/60"
								)}
							>
								{option}
							</button>
						))}
					</div>
				</div>
			)}

			{product.colors.length > 0 && (
				<div>
					<p className="mb-2 text-sm font-semibold text-text-muted">Color</p>
					<div className="flex flex-wrap gap-2">
						{product.colors.map((option) => (
							<button
								key={option}
								type="button"
								onClick={() => setColor(option)}
								className={cn(
									"rounded-md border px-4 py-2 text-sm font-semibold transition-colors",
									color === option ? "border-primary bg-primary text-background" : "border-border text-text-muted hover:border-primary/60"
								)}
							>
								{option}
							</button>
						))}
					</div>
				</div>
			)}

			<div>
				<p className="mb-2 text-sm font-semibold text-text-muted">Quantity</p>
				<div className="flex w-fit items-center gap-1 rounded-md border border-border">
					<button
						type="button"
						onClick={() => setQuantity((value) => Math.max(1, value - 1))}
						className="p-3 text-text-muted hover:text-primary"
						aria-label="Decrease quantity"
					>
						<Minus size={16} />
					</button>
					<span className="w-8 text-center text-text">{quantity}</span>
					<button
						type="button"
						onClick={() => setQuantity((value) => Math.min(Math.max(product.stockQuantity, 1), value + 1))}
						className="p-3 text-text-muted hover:text-primary"
						aria-label="Increase quantity"
					>
						<Plus size={16} />
					</button>
				</div>
			</div>

			{error && <p className="text-sm text-error">{error}</p>}

			<div className="flex gap-3">
				<Button type="button" disabled={isPending || isOutOfStock} onClick={handleAddToCart} className="flex-1">
					{isOutOfStock ? (
						"Out of Stock"
					) : added ? (
						"Added to Cart"
					) : (
						<>
							<ShoppingCart size={16} /> Add to Cart
						</>
					)}
				</Button>
				<button
					type="button"
					onClick={handleToggleWishlist}
					aria-pressed={inWishlist}
					aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
					className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:text-primary"
				>
					<Heart size={20} className={cn(inWishlist && "fill-primary text-primary")} />
				</button>
			</div>
		</div>
	);
}
