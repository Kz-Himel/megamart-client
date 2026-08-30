"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiBox,
  FiTag,
  FiShoppingCart,
  FiStar,
  FiUsers,
  FiDollarSign,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
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
  Legend,
} from "recharts";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useOrders } from "@/hooks/useOrders";
import { useReviews } from "@/hooks/useReviews";
import { useUsers } from "@/hooks/useUsers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderStatus } from "@/types/order.types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#818cf8",
  SHIPPED: "#fbbf24",
  DELIVERED: "#10b981",
  CANCELLED: "#f43f5e",
};

const ACCENT = "#4f46e5";

function StatCard({
  icon,
  label,
  value,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <p className="font-mono text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: orders, isLoading: loadingOrders } = useOrders();
  const { data: reviews, isLoading: loadingReviews } = useReviews();
  const { data: users, isLoading: loadingUsers } = useUsers();

  const isLoading =
    loadingProducts || loadingCategories || loadingOrders || loadingReviews || loadingUsers;

  // Every series below is derived directly from real fetched data — no
  // seeded/sample numbers anywhere in this dashboard.
  const activeOrders = useMemo(
    () => (orders ?? []).filter((o) => o.status !== "CANCELLED"),
    [orders]
  );

  const totalRevenue = useMemo(
    () => activeOrders.reduce((sum, o) => sum + o.totalPrice, 0),
    [activeOrders]
  );

  // Revenue trend for the last 14 days that actually have order data.
  const revenueTrend = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const order of activeOrders) {
      const day = new Date(order.createdAt).toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + order.totalPrice);
    }
    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([day, revenue]) => ({
        day: new Date(day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        revenue: Number(revenue.toFixed(2)),
      }));
  }, [activeOrders]);

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

  const topProducts = useMemo(() => {
    const revenueByProduct = new Map<string, { name: string; revenue: number }>();
    for (const order of activeOrders) {
      const key = order.productId;
      const name = order.product?.name ?? "Unknown";
      const existing = revenueByProduct.get(key);
      revenueByProduct.set(key, {
        name,
        revenue: (existing?.revenue ?? 0) + order.totalPrice,
      });
    }
    return Array.from(revenueByProduct.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({ ...p, revenue: Number(p.revenue.toFixed(2)) }));
  }, [activeOrders]);

  const categoryDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of products ?? []) {
      const name = product.category?.name ?? "Uncategorized";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [products]);

  if (isLoading) return <LoadingSpinner label="Loading overview..." />;

  return (
    <div>
      <div className="mb-8">
        <span className="mb-1 inline-block text-xs font-bold uppercase tracking-wider text-indigo-600">
          Admin
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">A real-time snapshot of your marketplace</p>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={<FiDollarSign />} label="Revenue (excl. cancelled)" value={`$${totalRevenue.toFixed(2)}`} index={0} />
        <StatCard icon={<FiShoppingCart />} label="Orders" value={orders?.length ?? 0} index={1} />
        <StatCard icon={<FiBox />} label="Products" value={products?.length ?? 0} index={2} />
        <StatCard icon={<FiTag />} label="Categories" value={categories?.length ?? 0} index={3} />
        <StatCard icon={<FiStar />} label="Reviews" value={reviews?.length ?? 0} index={4} />
        <StatCard icon={<FiUsers />} label="Users" value={users?.length ?? 0} index={5} />
      </div>

      {/* Revenue trend */}
      <div className="mb-6">
        <ChartCard title="Revenue trend" subtitle="Last 14 active days">
          {revenueTrend.length === 0 ? (
            <EmptyState icon={<FiDollarSign />} title="No revenue data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke={ACCENT} strokeWidth={2} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orders by status */}
        <ChartCard title="Orders by status">
          {statusBreakdown.length === 0 ? (
            <EmptyState icon={<FiShoppingCart />} title="No orders yet" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {statusBreakdown.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Products per category */}
        <ChartCard title="Products per category">
          {categoryDistribution.length === 0 ? (
            <EmptyState icon={<FiTag />} title="No categories yet" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="count" fill={ACCENT} radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Top products by revenue */}
      <ChartCard title="Top products by revenue" subtitle="Cancelled orders excluded">
        {topProducts.length === 0 ? (
          <EmptyState icon={<FiBox />} title="No sales data yet" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="#fbbf24" radius={[0, 6, 6, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}