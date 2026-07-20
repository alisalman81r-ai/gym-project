import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Navbar, Footer, Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { getMembershipById } from "@/lib/store/memberships";

export const metadata: Metadata = { title: "Welcome to Iron Elite" };

// Reads the freshly created membership live -- must not be statically cached.
export const dynamic = "force-dynamic";

interface MembershipSuccessPageProps {
	params: Promise<{ id: string }>;
}

export default async function MembershipSuccessPage({ params }: MembershipSuccessPageProps) {
	const { id } = await params;
	const membership = getMembershipById(Number(id));
	if (!membership) notFound();

	return (
		<>
			<Navbar />
			<main className="py-24">
				<Container className="mx-auto max-w-lg text-center">
					<CheckCircle2 className="mx-auto mb-6 text-primary" size={56} />
					<h1 className="mb-2 font-display text-3xl font-bold text-text">Welcome to Iron Elite</h1>
					<p className="mb-8 text-text-muted">
						Thank you, {membership.customerName} — your {membership.planName} membership is{" "}
						{membership.status === "active" ? "now active" : "being set up"}.
					</p>

					<div className="mb-8 space-y-2 rounded-2xl border border-border bg-secondary p-8 text-left text-sm">
						<div className="flex justify-between">
							<span className="text-text-muted">Plan</span>
							<span className="text-text">{membership.planName}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-text-muted">Billing</span>
							<span className="text-text">${membership.price.toFixed(2)}/mo</span>
						</div>
						<div className="flex justify-between">
							<span className="text-text-muted">Status</span>
							<span className="capitalize text-primary">{membership.status}</span>
						</div>
					</div>

					<Button href="/">Back to Home</Button>
				</Container>
			</main>
			<Footer />
		</>
	);
}
