"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
	children: React.ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	className?: string;
	/** Renders as a Next `Link` when provided; a native `<button>` otherwise. */
	href?: string;
	onClick?: () => void;
	type?: "button" | "submit";
	disabled?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary:
		"bg-gradient-to-br from-primary-light to-primary text-background shadow-gold hover:shadow-[0_14px_32px_rgba(201,162,39,0.35)]",
	secondary: "border border-primary text-text hover:bg-primary hover:text-background",
	ghost: "text-primary p-0",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
	sm: "px-5 py-2 text-xs",
	md: "px-6 py-3 text-sm",
	lg: "px-8 py-4 text-base",
};

const BASE_CLASSES =
	"inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none";

const GHOST_UNDERLINE_CLASSES =
	"relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

/**
 * The site's single button primitive. Supports a `primary` (gold
 * fill), `secondary` (outline), and `ghost` (text-only) variant,
 * three sizes, and renders as a link or a native button depending
 * on whether `href` is passed.
 */
export function Button({
	children,
	variant = "primary",
	size = "md",
	className,
	href,
	onClick,
	type = "button",
	disabled,
}: ButtonProps) {
	const isGhost = variant === "ghost";

	const classes = cn(
		BASE_CLASSES,
		VARIANT_CLASSES[variant],
		!isGhost && SIZE_CLASSES[size],
		isGhost && GHOST_UNDERLINE_CLASSES,
		className
	);

	const motionProps = {
		whileHover: disabled ? undefined : { scale: isGhost ? 1 : 1.03 },
		whileTap: disabled ? undefined : { scale: isGhost ? 1 : 0.97 },
		transition: { duration: 0.2 },
	};

	if (href) {
		return (
			<motion.span {...motionProps} className="inline-block">
				<Link href={href} onClick={onClick} className={classes}>
					{children}
				</Link>
			</motion.span>
		);
	}

	return (
		<motion.button type={type} onClick={onClick} disabled={disabled} className={classes} {...motionProps}>
			{children}
		</motion.button>
	);
}
