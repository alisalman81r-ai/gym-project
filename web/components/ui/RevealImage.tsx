"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export type RevealImageProps = ImageProps;

/**
 * A `next/image` wrapper that fades in once the browser actually
 * has pixels to show, instead of popping in abruptly. Every image
 * on the site should go through this rather than calling `Image`
 * directly, so "image reveal" behavior stays consistent in one
 * place. Placeholder SVGs decode near-instantly so the fade is
 * barely visible today — it earns its keep once real, heavier
 * photography replaces them (see public/images/README.md).
 *
 * Uses `transition-all` rather than `transition-opacity` on
 * purpose: callers often add their own `group-hover:scale-*` for a
 * zoom effect, and `transition-opacity` + `transition-transform`
 * both set the same CSS `transition-property` -- tailwind-merge
 * would keep only the last one and silently drop the fade.
 */
export function RevealImage({ alt, className, onLoad, ...props }: RevealImageProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<Image
			{...props}
			alt={alt}
			onLoad={(event) => {
				setIsLoaded(true);
				onLoad?.(event);
			}}
			className={cn("transition-all duration-500 ease-out", isLoaded ? "opacity-100" : "opacity-0", className)}
		/>
	);
}
