"use client";

import { FiShoppingCart } from "react-icons/fi";
import { EmptyState } from "@/components/ui/EmptyState";

// Scaffold only — there is no cart API yet. This intentionally shows no
// data (real or fake) until that endpoint exists.
export default function CartPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-slate-900">Cart</h1>
      <EmptyState
        icon={<FiShoppingCart />}
        title="Cart is coming soon"
        description="This section is scaffolded and ready to go — it'll show your saved cart items once the cart API is connected."
      />
    </div>
  );
}