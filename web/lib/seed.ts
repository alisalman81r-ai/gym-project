import type Database from "better-sqlite3";

interface SeedProduct {
	slug: string;
	name: string;
	productType: "clothing" | "supplement";
	category: string;
	brand: string;
	description: string;
	price: number;
	discountPrice: number | null;
	stockQuantity: number;
	weightOrFlavor: string | null;
	featured: boolean;
	images: string[];
	sizes: string[];
	colors: string[];
}

const SEED_PRODUCTS: SeedProduct[] = [
	// -- Supplements (real product photography already in the repo) --
	{
		slug: "whey-protein-isolate",
		name: "Whey Protein Isolate",
		productType: "supplement",
		category: "Protein",
		brand: "Iron Elite",
		description: "25g of fast-absorbing protein per scoop to support muscle repair after training.",
		price: 54.99,
		discountPrice: null,
		stockQuantity: 40,
		weightOrFlavor: "Chocolate, 2 lb",
		featured: true,
		images: ["/images/supplements/whey-protein-isolate.jpg"],
		sizes: [],
		colors: [],
	},
	{
		slug: "creatine-monohydrate",
		name: "Creatine Monohydrate",
		productType: "supplement",
		category: "Performance",
		brand: "Iron Elite",
		description:
			"Micronized, unflavored creatine for strength and power output — the most researched supplement in sports nutrition.",
		price: 29.99,
		discountPrice: null,
		stockQuantity: 60,
		weightOrFlavor: "Unflavored, 300 g",
		featured: false,
		images: ["/images/supplements/creatine-monohydrate.jpg"],
		sizes: [],
		colors: [],
	},
	{
		slug: "pre-workout-igniter",
		name: "Pre-Workout Igniter",
		productType: "supplement",
		category: "Pre-Workout",
		brand: "Iron Elite",
		description: "A balanced dose of caffeine and citrulline malate to sharpen focus and energy before a session.",
		price: 39.99,
		discountPrice: 34.99,
		stockQuantity: 35,
		weightOrFlavor: "Fruit Punch, 30 servings",
		featured: true,
		images: ["/images/supplements/pre-workout-igniter.jpg"],
		sizes: [],
		colors: [],
	},
	{
		slug: "bcaa-recovery-blend",
		name: "BCAA Recovery Blend",
		productType: "supplement",
		category: "Recovery",
		brand: "Iron Elite",
		description: "A 2:1:1 branched-chain amino acid ratio to reduce soreness and support recovery between sessions.",
		price: 34.99,
		discountPrice: null,
		stockQuantity: 25,
		weightOrFlavor: "Mango, 400 g",
		featured: false,
		images: ["/images/supplements/bcaa-recovery-blend.jpg"],
		sizes: [],
		colors: [],
	},
	{
		slug: "daily-multivitamin",
		name: "Daily Multivitamin",
		productType: "supplement",
		category: "Wellness",
		brand: "Iron Elite",
		description: "A complete daily foundation of essential vitamins and minerals for active lifestyles.",
		price: 24.99,
		discountPrice: null,
		stockQuantity: 50,
		weightOrFlavor: "60 capsules",
		featured: false,
		images: ["/images/supplements/daily-multivitamin.jpg"],
		sizes: [],
		colors: [],
	},
	{
		slug: "electrolyte-hydration-mix",
		name: "Electrolyte Hydration Mix",
		productType: "supplement",
		category: "Hydration",
		brand: "Iron Elite",
		description: "Sugar-free electrolyte packets to replace what you sweat out during long or hot sessions.",
		price: 19.99,
		discountPrice: null,
		stockQuantity: 3,
		weightOrFlavor: "Lemon-Lime, 20 packets",
		featured: false,
		images: ["/images/supplements/electrolyte-hydration-mix.jpg"],
		sizes: [],
		colors: [],
	},

	// -- Gym clothing (real Unsplash photography, see public/images/README.md) --
	{
		slug: "performance-training-tee",
		name: "Performance Training Tee",
		productType: "clothing",
		category: "T-Shirts",
		brand: "Iron Elite",
		description: "A moisture-wicking training tee cut for full range of motion, with a flatlock seam that won't chafe under a barbell.",
		price: 34.99,
		discountPrice: 27.99,
		stockQuantity: 80,
		weightOrFlavor: null,
		featured: true,
		images: ["/images/products/performance-training-tee.jpg"],
		sizes: ["S", "M", "L", "XL", "XXL"],
		colors: ["Black", "Charcoal", "Gold"],
	},
	{
		slug: "compression-shorts",
		name: "Iron Elite Compression Shorts",
		productType: "clothing",
		category: "Shorts",
		brand: "Iron Elite",
		description: "Four-way stretch compression shorts with a wide waistband that stays put through heavy sets.",
		price: 29.99,
		discountPrice: null,
		stockQuantity: 60,
		weightOrFlavor: null,
		featured: false,
		images: ["/images/products/compression-shorts.jpg"],
		sizes: ["S", "M", "L", "XL"],
		colors: ["Black", "Navy"],
	},
	{
		slug: "elite-zip-hoodie",
		name: "Elite Zip Hoodie",
		productType: "clothing",
		category: "Hoodies",
		brand: "Iron Elite",
		description: "A heavyweight fleece zip hoodie for the walk in and the walk out — brushed interior, ribbed cuffs.",
		price: 64.99,
		discountPrice: 54.99,
		stockQuantity: 40,
		weightOrFlavor: null,
		featured: true,
		images: ["/images/products/elite-zip-hoodie.jpg"],
		sizes: ["S", "M", "L", "XL", "XXL"],
		colors: ["Black", "Heather Grey"],
	},
	{
		slug: "training-leggings",
		name: "High-Waist Training Leggings",
		productType: "clothing",
		category: "Leggings",
		brand: "Iron Elite",
		description: "Squat-proof high-waist leggings with a hidden pocket for a key or card.",
		price: 49.99,
		discountPrice: null,
		stockQuantity: 50,
		weightOrFlavor: null,
		featured: false,
		images: ["/images/products/training-leggings.jpg"],
		sizes: ["XS", "S", "M", "L", "XL"],
		colors: ["Black", "Olive"],
	},
	{
		slug: "iron-elite-tank",
		name: "Iron Elite Tank Top",
		productType: "clothing",
		category: "T-Shirts",
		brand: "Iron Elite",
		description: "A lightweight racerback tank for high-volume training days.",
		price: 27.99,
		discountPrice: null,
		stockQuantity: 4,
		weightOrFlavor: null,
		featured: false,
		images: ["/images/products/iron-elite-tank.jpg"],
		sizes: ["S", "M", "L", "XL"],
		colors: ["White", "Black"],
	},
	{
		slug: "coach-quarter-zip",
		name: "Coach's Quarter-Zip Pullover",
		productType: "clothing",
		category: "Hoodies",
		brand: "Iron Elite",
		description: "A clean quarter-zip pullover for coaching sessions or the commute home.",
		price: 59.99,
		discountPrice: null,
		stockQuantity: 30,
		weightOrFlavor: null,
		featured: false,
		images: ["/images/products/coach-quarter-zip.jpg"],
		sizes: ["S", "M", "L", "XL", "XXL"],
		colors: ["Charcoal", "Black"],
	},
];

