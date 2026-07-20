export interface Trainer {
	id: string;
	name: string;
	role: string;
	experience: string;
	bio: string;
	image: { src: string; alt: string };
	/** Longer-form paragraphs for the dedicated profile page — the card only shows `bio`. */
	longBio: string[];
	certifications: string[];
	specialties: string[];
	/** A short first-person coaching philosophy, pulled out as a quote on the profile page. */
	philosophy: string;
}
