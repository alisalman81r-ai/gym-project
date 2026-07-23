export interface Notification {
	id: number;
	userId: number;
	type: string;
	title: string;
	body: string | null;
	link: string | null;
	isRead: boolean;
	createdAt: string;
}
