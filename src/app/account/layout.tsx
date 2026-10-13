"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiGrid,
  FiShoppingBag,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const NAV_ITEMS = [
  { href: "/account", label: "Overview", icon: FiGrid },
  { href: "/orders", label: "My Orders", icon: FiShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: FiHeart },
  { href: "/account/cart", label: "Shopping Cart", icon: FiShoppingCart },
  { href: "/account/profile", label: "My Profile", icon: FiUser },
  { href: "/account/payments", label: "Payment Info", icon: FiCreditCard },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[50vh]">
        <LoadingSpinner label="Loading your account..." />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setIsLogoutOpen(false);
  };

  return (
    <div className="bg-[#F3F9FB] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <nav className="flex gap-1.5 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-3 shadow-xs md:flex-col md:overflow-visible">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/account"
                  ? pathname === "/account"
                  : href === "/orders"
                  ? pathname?.startsWith("/orders")
                  : pathname?.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#008ECC] text-white shadow-xs"
                      : "text-gray-600 hover:bg-[#F3F9FB] hover:text-[#008ECC]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}

            <div className="mt-2 pt-2 border-t border-slate-100 hidden md:block">
              <button
                type="button"
                onClick={() => setIsLogoutOpen(true)}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          {children}
        </main>
      </div>

      <ConfirmDialog
        isOpen={isLogoutOpen}
        title="Confirm Log Out"
        description="Are you sure you want to end your current MegaMart session?"
        confirmLabel="Yes, Log Out"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </div>
  );
}