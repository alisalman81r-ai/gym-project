import { cn } from "@/lib/utils";

export interface ContainerProps {
	children: React.ReactNode;
	className?: string;
}

/** Centered max-width wrapper — the horizontal rhythm every section shares. */
export function Container({ children, className }: ContainerProps) {
	return <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8 2xl:max-w-[1400px]", className)}>{children}</div>;
}
