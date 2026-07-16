import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { CtaBanner } from "@/components/ui";
import { TrainerCard } from "@/components/cards";
import { TRAINERS } from "@/constants/trainers";

export const metadata: Metadata = {
	title: "Our Trainers",
	description: "Meet the certified coaches behind Iron Elite Fitness Club.",
};

export default function TrainersPage() {
	return (
		<>
			<Navbar />
			<main>
				<section className="bg-secondary pb-20 pt-36 text-center">
					<Container>
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Coaches</p>
						<h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
							Trained By The Best, For The Best
						</h1>
					</Container>
				</section>

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
