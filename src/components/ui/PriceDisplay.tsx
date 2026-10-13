import React from "react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency, calculateSavingsPercent } from "@/lib/utils/formatters";

export interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSavingsBadge?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: {
    symbol: "text-xs",
    price: "text-sm",
    compare: "text-xs",
  },
  md: {
    symbol: "text-sm",
    price: "text-base sm:text-lg",
    compare: "text-xs",
  },
  lg: {
    symbol: "text-base",
    price: "text-xl sm:text-2xl",
    compare: "text-sm",
  },
  xl: {
    symbol: "text-lg",
    price: "text-2xl sm:text-3xl",
    compare: "text-sm sm:text-base",
  },
};

export function PriceDisplay({
  price,
  comparePrice,
  currency = "$",
  size = "md",
  showSavingsBadge = true,
  className,
}: PriceDisplayProps) {
  const styles = sizeStyles[size];
  const savingsPercent = calculateSavingsPercent(price, comparePrice);

  return (
    <div className={cn("inline-flex items-baseline gap-2 font-mono flex-wrap", className)}>
      {/* Current Active Price */}
      <div className="flex items-baseline font-bold text-slate-900 tracking-tight">
        <span className={cn(styles.symbol, "text-[#008ECC] mr-0.5")}>{currency}</span>
        <span className={cn(styles.price, "font-extrabold")}>{price.toFixed(2)}</span>
      </div>

      {/* Compare / Original Price (Strikethrough) */}
      {comparePrice && comparePrice > price && (
        <span
          className={cn(
            styles.compare,
            "text-slate-400 line-through font-normal select-none"
          )}
        >
          {formatCurrency(comparePrice, currency)}
        </span>
      )}

      {/* Savings Percentage Badge */}
      {showSavingsBadge && savingsPercent !== null && (
        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
          Save {savingsPercent}%
        </span>
      )}
    </div>
  );
}
