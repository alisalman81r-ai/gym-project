import Link from "next/link";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { listProducts, LOW_STOCK_THRESHOLD } from "@/lib/store/products";
import { deleteProductAction, toggleFeaturedAction } from "./actions";

export const metadata = { title: "Manage Products" };

// Reads live stock/status -- must not be statically cached.
export const dynamic = "force-dynamic";

interface ProductsPageProps {
	searchParams: Promise<{ q?: string }>;
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
	const params = await searchParams;
	const { products, total } = listProducts({ search: params.q, includeInactive: true, pageSize: 200, sort: "newest" });

	return (
		<main className="py-16">
			<Container>
				<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
					<h1 className="font-display text-3xl font-bold text-text">Products ({total})</h1>
					<Button href="/admin/products/new">Add Product</Button>
				</div>

				<form method="get" className="mb-6 flex gap-2">
					<input
						name="q"
						defaultValue={params.q ?? ""}
						placeholder="Search products..."
						className="w-full max-w-sm rounded-md border border-border bg-secondary px-4 py-2 text-sm text-text focus:border-primary focus:outline-none"
					/>
					<button
						type="submit"
						className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-background"
					>
						Search
					</button>
				</form>

				<div className="overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[900px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary text-left text-text-muted">
								<th className="p-3">Product</th>
								<th className="p-3">Type</th>
								<th className="p-3">Price</th>
								<th className="p-3">Stock</th>
								<th className="p-3">Featured</th>
								<th className="p-3">Status</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{products.length === 0 && (
								<tr>
									<td colSpan={7} className="p-4 text-center text-text-muted">
										No products found.
									</td>
								</tr>
							)}
							{products.map((product) => {
								const removeAction = deleteProductAction.bind(null, product.id);
								const toggleAction = toggleFeaturedAction.bind(null, product.id, !product.featured);
								return (
									<tr key={product.id} className="border-b border-border align-top">
										<td className="p-3 text-text">{product.name}</td>
										<td className="p-3 text-text-muted">{product.productType === "clothing" ? "Clothing" : "Supplement"}</td>
										<td className="p-3 text-text-muted">
											${(product.discountPrice ?? product.price).toFixed(2)}
											{product.discountPrice && (
												<span className="ml-1 text-xs text-text-subtle line-through">${product.price.toFixed(2)}</span>
											)}
										</td>
										<td className={`p-3 ${product.stockQuantity <= LOW_STOCK_THRESHOLD ? "font-semibold text-error" : "text-text-muted"}`}>
											{product.stockQuantity}
										</td>
										<td className="p-3">
											<form action={toggleAction}>
												<button
													type="submit"
													className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
														product.featured ? "bg-primary/10 text-primary" : "border border-border text-text-muted hover:border-primary/60"
													}`}
												>
													{product.featured ? "Featured" : "Mark Featured"}
												</button>
											</form>
										</td>
										<td className="p-3">
											<span
												className={`rounded-full px-3 py-1 text-xs font-semibold ${
													product.status === "active" ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
												}`}
											>
												{product.status}
											</span>
										</td>
										<td className="p-3">
											<div className="flex flex-col gap-2">
												<Link href={`/admin/products/${product.id}/edit`} className="text-xs font-semibold text-primary hover:underline">
													Edit
												</Link>
												<form action={removeAction}>
													<button type="submit" className="text-xs font-semibold text-error hover:underline">
														Delete
													</button>
												</form>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</Container>
		</main>
	);
}
