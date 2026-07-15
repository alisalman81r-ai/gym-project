import { CtaBanner } from "@/components/ui";

/** Final conversion band before the footer. */
export function ContactCtaSection() {
	return (
		<CtaBanner
			title="Your Transformation Starts Here."
			description="Book a complimentary tour and see why members never leave."
			primaryCta={{ label: "Book Your Tour Today", href: "/contact" }}
		/>
	);
}
