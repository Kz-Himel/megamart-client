"use client";

import Link from "next/link";
import {
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiHeart,
  FiUser,
} from "react-icons/fi";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderStatus } from "@/types/order.types";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";

const STATUS_BAR_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-[#008ECC]",
  SHIPPED: "bg-indigo-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-rose-400",
};

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading your account activity..." />
      </div>
    );
  }

  const allOrders = orders ?? [];
  const totalOrders = allOrders.length;
  const totalSpent = allOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingCount = allOrders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED"
  ).length;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#008ECC]">
            Customer Account
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            Welcome back, {user?.name ?? "Customer"}
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Overview of your orders, delivery status, and personal preferences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/products">
            <Button
              variant="primary"
              size="sm"
              className="rounded-xl bg-[#008ECC] text-white font-bold"
            >
              Shop Catalog
            </Button>
          </Link>
        </div>
      </div>

      {totalOrders === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={<FiShoppingBag className="text-4xl text-slate-300" />}
            title="No orders placed yet"
            description="Your purchasing activity, order receipts, and delivery statuses will appear here once you place an order."
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
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<FiShoppingBag className="text-xl text-[#008ECC]" />}
              label="Total Orders"
              value={String(totalOrders)}
              subtext="Lifetime purchases"
            />
            <StatCard
              icon={<FiDollarSign className="text-xl text-emerald-600" />}
              label="Total Spent"
              value={formatCurrency(totalSpent)}
              subtext="Active orders total"
            />
            <StatCard
              icon={<FiClock className="text-xl text-amber-500" />}
              label="In Progress"
              value={String(pendingCount)}
              subtext="Pending / Confirmed"
            />
            <StatCard
              icon={<FiCheckCircle className="text-xl text-emerald-600" />}
              label="Delivered"
              value={String(deliveredCount)}
              subtext="Successfully received"
            />
          </div>

          {/* Status Breakdown & Quick Links */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs lg:col-span-2">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Orders by Status
              </h2>
              <div className="space-y-3">
                {statusCounts.map(({ status, count }) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs font-semibold text-slate-600 capitalize">
                      {status.toLowerCase()}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${STATUS_BAR_COLORS[status]}`}
                        style={{ width: `${(count / maxStatusCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-xs font-bold font-mono text-slate-700">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <Link
                    href="/orders"
                    className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#008ECC] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FiShoppingBag className="text-[#008ECC]" /> All Orders ({totalOrders})
                    </span>
                    <FiArrowRight />
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#008ECC] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FiHeart className="text-rose-500" /> Saved Wishlist
                    </span>
                    <FiArrowRight />
                  </Link>
                  <Link
                    href="/account/profile"
                    className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#008ECC] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FiUser className="text-slate-600" /> Profile & Password
                    </span>
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Recent Orders</h2>
                <p className="text-[11px] text-slate-400">Your latest purchases and tracking</p>
              </div>
              <Link
                href="/orders"
                className="text-xs font-bold text-[#008ECC] hover:underline inline-flex items-center gap-1"
              >
                <span>View All Orders</span>
                <FiArrowRight className="text-xs" />
              </Link>
            </div>
            <OrderTable orders={recentOrders} isAdmin={false} />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>
      <p className="text-xl font-extrabold text-slate-900 font-mono">{value}</p>
      <p className="text-xs font-bold text-slate-700">{label}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{subtext}</p>
    </div>
  );
}