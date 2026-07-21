"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui";
import type { ProductFormState } from "@/app/admin/products/actions";
import type { Product } from "@/types";

const initialState: ProductFormState = {};
const inputClasses =
	"w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export interface ProductFormProps {
	action: (prevState: ProductFormState | undefined, formData: FormData) => Promise<ProductFormState>;
	product?: Product;
	submitLabel: string;
}

export function ProductForm({ action, product, submitLabel }: ProductFormProps) {
	const [state, formAction, pending] = useActionState(action, initialState);
	const [keepImages, setKeepImages] = useState<string[]>(product?.images.map((image) => image.url) ?? []);

	return (
		<form action={formAction} className="space-y-6 rounded-2xl border border-border bg-secondary p-8">
			<div className="grid gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="name" className="text-sm font-semibold text-text-muted">
						Product Name
					</label>
					<input id="name" name="name" type="text" defaultValue={product?.name} required className={inputClasses} />
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="productType" className="text-sm font-semibold text-text-muted">
						Category
					</label>
					<select id="productType" name="productType" defaultValue={product?.productType ?? "clothing"} className={inputClasses}>
						<option value="clothing">Gym Clothing</option>
						<option value="supplement">Supplements</option>
					</select>
				</div>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="categoryName" className="text-sm font-semibold text-text-muted">
						Subcategory
					</label>
					<input
						id="categoryName"
						name="categoryName"
						type="text"
						defaultValue={product?.categoryName ?? ""}
						placeholder="e.g. Hoodies, Pre-Workout"
						required
						className={inputClasses}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="brandName" className="text-sm font-semibold text-text-muted">
						Brand
					</label>
					<input
						id="brandName"
						name="brandName"
						type="text"
						defaultValue={product?.brandName ?? "Iron Elite"}
						className={inputClasses}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="description" className="text-sm font-semibold text-text-muted">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					rows={3}
					defaultValue={product?.description}
					required
					className={inputClasses}
				/>
			</div>

			<div className="grid gap-5 sm:grid-cols-3">
				<div className="flex flex-col gap-2">
					<label htmlFor="price" className="text-sm font-semibold text-text-muted">
						Price ($)
					</label>
					<input
						id="price"
						name="price"
						type="number"
						step="0.01"
						min="0"
						defaultValue={product?.price}
						required
						className={inputClasses}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="discountPrice" className="text-sm font-semibold text-text-muted">
						Discount Price ($) <span className="text-text-subtle">(optional)</span>
					</label>
					<input
						id="discountPrice"
						name="discountPrice"
						type="number"
						step="0.01"
						min="0"
						defaultValue={product?.discountPrice ?? ""}
						className={inputClasses}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="stockQuantity" className="text-sm font-semibold text-text-muted">
						Stock Quantity
					</label>
					<input
						id="stockQuantity"
						name="stockQuantity"
						type="number"
						min="0"
						defaultValue={product?.stockQuantity ?? 0}
						required
						className={inputClasses}
					/>
				</div>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="sizes" className="text-sm font-semibold text-text-muted">
						Available Sizes <span className="text-text-subtle">(comma-separated, clothing only)</span>
					</label>
					<input
						id="sizes"
						name="sizes"
						type="text"
						defaultValue={product?.sizes.join(", ") ?? ""}
						placeholder="S, M, L, XL"
						className={inputClasses}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="colors" className="text-sm font-semibold text-text-muted">
						Available Colors <span className="text-text-subtle">(comma-separated, clothing only)</span>
					</label>
					<input
						id="colors"
						name="colors"
						type="text"
						defaultValue={product?.colors.join(", ") ?? ""}
						placeholder="Black, Navy"
						className={inputClasses}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="weightOrFlavor" className="text-sm font-semibold text-text-muted">
					Weight / Flavor <span className="text-text-subtle">(supplements only)</span>
				</label>
				<input
					id="weightOrFlavor"
					name="weightOrFlavor"
					type="text"
					defaultValue={product?.weightOrFlavor ?? ""}
					placeholder="Chocolate, 2 lb"
					className={inputClasses}
				/>
			</div>

			<div className="flex flex-wrap gap-6">
				<label className="flex items-center gap-2 text-sm text-text-muted">
					<input type="checkbox" name="featured" defaultChecked={product?.featured} className="accent-primary" />
					Featured product
				</label>
				<div className="flex items-center gap-2">
					<label htmlFor="status" className="text-sm font-semibold text-text-muted">
						Status
					</label>
					<select id="status" name="status" defaultValue={product?.status ?? "active"} className={inputClasses}>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>

			<div>
				<p className="mb-2 text-sm font-semibold text-text-muted">Product Images</p>
				{keepImages.length > 0 && (
					<div className="mb-3 flex flex-wrap gap-3">
						{keepImages.map((url) => (
							<div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
								<input type="hidden" name="keepImages" value={url} />
								{/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail preview, not worth next/image's config for a dynamic list of arbitrary local/uploaded paths */}
								<img src={url} alt="" className="h-full w-full object-cover" />
								<button
									type="button"
									onClick={() => setKeepImages((prev) => prev.filter((existing) => existing !== url))}
									className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-xs text-error"
									aria-label="Remove image"
								>
									×
								</button>
							</div>
						))}
					</div>
				)}
				<input id="newImages" name="newImages" type="file" accept="image/*" multiple className="w-full text-sm text-text-muted" />
			</div>

			{state?.error && <p className="text-sm text-error">{state.error}</p>}

			<Button type="submit" disabled={pending}>
				{pending ? "Saving..." : submitLabel}
			</Button>
		</form>
	);
}
