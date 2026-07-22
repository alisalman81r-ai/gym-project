import type { Metadata } from "next";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const metadata: Metadata = {
	title: "Admin",
	robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background">
			<AdminTopbar adminUsername={process.env.ADMIN_USERNAME} />
			{children}
		</div>
	);
}
