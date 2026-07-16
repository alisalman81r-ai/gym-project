import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { ContactForm } from "@/components/ui";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
	title: "Contact & Book a Tour",
	description: "Get in touch with Iron Elite Fitness Club or book your complimentary tour and fitness assessment.",
};

export default function ContactPage() {
	return (
		<>
			<Navbar />
			<main>
				<section className="bg-secondary pb-20 pt-36 text-center">
					<Container>
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Contact</p>
						<h1 className="font-display text-4xl font-bold text-text sm:text-5xl">Let&rsquo;s Start Your Story.</h1>
					</Container>
				</section>

				<section className="py-24">
					<Container>
						<div className="grid gap-12 lg:grid-cols-2">
							<ContactForm />

							<div>
								<h2 className="mb-4 font-display text-2xl font-semibold text-text">Visit The Club</h2>
								<address className="mb-6 space-y-1 text-sm not-italic text-text-muted">
									<p>128 Riverside Ave, Springfield</p>
									<p>
										<a href="tel:+15552104488" className="hover:text-text">
											(555) 210-4488
										</a>
									</p>
									<p>
										<a href={`mailto:hello@${siteConfig.url.replace(/^https?:\/\/(www\.)?/, "")}`} className="hover:text-text">
											hello@ironelitefitnessclub.com
										</a>
									</p>
								</address>

								<table className="mb-6 w-full text-sm">
									<tbody>
										<tr className="border-b border-border">
											<th scope="row" className="py-2 text-left font-semibold text-text">
												Monday &ndash; Friday
											</th>
											<td className="py-2 text-right text-text-muted">5:00 AM &ndash; 11:00 PM</td>
										</tr>
										<tr>
											<th scope="row" className="py-2 text-left font-semibold text-text">
												Saturday &ndash; Sunday
											</th>
											<td className="py-2 text-right text-text-muted">7:00 AM &ndash; 8:00 PM</td>
										</tr>
									</tbody>
								</table>

								<a
									href="https://www.google.com/maps/search/?api=1&query=128+Riverside+Ave+Springfield"
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm font-semibold text-primary hover:underline"
								>
									Get Directions &rarr;
								</a>
							</div>
						</div>
					</Container>
				</section>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
