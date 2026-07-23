import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
				<Link
					href="/admin/customers"
					className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-text"
				>
					<ArrowLeft size={16} /> Back to Customers
				</Link>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Edit Customer</h1>
				<CustomerEditForm customer={customer} />
			</Container>
		</main>
	);
}
