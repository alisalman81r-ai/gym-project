export interface CustomerAddress {
	id: number;
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	postalCode: string;
	isDefault: boolean;
}

export interface CustomerUser {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	isBlocked: boolean;
	createdAt: string;
}
