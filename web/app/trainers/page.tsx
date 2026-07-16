import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { CtaBanner, PageHeader } from "@/components/ui";
import { TrainerCard } from "@/components/cards";
import { TRAINERS } from "@/constants/trainers";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Our Trainers",
	description: "Meet the certified coaches behind Iron Elite Fitness Club.",
	path: "/trainers",
});

export default function TrainersPage() {
	return (
		<>
			<Navbar />
			<main>
				<PageHeader eyebrow="Our Coaches" title="Trained By The Best, For The Best" />

				<section className="py-24">
					<Container>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{TRAINERS.map((trainer) => (
								<div key={trainer.id} id={trainer.id} className="scroll-mt-28">
									<TrainerCard trainer={trainer} />
								</div>
							))}
						</div>
					</Container>
				</section>

				<CtaBanner
					eyebrow="Ready?"
					title="Train Under Someone Who's Been There."
					description="Every coach on our roster is certified, experienced, and accountable to your results."
					primaryCta={{ label: "Book a Session", href: "/contact" }}
				/>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