function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

/** Idempotent -- only runs against a fresh database with no products yet. */
export function seedProductsIfEmpty(db: Database.Database): void {
	const { count } = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
	if (count > 0) return;

	const insertCategory = db.prepare(
		"INSERT OR IGNORE INTO categories (slug, name, product_type) VALUES (?, ?, ?)"
	);
	const insertBrand = db.prepare("INSERT OR IGNORE INTO brands (slug, name) VALUES (?, ?)");
	const getCategoryId = db.prepare("SELECT id FROM categories WHERE slug = ? AND product_type = ?");
	const getBrandId = db.prepare("SELECT id FROM brands WHERE slug = ?");

	const insertProduct = db.prepare(`
		INSERT INTO products
			(slug, name, product_type, category_id, brand_id, description, price, discount_price, stock_quantity, weight_or_flavor, featured, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
	`);
	const insertImage = db.prepare("INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)");
	const insertSize = db.prepare("INSERT INTO product_sizes (product_id, size) VALUES (?, ?)");
	const insertColor = db.prepare("INSERT INTO product_colors (product_id, color) VALUES (?, ?)");

	const seedAll = db.transaction(() => {
		for (const product of SEED_PRODUCTS) {
			const categorySlug = slugify(product.category);
			insertCategory.run(categorySlug, product.category, product.productType);
			const brandSlug = slugify(product.brand);
			insertBrand.run(brandSlug, product.brand);

			const category = getCategoryId.get(categorySlug, product.productType) as { id: number } | undefined;
			const brand = getBrandId.get(brandSlug) as { id: number } | undefined;

			const result = insertProduct.run(
				product.slug,
				product.name,
				product.productType,
				category?.id ?? null,
				brand?.id ?? null,
				product.description,
				product.price,
				product.discountPrice,
				product.stockQuantity,
				product.weightOrFlavor,
				product.featured ? 1 : 0
			);
			const productId = Number(result.lastInsertRowid);

			product.images.forEach((url, index) => insertImage.run(productId, url, index));
			product.sizes.forEach((size) => insertSize.run(productId, size));
			product.colors.forEach((color) => insertColor.run(productId, color));
		}
	});

	seedAll();
}
