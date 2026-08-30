"use client";

import { FiHeart } from "react-icons/fi";
import { EmptyState } from "@/components/ui/EmptyState";

// Scaffold only — there is no wishlist API yet. This intentionally shows no
// data (real or fake) until that endpoint exists.
export default function WishlistPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-slate-900">Wishlist</h1>
      <EmptyState
        icon={<FiHeart />}
        title="Wishlist is coming soon"
        description="This section is scaffolded and ready to go — it'll show your saved products once the wishlist API is connected."
      />
    </div>
  );
}