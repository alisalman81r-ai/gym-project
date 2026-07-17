"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { RevealImage } from "@/components/ui";
import { updateCartItemQuantityAction, removeCartItemAction } from "@/lib/actions/cart";
import { notifyCartUpdated } from "@/lib/cartEvents";
import type { CartItem } from "@/types";

export function CartItemRow({ item }: { item: CartItem }) {
	const router = useRouter();
	const [quantity, setQuantity] = useState(item.quantity);
	const [isPending, startTransition] = useTransition();

	function changeQuantity(next: number) {
		const clamped = Math.max(1, Math.min(item.stockQuantity, next));
		setQuantity(clamped);
		startTransition(async () => {
			await updateCartItemQuantityAction(item.id, clamped);
			notifyCartUpdated();
			router.refresh();
		});
	}

	function handleRemove() {
		startTransition(async () => {
			await removeCartItemAction(item.id);
			notifyCartUpdated();
			router.refresh();
		});
	}

	return (
		<div className="flex items-center gap-4 border-b border-border py-6 last:border-b-0">
			<div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary-light">
				{item.image ? (
					<RevealImage src={item.image} alt={item.name} width={100} height={100} className="h-full w-full object-cover" />
				) : (
					<div className="flex h-full items-center justify-center text-xs text-text-subtle">No image</div>
				)}
			</div>

			<div className="flex-1">
				<p className="font-display font-semibold text-text">{item.name}</p>
				{(item.size || item.color) && (
					<p className="text-xs text-text-subtle">{[item.size, item.color].filter(Boolean).join(" / ")}</p>
				)}
				<p className="mt-1 text-sm text-primary">${item.price.toFixed(2)}</p>
			</div>

			<div className="flex items-center gap-1 rounded-md border border-border">
				<button
					type="button"
					disabled={isPending}
					onClick={() => changeQuantity(quantity - 1)}
					className="p-2 text-text-muted hover:text-primary"
					aria-label="Decrease quantity"
				>
					<Minus size={14} />
				</button>
				<span className="w-6 text-center text-sm text-text">{quantity}</span>
				<button
					type="button"
					disabled={isPending}
					onClick={() => changeQuantity(quantity + 1)}
					className="p-2 text-text-muted hover:text-primary"
					aria-label="Increase quantity"
				>
					<Plus size={14} />
				</button>
			</div>

			<p className="w-20 text-right font-semibold text-text">${item.lineTotal.toFixed(2)}</p>

			<button
				type="button"
				disabled={isPending}
				onClick={handleRemove}
				className="p-2 text-text-subtle hover:text-error"
				aria-label="Remove item"
			>
				<Trash2 size={18} />
			</button>
		</div>
	);
}
