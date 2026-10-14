"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface DashboardHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  badge,
  title,
  subtitle,
  breadcrumbs,
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-3 pb-6 border-b border-slate-100">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F0F8FF] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-[#008ECC] border border-sky-100 mb-1.5">
              {badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center flex-wrap gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}
