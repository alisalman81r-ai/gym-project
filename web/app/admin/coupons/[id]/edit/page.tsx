import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { CouponForm } from "@/components/admin/CouponForm";
import { getCouponById } from "@/lib/store/coupons";
import { updateCouponAction } from "../../actions";

export const metadata = { title: "Edit Coupon" };

// Reads the coupon live for editing -- must not be statically cached.
export const dynamic = "force-dynamic";

interface EditCouponPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: EditCouponPageProps) {
	const { id } = await params;
	const coupon = getCouponById(Number(id));
	if (!coupon) notFound();

	const boundAction = updateCouponAction.bind(null, coupon.id);

	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Edit Coupon</h1>
				<CouponForm action={boundAction} coupon={coupon} submitLabel="Save Changes" />
			</Container>
		</main>
	);
}
