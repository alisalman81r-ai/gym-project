export interface Review {
	id: number;
	productId: number;
	userId: number | null;
	customerName: string;
	rating: number;
	comment: string;
	imageUrl: string | null;
	approved: boolean;
	createdAt: string;
}
