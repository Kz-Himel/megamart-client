"use client";

import Link from "next/link";
import {
  FiShoppingBag,
  FiInstagram,
  FiTwitter,
  FiFacebook,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";

const SHOP_LINKS = [
  { href: "/products", label: "All products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "My orders" },
];

const SOCIALS = [
  { href: "#", label: "Instagram", Icon: FiInstagram },
  { href: "#", label: "Twitter", Icon: FiTwitter },
  { href: "#", label: "Facebook", Icon: FiFacebook },
];

export function Footer() {
  const { isAdmin } = useAuth();
  const accountLinks = [
    { href: "/register", label: "Create account" },
    { href: "/login", label: "Log in" },
    { href: isAdmin ? "/dashboard" : "/account/profile", label: isAdmin ? "Admin dashboard" : "Profile" },
  ];

  return (
    <footer className="mt-20 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
                <FiShoppingBag className="text-lg" />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Ankara
              </span>
            </Link>
            <p className="mt-3 max-w-[24ch] text-xs leading-relaxed text-slate-500">
              A marketplace woven around real stock, real reviews, real
              sellers.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50/50 text-slate-600 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                >
                  <Icon className="text-xs" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Account
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
              <li>Built by Himel</li>
              <li>Next.js · Express · Prisma</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Ankara Marketplace. All rights reserved.</p>
          <p className="font-semibold text-indigo-600">Built by Himel</p>
        </div>
      </div>
    </footer>
  );
}