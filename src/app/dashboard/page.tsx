"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiBriefcase,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { useUsers } from "@/hooks/useUsers";
import { useAdminSellers } from "@/hooks/useAdmin";
import { useAdminPayouts } from "@/hooks/useAdmin";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Order, OrderStatus } from "@/types/order.types";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#008ECC",
  SHIPPED: "#38bdf8",
  DELIVERED: "#10b981",
  CANCELLED: "#f43f5e",
};

export default function DashboardOverviewPage() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: orders, isLoading: loadingOrders } = useOrders();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: sellers, isLoading: loadingSellers } = useAdminSellers();
  const { data: payouts, isLoading: loadingPayouts } = useAdminPayouts();

  const isLoading =
    loadingProducts ||
    loadingOrders ||
    loadingUsers ||
    loadingSellers ||
    loadingPayouts;

  const activeOrders = useMemo(
    () => (orders ?? []).filter((o) => o.status !== "CANCELLED"),
    [orders]
  );

  const totalRevenue = useMemo(
    () => activeOrders.reduce((sum, o) => sum + o.totalPrice, 0),
    [activeOrders]
  );

  const approvedSellersCount = useMemo(
    () => (sellers ?? []).filter((s) => s.status === "APPROVED").length,
    [sellers]
  );

  const pendingSellers = useMemo(
    () => (sellers ?? []).filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW"),
    [sellers]
  );

  const pendingPayouts = useMemo(
    () => (payouts ?? []).filter((p) => p.status === "PENDING"),
    [payouts]
  );

  // Revenue trend / Sales by day or month
  const salesByMonth = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = months.map((m) => ({ month: m, sales: 0, orders: 0 }));

    if (orders && orders.length > 0) {
      for (const order of activeOrders) {
        const d = new Date(order.createdAt);
        const mIndex = d.getMonth();
        monthlyData[mIndex].sales += order.totalPrice;
        monthlyData[mIndex].orders += 1;
      }
    }

    const currentMonthIdx = new Date().getMonth();
    return monthlyData.slice(0, currentMonthIdx + 1);
  }, [activeOrders, orders]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    for (const order of orders ?? []) counts[order.status]++;
    return (Object.keys(counts) as OrderStatus[])
      .map((status) => ({ status, count: counts[status] }))
      .filter((s) => s.count > 0);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return (orders ?? []).slice(0, 5);
  }, [orders]);

  if (isLoading) return <LoadingSpinner label="Loading platform metrics..." />;

  const userCount = users?.length ?? 0;
  const orderCount = orders?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* Platform Header */}
      <DashboardHeader
        badge="Super Admin Console"
        title="Platform Oversight & Analytics"
        subtitle="Live administrative metrics across multi-vendor marketplace catalog, orders, and settlements."
        breadcrumbs={[{ label: "Admin Console" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/dashboard/sellers">
              <Button
                variant="primary"
                size="sm"
                className="rounded-xl font-bold bg-[#008ECC] text-white shadow-xs"
              >
                <FiBriefcase className="mr-1.5" /> Review Sellers ({pendingSellers.length})
              </Button>
            </Link>
            <Link href="/dashboard/payouts">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl font-bold border-slate-200"
              >
                <FiDollarSign className="mr-1 text-emerald-600" /> Payouts ({pendingPayouts.length})
              </Button>
            </Link>
          </div>
        }
      />

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardMetricCard
          index={0}
          icon={<FiDollarSign />}
          label="Gross Platform Revenue"
          value={formatCurrency(totalRevenue)}
          trend="Server Verified"
          trendUp={true}
          subtitle={`${orderCount} orders recorded`}
        />
        <DashboardMetricCard
          index={1}
          icon={<FiBriefcase />}
          label="Verified Sellers"
          value={approvedSellersCount}
          trend={pendingSellers.length > 0 ? `${pendingSellers.length} pending review` : "All reviewed"}
          trendUp={pendingSellers.length === 0}
          subtitle={`Total: ${sellers?.length ?? 0} applications`}
        />
        <DashboardMetricCard
          index={2}
          icon={<FiShoppingCart />}
          label="Total Orders"
          value={orderCount}
          subtitle={`${activeOrders.length} active / completed`}
        />
        <DashboardMetricCard
          index={3}
          icon={<FiUsers />}
          label="Registered Users"
          value={userCount}
          trend={`${products?.length ?? 0} products active`}
          trendUp={true}
        />
      </div>

      {/* Pending Sellers Alert Banner (if any) */}
      {pendingSellers.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 text-lg font-bold">
              <FiClock />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                {pendingSellers.length} Seller Application{pendingSellers.length > 1 ? "s" : ""} Awaiting Compliance Decision
              </p>
              <p className="text-[11px] text-amber-800">
                Review applicant identity documents, business credentials, and approve store handles.
              </p>
            </div>
          </div>
          <Link href="/dashboard/sellers">
            <Button size="sm" variant="primary" className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white text-xs">
              Open Seller Queue
            </Button>
          </Link>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gross Sales Overview</h3>
              <p className="text-xs text-slate-400">Monthly gross marketplace revenue and volume</p>
            </div>
            <span className="text-xs font-bold text-[#008ECC] bg-[#F0F8FF] px-2.5 py-1 rounded-full border border-sky-100">
              Live DB Records
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value) => [`$${value ?? 0}`, "Sales"]} />
                <Bar dataKey="sales" fill="#008ECC" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Order Status Breakdown</h3>
            <p className="text-xs text-slate-400">Fulfillment lifecycle distribution</p>
          </div>

          {statusBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center">No orders recorded in database.</p>
          ) : (
            <div className="space-y-4">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={4}>
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#cbd5e1"} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value ?? 0, name ?? ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {statusBreakdown.map((item) => (
                  <div key={item.status} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[item.status] }} />
                    <span className="text-[11px] font-semibold text-slate-600 truncate">{item.status}:</span>
                    <span className="text-[11px] font-black text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Platform Transactions</h3>
            <p className="text-xs text-slate-400">Latest multi-vendor order activity across all stores.</p>
          </div>
          <Link href="/dashboard/orders" className="text-xs font-bold text-[#008ECC] hover:underline flex items-center gap-1">
            <span>View All Orders</span>
            <FiArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState icon={<FiShoppingCart className="text-3xl text-slate-300" />} title="No Platform Orders" description="Transactions placed by customers will populate this table in real-time." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product Item</th>
                  <th className="py-3 px-4">Gross Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord: Order) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{ord.id.slice(0, 8)}
                      <p className="text-[10px] text-slate-400 font-sans font-normal">{formatDate(ord.createdAt)}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <p className="font-semibold text-slate-800">{ord.user?.name ?? "Customer"}</p>
                      <p className="text-[10px] text-slate-400">{ord.user?.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 line-clamp-1">{ord.product?.name ?? "Item"}</p>
                      <p className="text-[10px] text-slate-400">Qty: {ord.quantity}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(ord.totalPrice)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={ord.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#008ECC] hover:underline"
                      >
                        Inspect <FiArrowRight className="h-3 w-3" />
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