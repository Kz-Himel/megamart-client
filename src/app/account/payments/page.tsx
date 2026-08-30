"use client";

import { FiCreditCard } from "react-icons/fi";
import { EmptyState } from "@/components/ui/EmptyState";

// Scaffold only — there is no payments API yet. This intentionally shows no
// data (real or fake) until that endpoint exists.
export default function PaymentsPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
      <EmptyState
        icon={<FiCreditCard />}
        title="Payments is coming soon"
        description="This section is scaffolded and ready to go — it'll show your payment methods and history once the payments API is connected."
      />
    </div>
  );
}