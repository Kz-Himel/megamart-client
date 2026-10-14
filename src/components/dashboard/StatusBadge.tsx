"use client";

import { OrderStatus } from "@/types/order.types";
import { StoreStatus, PayoutStatus } from "@/types/seller.types";

interface StatusBadgeProps {
  status: OrderStatus | StoreStatus | PayoutStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  let styles = "bg-slate-50 text-slate-700 border-slate-200";
  let dotColor = "bg-slate-400";
  let label = normalized.replace(/_/g, " ");

  // Order & Store & Payout Status Mappings
  switch (normalized) {
    case "APPROVED":
    case "DELIVERED":
    case "PAID":
    case "ACTIVE":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      dotColor = "bg-emerald-500";
      break;

    case "PENDING":
    case "UNDER_REVIEW":
    case "PROCESSING":
      styles = "bg-amber-50 text-amber-700 border-amber-200/80";
      dotColor = "bg-amber-500 animate-pulse";
      break;

    case "CONFIRMED":
    case "SHIPPED":
      styles = "bg-sky-50 text-[#008ECC] border-sky-200/80";
      dotColor = "bg-[#008ECC]";
      break;

    case "CHANGES_REQUESTED":
      styles = "bg-orange-50 text-orange-700 border-orange-200/80";
      dotColor = "bg-orange-500";
      label = "Changes Requested";
      break;

    case "REJECTED":
    case "CANCELLED":
    case "SUSPENDED":
      styles = "bg-rose-50 text-rose-700 border-rose-200/80";
      dotColor = "bg-rose-500";
      break;

    case "DRAFT":
      styles = "bg-slate-100 text-slate-600 border-slate-200";
      dotColor = "bg-slate-400";
      break;

    default:
      styles = "bg-slate-50 text-slate-700 border-slate-200";
      dotColor = "bg-slate-400";
  }

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1 font-semibold"
      : "px-2.5 py-1 text-xs gap-1.5 font-bold";

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${sizeClasses} ${styles}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span className="capitalize">{label.toLowerCase()}</span>
    </span>
  );
}
