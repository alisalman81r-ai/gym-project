"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth";
import { getMembershipById, approveMembershipManually, rejectMembership } from "@/lib/store/memberships";
import { createNotification } from "@/lib/store/notifications";

// Defense in depth: Proxy already gates /admin, but Server Actions are
// their own entry point and must verify the session independently.
async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export async function approveMembershipAction(id: number): Promise<void> {
	await assertAdmin();
	const membership = getMembershipById(id);
	if (!membership) return;

	approveMembershipManually(id);

	if (membership.userId) {
		createNotification({
			userId: membership.userId,
			type: "membership_approved",
			title: "Your membership was approved!",
			body: `Welcome to ${membership.planName} — you're all set.`,
			link: "/account",
		});
	}

	revalidatePath("/admin/memberships");
}

export async function rejectMembershipAction(id: number): Promise<void> {
	await assertAdmin();
	const membership = getMembershipById(id);
	if (!membership) return;

	rejectMembership(id);

	if (membership.userId) {
		createNotification({
			userId: membership.userId,
			type: "membership_rejected",
			title: "Your membership application wasn't approved",
			body: `We weren't able to approve your ${membership.planName} application. Contact us for details.`,
			link: "/contact",
		});
	}

	revalidatePath("/admin/memberships");
}
