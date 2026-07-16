import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
	const body = await request.json();
	const name = String(body.name ?? "").trim();
	const email = String(body.email ?? "").trim();
	const phone = String(body.phone ?? "").trim();
	const interest = String(body.interest ?? "general").trim();
	const message = String(body.message ?? "").trim();

	if (!name || !email || !EMAIL_PATTERN.test(email) || !message) {
		return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
	}

	db.prepare(
		`INSERT INTO contact_submissions (name, email, phone, interest, message) VALUES (?, ?, ?, ?, ?)`
	).run(name, email, phone || null, interest, message);

	return NextResponse.json({ ok: true });
}
