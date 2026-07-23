import { db } from "@/lib/db";
import type { Notification } from "@/types";

interface NotificationRow {
	id: number;
	user_id: number;
	type: string;
	title: string;
	body: string | null;
	link: string | null;
	is_read: number;
	created_at: string;
}

function mapNotification(row: NotificationRow): Notification {
	return {
		id: row.id,
		userId: row.user_id,
		type: row.type,
		title: row.title,
		body: row.body,
		link: row.link,
		isRead: Boolean(row.is_read),
		createdAt: row.created_at,
	};
}

export interface CreateNotificationInput {
	userId: number;
	type: string;
	title: string;
	body?: string;
	link?: string;
}

export function createNotification(input: CreateNotificationInput): Notification {
	const result = db
		.prepare("INSERT INTO notifications (user_id, type, title, body, link) VALUES (?, ?, ?, ?, ?)")
		.run(input.userId, input.type, input.title, input.body ?? null, input.link ?? null);
	const row = db.prepare("SELECT * FROM notifications WHERE id = ?").get(result.lastInsertRowid) as NotificationRow;
	return mapNotification(row);
}

export function listNotificationsForUser(userId: number, limit = 20): Notification[] {
	const rows = db
		.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT ?")
		.all(userId, limit) as NotificationRow[];
	return rows.map(mapNotification);
}

export function getUnreadCount(userId: number): number {
	const row = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0").get(userId) as {
		count: number;
	};
	return row.count;
}

export function markAllRead(userId: number): void {
	db.prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0").run(userId);
}

export function markOneRead(userId: number, notificationId: number): void {
	db.prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ? AND id = ?").run(userId, notificationId);
}
