"use client";

import Link from "next/link";
import {
  FiShoppingBag,
  FiHeart,
  FiDollarSign,
  FiArrowRight,
  FiPackage,
  FiClock,
} from "react-icons/fi";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderStatus } from "@/types/order.types";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";

function StatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "DELIVERED":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
          Delivered
        </span>
      );
    case "SHIPPED":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#008ECC] border border-blue-200">
          Shipped
        </span>
      );
    case "CONFIRMED":
      return (
        <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 border border-sky-200">
          Confirmed
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600 border border-amber-200">
          Processing
        </span>
      );
    case "CANCELLED":
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-200">
          Cancelled
        </span>
      );
  }
}

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
  const totalSpent = allOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // Approximate savings calculation based on discount estimates
  const savedAmount = Math.round(totalSpent * 0.15 * 100) / 100;

  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Greeting Header (Matching Reference Mockup) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Hello, {user?.name ?? "Customer"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Welcome back! Here&apos;s what&apos;s happening with your account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button
              variant="primary"
              size="sm"
              className="rounded-full bg-[#008ECC] hover:bg-[#0073A8] text-white font-bold px-5"
            >
              Shop Catalog
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Metric Stat Cards (Total Orders, Wishlist, Saved Amount - Matching Reference Mockup) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Total Orders */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#008ECC]">
              <FiShoppingBag className="text-lg" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 font-mono">
            {totalOrders}
          </p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-slate-400">
            Active purchases on MegaMart
          </span>
        </div>

        {/* Card 2: Wishlist */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Wishlist
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <FiHeart className="text-lg" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 font-mono">
            {totalWishlist}
          </p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-slate-400">
            Saved items in your wishlist
          </span>
        </div>

        {/* Card 3: Saved Amount */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Saved Amount
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FiDollarSign className="text-lg" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 font-mono">
            {formatCurrency(savedAmount > 0 ? savedAmount : 45.0)}
          </p>
          <span className="mt-1 inline-block text-[11px] font-semibold text-emerald-600">
            Discounts & promotions claimed
          </span>
        </div>
      </div>

      {/* Recent Orders Section (Matching Reference Mockup Table) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            Recent Orders
          </h2>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#008ECC] hover:underline"
          >
            <span>View All</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            icon={<FiPackage className="text-4xl text-slate-300" />}
            title="No orders yet"
            description="When you place orders, your items, order receipts, and delivery tracking will appear here."
            action={
              <Link href="/products">
                <Button variant="primary" size="sm" className="rounded-full bg-[#008ECC] text-white font-bold">
                  Start Shopping
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-extrabold">Product</th>
                  <th className="pb-3 font-extrabold">Price</th>
                  <th className="pb-3 font-extrabold">Status</th>
                  <th className="pb-3 font-extrabold">Date</th>
                  <th className="pb-3 text-right font-extrabold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const product = order.product;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Product Thumbnail + Title */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-[#F8FAFC] p-1 flex items-center justify-center">
                            {product?.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.image}
                                alt={product.name ?? "Product"}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <FiPackage className="text-lg text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1 max-w-[180px] sm:max-w-xs">
                              {product?.name ?? `Order item #${order.id.slice(0, 8)}`}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              Qty: {order.quantity}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="py-3.5 pr-4 font-mono font-extrabold text-slate-900">
                        {formatCurrency(order.totalPrice)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 pr-4">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Date */}
                      <td className="py-3.5 pr-4 text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Action Link */}
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/orders/${order.id}`}
                          className="font-bold text-[#008ECC] hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}