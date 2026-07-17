import { Container } from "@/components/layout";
import { CouponForm } from "@/components/admin/CouponForm";
import { createCouponAction } from "../actions";

export const metadata = { title: "Add Coupon" };

export default function NewCouponPage() {
	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Add Coupon</h1>
				<CouponForm action={createCouponAction} submitLabel="Create Coupon" />
			</Container>
		</main>
	);
}
