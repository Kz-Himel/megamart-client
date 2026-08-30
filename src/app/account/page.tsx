"use client";

import Link from "next/link";
import { FiShoppingBag, FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderStatus } from "@/types/order.types";

const STATUS_BAR_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-indigo-400",
  SHIPPED: "bg-amber-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-rose-400",
};

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading your activity..." />
      </div>
    );
  }

  const allOrders = orders ?? [];

  // Every number below comes straight from the user's real orders — no
  // placeholder or estimated figures.
  const totalOrders = allOrders.length;
  const totalSpent = allOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingCount = allOrders.filter((o) => o.status === "PENDING" || o.status === "CONFIRMED").length;
  const deliveredCount = allOrders.filter((o) => o.status === "DELIVERED").length;

  const statusCounts = (Object.keys(STATUS_BAR_COLORS) as OrderStatus[]).map((status) => ({
    status,
    count: allOrders.filter((o) => o.status === status).length,
  }));
  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <span className="mb-1 inline-block text-xs font-bold uppercase tracking-wider text-indigo-600">
          My account
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
      </div>

      {totalOrders === 0 ? (
        <EmptyState
          icon={<FiShoppingBag />}
          title="No orders yet"
          description="Once you place an order, your activity and stats will show up here."
          action={
            <Link
              href="/products"
              className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Browse products
            </Link>
          }
        />
      ) : (
        <>
          {/* Stat cards — all real, derived from this user's orders */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<FiShoppingBag />} label="Total orders" value={String(totalOrders)} />
            <StatCard icon={<FiDollarSign />} label="Total spent" value={`$${totalSpent.toFixed(2)}`} />
            <StatCard icon={<FiClock />} label="In progress" value={String(pendingCount)} />
            <StatCard icon={<FiCheckCircle />} label="Delivered" value={String(deliveredCount)} />
          </div>

          {/* Status breakdown */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Orders by status</h2>
            <div className="space-y-3">
              {statusCounts.map(({ status, count }) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-medium text-slate-500">
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR_COLORS[status]}`}
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs font-semibold text-slate-700">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent orders */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Recent orders</h2>
              <Link href="/orders" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                View all
              </Link>
            </div>
            <OrderTable orders={recentOrders} isAdmin={false} />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}