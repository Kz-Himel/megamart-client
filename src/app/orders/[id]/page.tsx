"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiDollarSign,
  FiPrinter,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import { useOrder, useUpdateOrder } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/utils/formatters";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { OrderStatus } from "@/types/order.types";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Order Pending",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: <FiClock className="text-amber-500" />,
  },
  CONFIRMED: {
    label: "Order Confirmed",
    bg: "bg-sky-50 border-sky-200",
    text: "text-sky-700",
    icon: <FiCheckCircle className="text-sky-500" />,
  },
  SHIPPED: {
    label: "Shipped & In Transit",
    bg: "bg-indigo-50 border-indigo-200",
    text: "text-indigo-700",
    icon: <FiTruck className="text-indigo-500" />,
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: <FiCheckCircle className="text-emerald-500" />,
  },
  CANCELLED: {
    label: "Order Cancelled",
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    icon: <FiXCircle className="text-rose-500" />,
  },
};

const STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading, error } = useOrder(id);
  const updateOrder = useUpdateOrder();
  const { toast } = useToast();
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      await updateOrder.mutateAsync({
        id: order.id,
        payload: { status: "CANCELLED" },
      });
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled and inventory was returned to stock.",
        variant: "info",
      });
    } catch {
      toast({
        title: "Cancellation Failed",
        description: "Could not cancel order. Only pending orders can be cancelled.",
        variant: "error",
      });
    } finally {
      setIsCancelOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Retrieving order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<FiShoppingBag className="text-4xl text-slate-300" />}
          title="Order Not Found"
          description="We couldn't retrieve the details for this order. It may not exist or you might not have permission to view it."
          action={
            <Link href="/orders">
              <Button
                variant="primary"
                size="md"
                className="rounded-xl bg-[#008ECC] text-white font-bold"
              >
                Back to My Orders
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const isCancelled = order.status === "CANCELLED";
  const currentStepIdx = STEPS.indexOf(order.status);

  return (
    <div className="py-2 space-y-6">
      <Breadcrumbs
        items={[
          { label: "My Orders", href: "/orders" },
          { label: `Order #${order.id.slice(0, 8)}` },
        ]}
      />

      {/* Header with Reference & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              Order Details
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-mono">
            Order Reference: <strong className="text-slate-700">{order.id}</strong> • Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-xl text-xs font-bold print:hidden"
          >
            <FiPrinter className="mr-1" /> Print Invoice
          </Button>

          {order.status === "PENDING" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCancelOpen(true)}
              className="rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 print:hidden"
            >
              <FiX className="mr-1" /> Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Order Progress Stepper */}
      {!isCancelled ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
            Delivery Status Progression
          </h2>
          <div className="relative flex items-center justify-between">
            {/* Progress line */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
            <div
              className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-[#008ECC] transition-all duration-500 -z-0"
              style={{
                width: `${Math.max(0, (currentStepIdx / (STEPS.length - 1)) * 95)}%`,
              }}
            />

            {STEPS.map((step, idx) => {
              const isCompleted = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                      isCompleted
                        ? "border-[#008ECC] bg-[#008ECC] text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {isCompleted ? <FiCheckCircle /> : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-[10px] sm:text-xs font-bold ${
                      isCurrent
                        ? "text-[#008ECC]"
                        : isCompleted
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {STATUS_CONFIG[step].label.replace("Order ", "")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-xs sm:text-sm text-rose-800">
          <FiXCircle className="text-xl text-rose-600 shrink-0" />
          <div>
            <p className="font-bold">This order was cancelled</p>
            <p className="text-xs text-rose-700 mt-0.5">
              The reserved stock for this item has been returned to inventory.
            </p>
          </div>
        </div>
      )}

      {/* Main Order Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Purchased Product (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-800 mb-4">
              Purchased Product
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                  {order.product?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <FiShoppingBag className="text-2xl text-slate-300" />
                  )}
                </div>

                <div>
                  <Link
                    href={`/products/${order.productId}`}
                    className="font-extrabold text-sm sm:text-base text-slate-800 hover:text-[#008ECC] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{order.product?.name ?? "MegaMart Product"}</span>
                    <FiExternalLink className="text-xs opacity-60" />
                  </Link>
                  <p className="mt-1 text-xs text-slate-500 font-mono">
                    Unit Price: {formatCurrency(order.product?.price ?? 0)}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Quantity: <strong className="text-slate-800">{order.quantity}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {formatCurrency(order.totalPrice)}
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Verified Total</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <Link
                href={`/products/${order.productId}`}
                className="font-bold text-[#008ECC] hover:underline"
              >
                View Product Details & Reviews
              </Link>
              <Link href="/products" className="font-semibold text-slate-500 hover:text-slate-800">
                Browse More Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Financial & Delivery Summary (1 col) */}
        <div className="space-y-6">
          {/* Payment Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
              <FiDollarSign className="text-emerald-600" />
              <h3>Payment & Billing</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Method</span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                  Cash on Delivery (COD)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Status</span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                  {order.status === "DELIVERED" ? "Paid at Handover" : "Pending on Delivery"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800">Order Amount</span>
                <span className="font-black text-base text-[#008ECC] font-mono">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Customer Account</h3>
            <div className="space-y-1 text-xs text-slate-600">
              <p className="font-bold text-slate-800">{order.user?.name ?? "Customer"}</p>
              <p className="text-slate-500">{order.user?.email ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="pt-2">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008ECC] hover:underline"
        >
          <FiArrowLeft /> Back to All Orders
        </Link>
      </div>

      {/* Cancellation Dialog */}
      <ConfirmDialog
        isOpen={isCancelOpen}
        title="Cancel this order?"
        description="Are you sure you want to cancel this order? The inventory will be restored back to stock immediately."
        confirmLabel="Yes, Cancel Order"
        isLoading={updateOrder.isPending}
        onConfirm={handleCancelOrder}
        onCancel={() => setIsCancelOpen(false)}
      />
    </div>
  );
}
