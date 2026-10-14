"use client";

import Link from "next/link";
import {
  FiShoppingBag,
  FiHeart,
  FiDollarSign,
  FiArrowRight,
  FiPackage,
  FiClock,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders();
  const { totalWishlist } = useWishlist();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[40vh]">
        <LoadingSpinner label="Loading your account activity..." />
      </div>
    );
  }

  const allOrders = orders ?? [];
  const totalOrders = allOrders.length;
  const completedOrders = allOrders.filter((o) => o.status === "DELIVERED").length;
  const activeOrders = allOrders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "SHIPPED"
  ).length;
  const totalSpent = allOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        badge="Customer Portal"
        title={`Hello, ${user?.name ?? "Valued Shopper"}`}
        subtitle="Manage your orders, saved delivery addresses, wishlist, and profile settings."
        breadcrumbs={[{ label: "Account Overview" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/products">
              <Button
                variant="primary"
                size="sm"
                className="rounded-xl font-bold bg-[#008ECC] text-white shadow-xs"
              >
                Browse Products
              </Button>
            </Link>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardMetricCard
          index={0}
          icon={<FiShoppingBag />}
          label="Total Orders"
          value={totalOrders}
          trend={`${completedOrders} fulfilled`}
          trendUp={true}
        />
        <DashboardMetricCard
          index={1}
          icon={<FiClock />}
          label="Active In Transit"
          value={activeOrders}
          subtitle="Orders currently in fulfillment"
        />
        <DashboardMetricCard
          index={2}
          icon={<FiDollarSign />}
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          trend="Lifetime purchases"
          trendUp={true}
        />
        <DashboardMetricCard
          index={3}
          icon={<FiHeart />}
          label="Saved Wishlist"
          value={totalWishlist}
          subtitle="Items in your favorite list"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/orders"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-sky-300 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#008ECC] text-lg font-bold group-hover:scale-105 transition-transform">
              <FiPackage />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#008ECC] transition-colors">
                Order Tracking
              </p>
              <p className="text-[11px] text-slate-500">Live shipping status & receipts</p>
            </div>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-sky-300 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-lg font-bold group-hover:scale-105 transition-transform">
              <FiMapPin />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Delivery Addresses
              </p>
              <p className="text-[11px] text-slate-500">Manage saved shipping locations</p>
            </div>
          </div>
        </Link>

        <Link
          href={user?.role === "SELLER" ? "/seller/dashboard" : "/seller/apply"}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-purple-300 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 text-lg font-bold group-hover:scale-105 transition-transform">
              <FiBriefcase />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                {user?.role === "SELLER" ? "Merchant Console" : "Become a Seller"}
              </p>
              <p className="text-[11px] text-slate-500">
                {user?.role === "SELLER" ? "Open your seller workspace" : "Sell products on MegaMart"}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Order Activity</h2>
            <p className="text-xs text-slate-500">Your latest purchases and tracking updates.</p>
          </div>
          <Link
            href="/orders"
            className="text-xs font-bold text-[#008ECC] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            icon={<FiShoppingBag className="text-4xl text-slate-300" />}
            title="No Orders Found"
            description="You haven't placed any orders yet. Discover trending deals and gadgets on MegaMart!"
            action={
              <Link href="/products">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-xl font-bold bg-[#008ECC] text-white shadow-xs"
                >
                  Start Shopping
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <span className="line-clamp-1">{order.product?.name ?? "Order Item"}</span>
                      <span className="text-[10px] text-slate-400">Qty: {order.quantity}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-[#008ECC] hover:bg-sky-50 transition-colors"
                      >
                        <span>Details</span>
                        <FiArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}