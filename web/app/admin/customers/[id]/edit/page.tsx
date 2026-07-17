import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { CustomerEditForm } from "@/components/admin/CustomerEditForm";
import { getCustomerById } from "@/lib/store/customers";

export const metadata = { title: "Edit Customer" };

// Reads the customer live for editing -- must not be statically cached.
export const dynamic = "force-dynamic";

interface EditCustomerPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
	const { id } = await params;
	const customer = getCustomerById(Number(id));
	if (!customer) notFound();

	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Edit Customer</h1>
				<CustomerEditForm customer={customer} />
			</Container>
		</main>
	);
}
