"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface DashboardMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  index?: number;
  onClick?: () => void;
}

export function DashboardMetricCard({
  icon,
  label,
  value,
  trend,
  trendUp = true,
  subtitle,
  index = 0,
  onClick,
}: DashboardMetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-sky-200 hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F8FF] text-[#008ECC] text-lg font-bold border border-sky-100">
          {icon}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
              trendUp
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}
          >
            {trendUp ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {subtitle && <p className="mt-1 text-[11px] text-slate-400 font-medium">{subtitle}</p>}
      </div>

      {/* Decorative gradient corner matching MegaMart branding */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-[#008ECC]/5 blur-xl" />
    </motion.div>
  );
}
