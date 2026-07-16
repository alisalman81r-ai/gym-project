import { siteConfig } from "@/constants/site";

/**
 * schema.org HealthClub JSON-LD for the business itself -- rendered
 * once in the root layout so it's present on every page. Static,
 * fully-controlled data (not user input), so the standard Next.js
 * `dangerouslySetInnerHTML` pattern for structured data is safe here.
 */
export function StructuredData() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "HealthClub",
		name: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		image: `${siteConfig.url}/images/hero/hero-main.jpg`,
		telephone: "+1-555-210-4488",
		priceRange: "$$$",
		address: {
			"@type": "PostalAddress",
			streetAddress: "128 Riverside Ave",
			addressLocality: "Springfield",
			addressCountry: "US",
		},
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "05:00",
				closes: "23:00",
			},
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Saturday", "Sunday"],
				opens: "07:00",
				closes: "20:00",
			},
		],
	};

	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
