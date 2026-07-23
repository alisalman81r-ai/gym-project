import { Container } from "@/components/layout";
import { ChatAdminPanel } from "@/components/admin/ChatAdminPanel";

export const metadata = { title: "Live Chat" };

export default function AdminChatPage() {
	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Live Chat</h1>
				<ChatAdminPanel />
			</Container>
		</main>
	);
}
