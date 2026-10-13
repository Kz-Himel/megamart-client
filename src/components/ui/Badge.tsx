import React from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant =
  | "primary"
  | "deal"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "outline";

export type BadgeSize = "xs" | "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  showDot?: boolean;
  shape?: "pill" | "rounded";
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  primary: {
    container: "bg-[#EBF6FC] text-[#008ECC] border border-[#008ECC]/20",
    dot: "bg-[#008ECC]",
  },
  deal: {
    container: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  success: {
    container: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  warning: {
    container: "bg-amber-50 text-amber-800 border border-amber-200",
    dot: "bg-amber-500",
  },
  danger: {
    container: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-500",
  },
  neutral: {
    container: "bg-slate-100 text-slate-700 border border-slate-200",
    dot: "bg-slate-400",
  },
  outline: {
    container: "bg-white text-slate-700 border border-slate-200",
    dot: "bg-slate-500",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "px-2 py-0.5 text-[10px] gap-1",
  sm: "px-2.5 py-0.5 text-xs gap-1.5",
  md: "px-3 py-1 text-xs font-semibold gap-1.5",
};

export function Badge({
  className,
  variant = "primary",
  size = "sm",
  showDot = false,
  shape = "pill",
  children,
  ...props
}: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium leading-none select-none tracking-wide",
        styles.container,
        sizeStyles[size],
        shape === "pill" ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", styles.dot)}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
