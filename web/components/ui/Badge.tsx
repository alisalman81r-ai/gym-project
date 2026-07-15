import { cn } from "@/lib/utils";

export type BadgeTone = "gold" | "success" | "error" | "neutral";

export interface BadgeProps {
	children: React.ReactNode;
	tone?: BadgeTone;
	className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
	gold: "bg-gradient-to-br from-primary-light to-primary text-background",
	success: "bg-success/15 text-success",
	error: "bg-error/15 text-error",
	neutral: "border border-border text-text-muted",
};

/** Small pill label — plan badges ("Most Popular"), category tags, etc. */
export function Badge({ children, tone = "gold", className }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-4 py-1 text-[0.7rem] font-bold uppercase tracking-wider",
				TONE_CLASSES[tone],
				className
			)}
		>
			{children}
		</span>
	);
}
