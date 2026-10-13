"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";

export interface FormFieldProps {
  label?: string;
  error?: string | null;
  hint?: string | null;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 select-none flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-[11px] font-medium text-rose-600 animate-fadeIn">{error}</p>}
      {!error && hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  hint?: string | null;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      required,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id || autoId;

    const inputNode = (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs sm:text-sm text-slate-800",
            "placeholder:text-slate-400 transition-all duration-200",
            "focus:border-[#008ECC] focus:outline-none focus:ring-2 focus:ring-[#008ECC]/10",
            leftIcon ? "pl-10" : "pl-3.5",
            rightIcon ? "pr-10" : "pr-3.5",
            error && "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10 bg-rose-50/20",
            disabled && "bg-slate-50 text-slate-400 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
    );

    if (label || error || hint) {
      return (
        <FormField label={label} error={error} hint={hint} required={required}>
          {inputNode}
        </FormField>
      );
    }

    return inputNode;
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | null;
  hint?: string | null;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, required, id, disabled, ...props }, ref) => {
    const autoId = useId();
    const textareaId = id || autoId;

    const textareaNode = (
      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800",
          "placeholder:text-slate-400 transition-all duration-200",
          "focus:border-[#008ECC] focus:outline-none focus:ring-2 focus:ring-[#008ECC]/10",
          error && "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10 bg-rose-50/20",
          disabled && "bg-slate-50 text-slate-400 cursor-not-allowed",
          className
        )}
        {...props}
      />
    );

    if (label || error || hint) {
      return (
        <FormField label={label} error={error} hint={hint} required={required}>
          {textareaNode}
        </FormField>
      );
    }

    return textareaNode;
  }
);

Textarea.displayName = "Textarea";
