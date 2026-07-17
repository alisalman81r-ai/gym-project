"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth";
import { approveReview, deleteReview } from "@/lib/store/reviews";

async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export async function approveReviewAction(id: number): Promise<void> {
	await assertAdmin();
	approveReview(id);
	revalidatePath("/admin/reviews");
}

export async function deleteReviewAction(id: number): Promise<void> {
	await assertAdmin();
	deleteReview(id);
	revalidatePath("/admin/reviews");
}
