"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiGrid, FiShoppingCart, FiHeart, FiUser, FiCreditCard } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const NAV_ITEMS = [
  { href: "/account", label: "Overview", icon: FiGrid },
  { href: "/account/cart", label: "Cart", icon: FiShoppingCart },
  { href: "/account/wishlist", label: "Wishlist", icon: FiHeart },
  { href: "/account/profile", label: "My Profile", icon: FiUser },
  { href: "/account/payments", label: "Payments", icon: FiCreditCard },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Middleware already blocks unauthenticated requests server-side; this is
  // a client-side backstop for the brief moment auth state is hydrating.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading your account..." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-24 md:self-start">
        <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm md:flex-col md:overflow-visible">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === "/account" ? pathname === "/account" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                <Icon /> {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}