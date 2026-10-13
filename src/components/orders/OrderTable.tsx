"use client";

import Link from "next/link";
import { FiX, FiTrash2, FiShoppingBag, FiExternalLink } from "react-icons/fi";
import { Button } from "@heroui/react";
import { Order, OrderStatus } from "@/types/order.types";
import { formatCurrency } from "@/lib/utils/formatters";

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  PENDING: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    label: "Pending",
  },
  CONFIRMED: {
    bg: "bg-sky-50 border-sky-200",
    text: "text-sky-700",
    label: "Confirmed",
  },
  SHIPPED: {
    bg: "bg-indigo-50 border-indigo-200",
    text: "text-indigo-700",
    label: "Shipped",
  },
  DELIVERED: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    label: "Delivered",
  },
  CANCELLED: {
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    label: "Cancelled",
  },
};

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

interface OrderTableProps {
  orders: Order[];
  isAdmin: boolean;
  onCancel?: (id: string) => void;
  onStatusChange?: (id: string, status: OrderStatus) => void;
  onDelete?: (id: string) => void;
  mutatingId?: string | null;
}

export function OrderTable({
  orders,
  isAdmin,
  onCancel,
  onStatusChange,
  onDelete,
  mutatingId,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5">Product</th>
            {isAdmin && <th className="px-5 py-3.5">Customer</th>}
            <th className="px-5 py-3.5 text-center">Qty</th>
            <th className="px-5 py-3.5">Total</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Date</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const isMutating = mutatingId === order.id;
            const statusConfig = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;

            return (
              <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Product Column */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                      {order.product?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={order.product.image}
                          alt={order.product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <FiShoppingBag className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      {order.product ? (
                        <Link
                          href={`/products/${order.productId}`}
                          className="font-bold text-slate-800 hover:text-[#008ECC] transition-colors line-clamp-1 inline-flex items-center gap-1"
                        >
                          <span>{order.product.name}</span>
                          <FiExternalLink className="text-[10px] opacity-60" />
                        </Link>
                      ) : (
                        <span className="font-bold text-slate-800">
                          Product #{order.productId.slice(0, 8)}
                        </span>
                      )}
                      <p className="text-[11px] font-mono text-slate-400">
                        Ref: {order.id.slice(0, 13)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Customer Column (Admin) */}
                {isAdmin && (
                  <td className="px-5 py-4 text-xs text-slate-600">
                    <p className="font-bold text-slate-800">{order.user?.name ?? "—"}</p>
                    <p className="text-slate-400">{order.user?.email ?? "—"}</p>
                  </td>
                )}

                {/* Quantity */}
                <td className="px-5 py-4 text-center font-mono font-bold text-slate-700">
                  {order.quantity}
                </td>

                {/* Total Price */}
                <td className="px-5 py-4 font-mono font-black text-slate-900">
                  {formatCurrency(order.totalPrice)}
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  {isAdmin && onStatusChange ? (
                    <select
                      value={order.status}
                      disabled={isMutating}
                      onChange={(e) =>
                        onStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold outline-none cursor-pointer ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {ALL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_STYLES[status]?.label ?? status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {statusConfig.label}
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="px-5 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {!isAdmin && order.status === "PENDING" && onCancel && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold"
                        isDisabled={isMutating}
                        onPress={() => onCancel(order.id)}
                      >
                        <FiX className="mr-1" /> Cancel
                      </Button>
                    )}
                    {isAdmin && onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-600 hover:bg-rose-50 rounded-xl"
                        isDisabled={isMutating}
                        onPress={() => onDelete(order.id)}
                      >
                        <FiTrash2 />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}