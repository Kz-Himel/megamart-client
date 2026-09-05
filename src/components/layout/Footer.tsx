"use client";

import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { useCategories } from "@/hooks/useCategories";

const SHOP_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "My Orders" },
];

// Text-only, not links — these policy/info pages don't exist yet. A dead "#"
// link that looks clickable is worse than plain text that doesn't pretend to
// be one (same reasoning as the utility bar's "Deliver to" / "All Offers").
const CUSTOMER_SERVICE_PLACEHOLDERS = [
  "About Us",
  "Terms & Conditions",
  "FAQ",
  "Privacy Policy",
  "Cancellation & Return Policy",
];

export function Footer() {
  const { isAdmin } = useAuth();
  const { data: categories } = useCategories();
  const topCategories = (categories ?? []).filter((c) => c.status === "ACTIVE").slice(0, 8);

  const accountLinks = [
    { href: "/register", label: "Create account" },
    { href: "/login", label: "Log in" },
    {
      href: isAdmin ? "/dashboard" : "/account/profile",
      label: isAdmin ? "Admin Dashboard" : "Profile Settings",
    },
  ];

  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand column */}
          <div>
            <Link href="/" className="text-2xl font-display font-bold tracking-tight">
              Ankara
            </Link>
            <p className="mt-3 max-w-xs text-sm text-accent-foreground/80">
              A marketplace woven around real stock, real reviews, and real
              sellers.
            </p>
            <ul className="mt-5 space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-accent-foreground/80 transition-colors hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Real categories — honest stand-in for the reference's
              "Most Popular Categories" list */}
          {topCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide">
                Most Popular Categories
              </h3>
              <ul className="mt-4 space-y-2.5">
                {topCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?categoryId=${category.id}`}
                      className="text-sm text-accent-foreground/80 transition-colors hover:text-accent-foreground"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Customer Services + account */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">
              Customer Services
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CUSTOMER_SERVICE_PLACEHOLDERS.map((label) => (
                <li key={label} className="text-sm text-accent-foreground/60">
                  {label}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wide">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-accent-foreground/80 transition-colors hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-accent-foreground/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-accent-foreground/70 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} All rights reserved. Ankara.</p>
            <p className="flex items-center gap-1.5">
              Crafted with <FiHeart className="fill-current text-xs" aria-hidden="true" /> by{" "}
              <span className="font-semibold">Himel</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}