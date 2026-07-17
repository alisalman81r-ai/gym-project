import type { Metadata } from "next";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PasswordForm } from "@/components/account/PasswordForm";
import { requireCustomer } from "@/lib/customerAuth";

export const metadata: Metadata = { title: "Profile Settings", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
	const customer = await requireCustomer();

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="My Account" title="Profile Settings" />
			<main className="py-16">
				<Container className="grid gap-10 lg:grid-cols-2">
					<ProfileForm name={customer.name} email={customer.email} phone={customer.phone ?? ""} />
					<PasswordForm />
				</Container>
			</main>
			<Footer />
		</>
	);
}
