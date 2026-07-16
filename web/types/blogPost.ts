export interface BlogPost {
	id: string;
	slug: string;
	title: string;
	category: string;
	excerpt: string;
	body: string[];
	author: string;
	date: string;
	readTime: string;
	image: { src: string; alt: string };
}
