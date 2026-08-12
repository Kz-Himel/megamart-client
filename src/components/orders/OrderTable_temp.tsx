"use client";

import { FiX, FiTrash2 } from "react-icons/fi";
import { Button } from "@heroui/react";
import { Order, OrderStatus } from "@/types/order.types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-warning/15 text-warning",
  CONFIRMED: "bg-accent/15 text-accent",
  SHIPPED: "bg-price/25 text-price-foreground",
  DELIVERED: "bg-success/15 text-success",
  CANCELLED: "bg-danger/15 text-danger",
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
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-secondary text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            {isAdmin && <th className="px-4 py-3 font-medium">Customer</th>}
            <th className="px-4 py-3 font-medium">Qty</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Placed</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isMutating = mutatingId === order.id;
            return (
              <tr key={order.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{order.product?.name ?? "—"}</td>
                {isAdmin && (
                  <td className="px-4 py-3 text-muted">{order.user?.name ?? "—"}</td>
                )}
                <td className="px-4 py-3 font-mono">{order.quantity}</td>
                <td className="px-4 py-3 font-mono">${order.totalPrice.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {isAdmin && onStatusChange ? (
                    <select
                      value={order.status}
                      disabled={isMutating}
                      onChange={(e) =>
                        onStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ${STATUS_STYLES[order.status]}`}
                    >
                      {ALL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {!isAdmin && order.status === "PENDING" && onCancel && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger"
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
                        className="text-danger"
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