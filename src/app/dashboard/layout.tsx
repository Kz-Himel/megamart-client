"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
}