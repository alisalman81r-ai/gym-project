import { NextResponse } from "next/server";
import { getCartKeyReadonly, getCartItemCount } from "@/lib/store/cart";

export async function GET() {
	const cartKey = await getCartKeyReadonly();
	const count = await getCartItemCount(cartKey);
	return NextResponse.json({ count });
}
