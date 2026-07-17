import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/store/products";
import { updateProductAction } from "../../actions";

export const metadata = { title: "Edit Product" };

// Reads the product live for editing -- must not be statically cached.
export const dynamic = "force-dynamic";

interface EditProductPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
	const { id } = await params;
	const product = getProductById(Number(id));
	if (!product) notFound();

	const boundAction = updateProductAction.bind(null, product.id);

	return (
		<main className="py-16">
			<Container className="max-w-3xl">
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Edit Product</h1>
				<ProductForm action={boundAction} product={product} submitLabel="Save Changes" />
			</Container>
		</main>
	);
}
