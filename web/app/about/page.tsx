import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { SectionTitle, Timeline, CtaBanner, RevealImage, PageHeader } from "@/components/ui";
import { FeatureCard } from "@/components/cards";
import { TIMELINE } from "@/constants/timeline";
import { VALUES } from "@/constants/values";
import { siteConfig } from "@/constants/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "About Us",
	description: "The story, values, and standards behind Iron Elite Fitness Club.",
	path: "/about",
});

export default function AboutPage() {
	return (
		<>
			<Navbar />
			<main>
				<PageHeader eyebrow="Our Story" title="Built On Discipline, Not Trends." />

				{/* Origin timeline */}
				<section className="py-24">
					<Container>
						<SectionTitle eyebrow="Our Origin" title="Twelve Years of Raising the Standard" />
						<Timeline events={TIMELINE} />
					</Container>
				</section>

				{/* Values */}
				<section className="bg-secondary py-24">
					<Container>
						<SectionTitle eyebrow="What We Stand For" title="Our Values" />
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{VALUES.map((value) => (
								<FeatureCard key={value.id} feature={value} />
							))}
						</div>
					</Container>
				</section>

				{/* Founder message */}
				<section className="py-24">
					<Container>
						<div className="grid items-center gap-12 lg:grid-cols-2">
							<div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl shadow-elevated">
								<RevealImage
									src="/images/trainers/marcus-reed.jpg"
									alt="Portrait of James Calloway, Founder of Iron Elite Fitness Club"
									fill
									sizes="(min-width: 1024px) 400px, 320px"
									className="object-cover object-top"
								/>
							</div>
							<div>
								<p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
									A Message From Our Founder
								</p>
								<blockquote className="font-display text-xl italic text-text sm:text-2xl">
									&ldquo;We didn&rsquo;t set out to build the biggest gym in the city. We set out to build the
									one where results were never left to chance &mdash; where every member trains with a real
									plan, and a coach who&rsquo;s accountable to it.&rdquo;
								</blockquote>
								<p className="mt-4 font-semibold text-text">
									James Calloway <span className="font-normal text-text-muted">&mdash; Founder, {siteConfig.name}</span>
								</p>
							</div>
						</div>
					</Container>
				</section>

				<CtaBanner
					eyebrow="Visit The Club"
					title="See The Club For Yourself."
					description="The best way to understand Iron Elite is to walk the floor. Book a complimentary tour."
					primaryCta={{ label: "Book a Tour", href: "/contact" }}
				/>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
