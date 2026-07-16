export interface Supplement {
	id: string;
	name: string;
	category: string;
	price: number;
	description: string;
	image: { src: string; alt: string };
}
