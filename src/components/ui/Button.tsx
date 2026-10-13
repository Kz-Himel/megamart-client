"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "deal"
  | "danger"
  | "subtle";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#008ECC] text-white hover:bg-[#0073A8] shadow-sm active:scale-[0.98] border border-transparent",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.98] border border-transparent",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:border-[#008ECC] hover:text-[#008ECC] hover:bg-[#EBF6FC]/30 active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent",
  deal:
    "bg-amber-500 text-white hover:bg-amber-600 shadow-sm active:scale-[0.98] border border-transparent",
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 shadow-sm active:scale-[0.98] border border-transparent",
  subtle:
    "bg-[#EBF6FC] text-[#008ECC] hover:bg-[#008ECC]/15 active:scale-[0.98] border border-[#008ECC]/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs rounded-lg gap-1.5",
  sm: "px-3.5 py-1.5 text-xs rounded-xl font-medium gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl font-semibold gap-2",
  lg: "px-7 py-3 text-base rounded-2xl font-bold gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-sans transition-all duration-200 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008ECC]/40 focus-visible:ring-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none shadow-none",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
