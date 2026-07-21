"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { CategoryRow } from "@/lib/store/products";

export interface ShopFiltersProps {
	categories: CategoryRow[];
}

export function ShopFilters({ categories }: ShopFiltersProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("q") ?? "");
	const [, startTransition] = useTransition();

	function updateParams(updates: Record<string, string | null>) {
		const next = new URLSearchParams(searchParams.toString());
		for (const [key, value] of Object.entries(updates)) {
			if (value) next.set(key, value);
			else next.delete(key);
		}
		next.delete("page");
		startTransition(() => router.push(`${pathname}?${next.toString()}`));
	}

	function handleSearchSubmit(event: FormEvent) {
		event.preventDefault();
		updateParams({ q: search || null });
	}

	const activeType = searchParams.get("type") ?? "";
	const activeCategory = searchParams.get("category") ?? "";
	const activeSort = searchParams.get("sort") ?? "newest";

	return (
		<div className="mb-10 flex flex-col gap-4 rounded-2xl border border-border bg-secondary p-6 sm:flex-row sm:items-center sm:justify-between">
			<form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2">
				<input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Search products..."
					className="w-full rounded-md border border-border/80 bg-secondary-light px-4 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
				/>
				<button
					type="submit"
					className="whitespace-nowrap rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-background"
				>
					Search
				</button>
			</form>

			<div className="flex flex-wrap items-center gap-3">
				<select
					value={activeType}
					onChange={(event) => updateParams({ type: event.target.value || null, category: null })}
					className="rounded-md border border-border/80 bg-secondary-light px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
				>
					<option value="">All Products</option>
					<option value="clothing">Gym Clothing</option>
					<option value="supplement">Supplements</option>
				</select>

				<select
					value={activeCategory}
					onChange={(event) => updateParams({ category: event.target.value || null })}
					className="rounded-md border border-border/80 bg-secondary-light px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
				>
					<option value="">All Subcategories</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>

				<select
					value={activeSort}
					onChange={(event) => updateParams({ sort: event.target.value })}
					className="rounded-md border border-border/80 bg-secondary-light px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
				>
					<option value="newest">Newest</option>
					<option value="price_asc">Price: Low to High</option>
					<option value="price_desc">Price: High to Low</option>
					<option value="popularity">Most Popular</option>
				</select>
			</div>
		</div>
	);
}
