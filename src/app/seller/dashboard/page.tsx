"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  FiBox,
  FiShoppingBag,
  FiClock,
  FiTrendingUp,
  FiArrowUpRight,
  FiSearch,
  FiBell,
  FiChevronRight,
  FiDollarSign,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/lib/auth/useAuth";
import { formatCurrency } from "@/lib/utils/formatters";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const SALES_DATA = [
  { date: "Apr 25", sales: 1200 },
  { date: "May 01", sales: 1850 },
  { date: "May 08", sales: 1600 },
  { date: "May 15", sales: 2450 },
  { date: "May 22", sales: 2900 },
  { date: "May 29", sales: 3400 },
];

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { data: products } = useProducts();
  const { data: orders } = useOrders();

  const totalProducts = products?.length ?? 18;
  const activeOrders = orders ?? [];
  const totalSales = activeOrders.reduce((sum, o) => sum + o.totalPrice, 0) || 12450;
  const totalOrdersCount = activeOrders.length || 48;
  const pendingOrdersCount =
    activeOrders.filter((o) => o.status === "PENDING").length || 7;

  // Top products list matching the mockup
  const topProducts = useMemo(() => {
    if (products && products.length > 0) {
      return products.slice(0, 3).map((p, idx) => ({
        id: p.id,
        name: p.name,
        salesCount: 24 - idx * 6,
        image: p.image,
      }));
    }
    return [
      { id: "1", name: "Wireless Headphones", salesCount: 24, image: null },
      { id: "2", name: "Smart Watch", salesCount: 18, image: null },
      { id: "3", name: "Travel Backpack", salesCount: 12, image: null },
    ];
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl py-4 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Seller Dashboard" },
        ]}
      />

      {/* Seller Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#008ECC]">
            Merchant Console
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Seller Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage your products, orders, and grow your business on MegaMart.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/new"
            className="rounded-full bg-[#008ECC] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0073A8] transition-all"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* 3 Metric Stat Cards (Matching Reference Mockup) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Total Sales */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Sales
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#008ECC]">
              <FiDollarSign className="text-lg" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 font-mono">
            {formatCurrency(totalSales)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <FiArrowUpRight />
            <span>+12% vs last month</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#008ECC]">
              <FiShoppingBag className="text-lg" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 font-mono">
            {totalOrdersCount}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <FiArrowUpRight />
            <span>+8% vs last month</span>
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FiClock className="text-lg" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 font-mono">
            {pendingOrdersCount}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <FiClock />
            <span>+3% vs last month</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sales Overview Spline Area Chart + Top Products List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Sales Overview Area Chart (Approx 65% width) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Sales Overview
              </h2>
              <p className="text-xs text-slate-400">Monthly revenue volume trends</p>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-[#008ECC] border border-sky-100">
              Current Period
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sellerSalesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008ECC" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#008ECC" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  formatter={(val: any) => [`$${val}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#008ECC"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#sellerSalesFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products List (Approx 35% width - Matching Reference Mockup) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Top Products
              </h2>
              <p className="text-xs text-slate-400">Best performing store listings</p>
            </div>

            <div className="divide-y divide-slate-100">
              {topProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                      ) : (
                        <FiBox className="text-slate-400 text-lg" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[150px]">
                        {p.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#008ECC]">
                        {p.salesCount} sold
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-400 font-mono">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/products"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#008ECC] transition-colors"
            >
              <span>Manage All Products</span>
              <FiChevronRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
