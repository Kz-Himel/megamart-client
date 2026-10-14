"use client";

import Link from "next/link";
import {
  FiHeart,
  FiMail,
  FiPhone,
  FiShield,
  FiTruck,
  FiRotateCcw,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { useCategories } from "@/hooks/useCategories";

const QUICK_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/wishlist", label: "My Wishlist" },
  { href: "/cart", label: "Shopping Cart" },
  { href: "/orders", label: "Track Orders" },
  { href: "/about", label: "About MegaMart" },
  { href: "/contact", label: "Customer Support" },
];

const TRUST_HIGHLIGHTS = [
  { icon: FiTruck, title: "Free Worldwide Delivery", subtitle: "Orders over $50" },
  { icon: FiShield, title: "100% Secure Checkout", subtitle: "256-bit encryption" },
  { icon: FiRotateCcw, title: "30-Day Easy Returns", subtitle: "Hassle-free guarantee" },
];

export function Footer() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { data: categories } = useCategories();
  const topCategories = (categories ?? [])
    .filter((c) => c.status === "ACTIVE")
    .slice(0, 6);

  const accountLinks = [
    ...(isAuthenticated
      ? [
          {
            href: isAdmin ? "/dashboard" : "/account",
            label: isAdmin ? "Admin Dashboard" : "My Account",
          },
          { href: "/orders", label: "Order History" },
        ]
      : [
          { href: "/login", label: "Sign In" },
          { href: "/register", label: "Create Account" },
        ]),
  ];

  return (
    <footer className="border-t border-slate-800 bg-[#0F172A] text-slate-300">
      {/* Top Trust Strip */}
      <div className="border-b border-slate-800/80 bg-[#162033] py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TRUST_HIGHLIGHTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                    <Icon className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white sm:text-sm">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Mega<span className="text-sky-400">Mart</span>
              </span>
            </Link>
            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
              Your premier online marketplace for electronics, fashion essentials,
              accessories, and home decor with verified sellers and transparent buyer protection.
            </p>

            <div className="mt-5 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-sky-400" />
                <span>+1 (800) 555-MEGA (Mon-Fri, 9am - 6pm)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail className="text-sky-400" />
                <span>support@megamart.com</span>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Explore Store
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 transition-colors hover:text-sky-400 sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {topCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?categoryId=${category.id}`}
                    className="text-xs text-slate-400 transition-colors hover:text-sky-400 sm:text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {topCategories.length === 0 && (
                <li className="text-xs text-slate-500">No categories active</li>
              )}
            </ul>
          </div>

          {/* Customer Account & Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              My Account
            </h3>
            <ul className="mt-4 space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 transition-colors hover:text-sky-400 sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/seller/apply"
                  className="text-xs text-sky-400 font-semibold transition-colors hover:text-sky-300 sm:text-sm flex items-center gap-1"
                >
                  <span>Become a Seller &rarr;</span>
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Buyer Protection
              </span>
              <p className="mt-1 text-[11px] text-slate-400">
                Every purchase is covered by the MegaMart Full Satisfaction Warranty.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Payment Method Badges */}
        <div className="mt-12 border-t border-slate-800/80 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} MegaMart Inc. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              Crafted with <FiHeart className="text-rose-500 fill-rose-500" /> by{" "}
              <span className="font-semibold text-slate-300">Himel</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}