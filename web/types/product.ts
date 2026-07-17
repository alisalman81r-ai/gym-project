export type ProductType = "clothing" | "supplement";
export type ProductStatus = "active" | "inactive";

export interface ProductImage {
	id: number;
	url: string;
	sortOrder: number;
}

export interface Product {
	id: number;
	slug: string;
	name: string;
	productType: ProductType;
	categoryId: number | null;
	categoryName: string | null;
	brandId: number | null;
	brandName: string | null;
	description: string;
	price: number;
	discountPrice: number | null;
	stockQuantity: number;
	weightOrFlavor: string | null;
	featured: boolean;
	status: ProductStatus;
	ratingAvg: number;
	ratingCount: number;
	images: ProductImage[];
	sizes: string[];
	colors: string[];
	createdAt: string;
}
