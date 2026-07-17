"use client";

export function PrintInvoiceButton() {
	return (
		<button
			type="button"
			onClick={() => window.print()}
			className="rounded-full border border-border px-6 py-2 text-sm font-semibold text-text-muted transition-colors hover:border-primary/60 hover:text-text"
		>
			Print Invoice
		</button>
	);
}
