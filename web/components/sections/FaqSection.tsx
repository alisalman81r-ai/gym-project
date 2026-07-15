import { Container } from "@/components/layout";
import { SectionTitle, Accordion } from "@/components/ui";
import { FAQ_ITEMS } from "@/constants/faq";

/** Frequently asked questions -- multi-open accordion. */
export function FaqSection() {
	return (
		<section className="py-24">
			<Container>
				<SectionTitle eyebrow="Questions" title="Frequently Asked Questions" />
				<Accordion items={FAQ_ITEMS} />
			</Container>
		</section>
	);
}
