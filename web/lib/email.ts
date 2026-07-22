import nodemailer from "nodemailer";

/**
 * Real outbound email via SMTP -- provider-agnostic (Gmail, Outlook, Zoho,
 * a hosting provider, or a transactional service's SMTP relay all work the
 * same way here). Nothing is sent until SMTP_HOST/PORT/USER/PASSWORD are
 * set in .env.local; until then callers get a clear "not configured"
 * result instead of a silent no-op or a thrown error.
 */

declare global {
	var __emailTransporter: nodemailer.Transporter | undefined;
}

function getTransporter(): nodemailer.Transporter | null {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
	if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) return null;

	if (!globalThis.__emailTransporter) {
		globalThis.__emailTransporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: Number(SMTP_PORT),
			secure: Number(SMTP_PORT) === 465,
			auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
		});
	}
	return globalThis.__emailTransporter;
}

export interface SendEmailInput {
	to: string;
	subject: string;
	text: string;
}

export interface SendEmailResult {
	sent: boolean;
	/** Present only when `sent` is false -- surfaced directly in the admin UI. */
	error?: string;
}

export async function sendEmail({ to, subject, text }: SendEmailInput): Promise<SendEmailResult> {
	const transporter = getTransporter();
	if (!transporter) {
		return {
			sent: false,
			error: "Email isn't configured yet — add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD to .env.local.",
		};
	}

	try {
		await transporter.sendMail({
			from: process.env.EMAIL_FROM || process.env.SMTP_USER,
			to,
			subject,
			text,
		});
		return { sent: true };
	} catch (error) {
		return { sent: false, error: error instanceof Error ? error.message : "Failed to send email." };
	}
}
