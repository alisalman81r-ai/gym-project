import { Container } from "@/components/layout";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "../actions";

export const metadata = { title: "Add Product" };

export default function NewProductPage() {
	return (
		<main className="py-16">
			<Container className="max-w-3xl">
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Add Product</h1>
				<ProductForm action={createProductAction} submitLabel="Create Product" />
			</Container>
		</main>
	);
}
