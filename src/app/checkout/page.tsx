"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/orders/new?fromCart=true");
  }, [router]);

  return (
    <div className="py-20 flex justify-center items-center">
      <LoadingSpinner label="Navigating to secure checkout..." />
    </div>
  );
}
