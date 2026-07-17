"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createProduct, updateProduct, deleteProduct, type ProductInput } from "@/lib/store/products";
import { saveUploadedImage, UploadError } from "@/lib/upload";
import type { ProductType, ProductStatus } from "@/types";

async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export interface ProductFormState {
	error?: string;
}

function parseCommaList(value: FormDataEntryValue | null): string[] {
	return String(value ?? "")
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean);
}

async function buildProductInput(formData: FormData): Promise<{ input: ProductInput } | { error: string }> {
	const name = String(formData.get("name") ?? "").trim();
	const productType = String(formData.get("productType") ?? "") as ProductType;
	const categoryName = String(formData.get("categoryName") ?? "").trim();
	const brandName = String(formData.get("brandName") ?? "").trim() || "Iron Elite";
	const description = String(formData.get("description") ?? "").trim();
	const price = Number(formData.get("price"));
	const discountPriceRaw = String(formData.get("discountPrice") ?? "").trim();
	const discountPrice = discountPriceRaw ? Number(discountPriceRaw) : null;
	const stockQuantity = Number(formData.get("stockQuantity"));
	const weightOrFlavor = String(formData.get("weightOrFlavor") ?? "").trim() || null;
	const featured = formData.get("featured") === "on";
	const status = (String(formData.get("status") ?? "active") as ProductStatus) === "inactive" ? "inactive" : "active";
	const sizes = parseCommaList(formData.get("sizes"));
	const colors = parseCommaList(formData.get("colors"));

	if (
		!name ||
		(productType !== "clothing" && productType !== "supplement") ||
		!categoryName ||
		!description ||
		!Number.isFinite(price) ||
		price <= 0 ||
		!Number.isFinite(stockQuantity) ||
		stockQuantity < 0
	) {
		return { error: "Please fill in all required fields with valid values." };
	}
	if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice <= 0 || discountPrice >= price)) {
		return { error: "Discount price must be a positive number less than the regular price." };
	}

	const keepImages = formData.getAll("keepImages").map(String).filter(Boolean);
	const newImageFiles = formData.getAll("newImages").filter((entry): entry is File => entry instanceof File && entry.size > 0);

	const uploadedUrls: string[] = [];
	for (const file of newImageFiles) {
		try {
			uploadedUrls.push(await saveUploadedImage(file));
		} catch (error) {
			return { error: error instanceof UploadError ? error.message : "Could not upload one of the images." };
		}
	}

	return {
		input: {
			name,
			productType,
			categoryName,
			brandName,
			description,
			price,
			discountPrice,
			stockQuantity,
			weightOrFlavor,
			featured,
			status,
			images: [...keepImages, ...uploadedUrls],
			sizes,
			colors,
		},
	};
}

export async function createProductAction(_prevState: ProductFormState | undefined, formData: FormData): Promise<ProductFormState> {
	await assertAdmin();
	const result = await buildProductInput(formData);
	if ("error" in result) return { error: result.error };

	createProduct(result.input);
	revalidatePath("/admin/products");
	redirect("/admin/products");
}

export async function updateProductAction(
	id: number,
	_prevState: ProductFormState | undefined,
	formData: FormData
): Promise<ProductFormState> {
	await assertAdmin();
	const result = await buildProductInput(formData);
	if ("error" in result) return { error: result.error };

	updateProduct(id, result.input);
	revalidatePath("/admin/products");
	revalidatePath(`/admin/products/${id}/edit`);
	redirect("/admin/products");
}

export async function deleteProductAction(id: number): Promise<void> {
	await assertAdmin();
	deleteProduct(id);
	revalidatePath("/admin/products");
}

export async function toggleFeaturedAction(id: number, featured: boolean): Promise<void> {
	await assertAdmin();
	db.prepare("UPDATE products SET featured = ? WHERE id = ?").run(featured ? 1 : 0, id);
	revalidatePath("/admin/products");
}

export async function updateStockAction(id: number, stockQuantity: number): Promise<void> {
	await assertAdmin();
	db.prepare("UPDATE products SET stock_quantity = ? WHERE id = ?").run(Math.max(0, stockQuantity), id);
	revalidatePath("/admin/products");
}
