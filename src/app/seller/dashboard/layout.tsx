"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/seller/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[50vh]">
        <LoadingSpinner label="Authenticating merchant workspace..." />
      </div>
    );
  }

  return <DashboardShell role="SELLER">{children}</DashboardShell>;
}
