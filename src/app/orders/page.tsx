"use client";

import { useState } from "react";
import Link from "next/link";
import { FiShoppingCart, FiPlus } from "react-icons/fi";
import { useOrders, useUpdateOrder } from "@/hooks/useOrders";
import { OrderTable } from "@/components/orders/OrderTable";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const { toast } = useToast();
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  const handleConfirmCancel = async () => {
    if (!pendingCancelId) return;
    try {
      await updateOrder.mutateAsync({
        id: pendingCancelId,
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
      setPendingCancelId(null);
    }
  };

  return (
    <div className="py-2 space-y-6">
      <Breadcrumbs items={[{ label: "My Orders" }]} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="relative inline-block text-xl font-extrabold text-slate-800 sm:text-2xl">
            My <span className="text-[#008ECC]">Orders</span>
            <span className="absolute -bottom-[17px] left-0 h-[3px] w-full bg-[#008ECC] rounded-full" />
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Track real-time shipment progress, delivery status, and order receipts
          </p>
        </div>

        <Link href="/products">
          <Button
            variant="primary"
            size="sm"
            className="rounded-xl bg-[#008ECC] text-white font-bold"
          >
            <FiPlus className="mr-1" /> New Purchase
          </Button>
        </Link>
      </div>

      {isLoading && <LoadingSpinner label="Loading your orders..." />}

      {!isLoading && orders && orders.length === 0 && (
        <div className="py-12">
          <EmptyState
            icon={<FiShoppingCart className="text-4xl text-slate-300" />}
            title="No Orders Yet"
            description="Once you place an order, it will appear here with live tracking."
            action={
              <Link href="/products">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-xl bg-[#008ECC] text-white font-bold"
                >
                  Start Shopping
                </Button>
              </Link>
            }
          />
        </div>
      )}

      {!isLoading && orders && orders.length > 0 && (
        <OrderTable
          orders={orders}
          isAdmin={false}
          onCancel={(id) => setPendingCancelId(id)}
          mutatingId={updateOrder.isPending ? pendingCancelId : null}
        />
      )}

      <ConfirmDialog
        isOpen={!!pendingCancelId}
        title="Cancel this order?"
        description="Are you sure you want to cancel this order? The reserved inventory will be restored immediately."
        confirmLabel="Yes, Cancel Order"
        isLoading={updateOrder.isPending}
        onConfirm={handleConfirmCancel}
        onCancel={() => setPendingCancelId(null)}
      />
    </div>
  );
}