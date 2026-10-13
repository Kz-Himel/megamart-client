import React from "react";
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface FeedbackAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, { container: string; icon: React.ReactNode; title: string }> = {
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: <FiCheckCircle className="text-emerald-600 text-lg shrink-0 mt-0.5" />,
    title: "text-emerald-900",
  },
  error: {
    container: "bg-rose-50 border-rose-200 text-rose-800",
    icon: <FiAlertCircle className="text-rose-600 text-lg shrink-0 mt-0.5" />,
    title: "text-rose-900",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-800",
    icon: <FiAlertTriangle className="text-amber-600 text-lg shrink-0 mt-0.5" />,
    title: "text-amber-900",
  },
  info: {
    container: "bg-sky-50 border-sky-200 text-sky-800",
    icon: <FiInfo className="text-sky-600 text-lg shrink-0 mt-0.5" />,
    title: "text-sky-900",
  },
};

export function FeedbackAlert({
  variant = "info",
  title,
  children,
  onDismiss,
  className,
}: FeedbackAlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 text-xs sm:text-sm",
        styles.container,
        className
      )}
    >
      {styles.icon}
      <div className="flex-1 overflow-hidden">
        {title && <p className={cn("font-bold mb-0.5", styles.title)}>{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-current opacity-60 hover:opacity-100 transition-opacity p-0.5"
          aria-label="Dismiss alert"
        >
          <FiX className="text-base" />
        </button>
      )}
    </div>
  );
}
