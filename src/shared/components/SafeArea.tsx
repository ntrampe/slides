import clsx from "clsx";
import type { ReactNode, HTMLAttributes } from "react";

export type SafeInset =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "x"
    | "y"
    | "all"
    | "none";

interface SafeAreaProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    inset?: SafeInset;
}

/**
 * SafeArea
 *
 * Applies mobile safe-area padding using tailwindcss-safe-area utilities.
 * Intended to be used ONLY at layout boundaries (headers, footers, overlays).
 *
 * Child components should remain safe-area agnostic.
 */
export function SafeArea({
    children,
    inset = "all",
    className,
    ...rest
}: SafeAreaProps) {
    const safeClass = {
        top: "pt-safe",
        bottom: "pb-safe",
        left: "pl-safe",
        right: "pr-safe",
        x: "px-safe",
        y: "py-safe",
        all: "p-safe",
        none: "",
    }[inset];

    return (
        <div className={clsx(safeClass, className)} {...rest}>
            {children}
        </div>
    );
}