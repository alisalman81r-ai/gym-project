import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { RevealImage, Button, Badge, CtaBanner } from "@/components/ui";
import { TrainerCard } from "@/components/cards";
import { TRAINERS } from "@/constants/trainers";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/constants/site";

interface TrainerPageProps {
	params: Promise<{ id: string }>;
}

export function generateStaticParams() {
	return TRAINERS.map((trainer) => ({ id: trainer.id }));
}

export async function generateMetadata({ params }: TrainerPageProps): Promise<Metadata> {
	const { id } = await params;
	const trainer = TRAINERS.find((t) => t.id === id);
	if (!trainer) return {};

	return createMetadata({
		title: `${trainer.name} — ${trainer.role}`,
		description: trainer.bio,
		path: `/trainers/${trainer.id}`,
		image: trainer.image.src,
	});
}

export default async function TrainerPage({ params }: TrainerPageProps) {
	const { id } = await params;
	const trainer = TRAINERS.find((t) => t.id === id);

	if (!trainer) notFound();

	const related = TRAINERS.filter((t) => t.id !== id).slice(0, 3);

	const personJsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: trainer.name,
		jobTitle: trainer.role,
		description: trainer.bio,
		image: `${siteConfig.url}${trainer.image.src}`,
		worksFor: { "@type": "Organization", name: siteConfig.name },
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
			<Navbar />
			<main>
				<article className="pb-16 pt-36">
					<Container>
						<p className="mb-8">
							<Button href="/trainers" variant="ghost">
								&larr; Our Trainers
							</Button>
						</p>

						<div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr]">
							<div>
								<div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
									<RevealImage
										src={trainer.image.src}
										alt={trainer.image.alt}
										fill
										sizes="(min-width: 1024px) 340px, 100vw"
										className="object-cover object-top"
										priority
									/>
								</div>

								<blockquote className="mt-6 border-l-2 border-primary pl-4 font-display text-lg italic text-text">
									&ldquo;{trainer.philosophy}&rdquo;
								</blockquote>
							</div>

							<div>
								<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">{trainer.role}</p>
								<h1 className="mb-2 font-display text-3xl font-bold text-text sm:text-4xl">{trainer.name}</h1>
								<p className="mb-8 text-sm text-text-subtle">{trainer.experience}</p>

								<div className="max-w-2xl space-y-5 text-base leading-relaxed text-text-muted">
									{trainer.longBio.map((paragraph, index) => (
										<p key={index}>{paragraph}</p>
									))}
								</div>

								<div className="mt-10 grid gap-8 sm:grid-cols-2">
									<div>
										<h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-text">
											Certifications
										</h2>
										<ul className="space-y-2 text-sm text-text-muted">
											{trainer.certifications.map((certification) => (
												<li key={certification} className="flex gap-2">
													<span className="text-primary">&bull;</span>
													{certification}
												</li>
											))}
										</ul>
									</div>

									<div>
										<h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-text">
											Specialties
										</h2>
										<div className="flex flex-wrap gap-2">
											{trainer.specialties.map((specialty) => (
												<Badge key={specialty} tone="neutral">
													{specialty}
												</Badge>
											))}
										</div>
									</div>
								</div>

								<Button href="/contact" className="mt-10">
									Book a Session with {trainer.name.split(" ")[0]}
								</Button>
							</div>
						</div>
					</Container>
				</article>

				{related.length > 0 && (
					<section className="border-t border-border bg-secondary py-24">
						<Container>
							<h2 className="mb-10 text-center font-display text-2xl font-semibold text-text">Meet the Rest of the Team</h2>
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{related.map((relatedTrainer) => (
									<TrainerCard key={relatedTrainer.id} trainer={relatedTrainer} />
								))}
							</div>
						</Container>
					</section>
				)}

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
