"use client";

import Link from "next/link";
import {
  FiShoppingBag,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiArrowUpRight,
  FiHeart,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";

const SHOP_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "My Orders" },
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
    {
      href: isAdmin ? "/dashboard" : "/account/profile",
      label: isAdmin ? "Admin Dashboard" : "Profile Settings",
    },
  ];

  return (
    <footer className="relative mt-28 overflow-hidden bg-slate-950 pt-16 pb-12 text-slate-300">
      {/* Background Accent Gradient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-0 h-64 w-64 rounded-full bg-violet-600/10 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Unique Card Banner / CTA */}
        <div className="mb-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md md:flex-row md:p-10">
          <div>
            <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Next-Gen E-Commerce
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Experience authentic shopping with Ankara.
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Real stock, verified customer reviews, and trusted independent sellers.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/50"
          >
            Explore Marketplace
            <FiArrowUpRight className="text-base transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand Info (5 Cols) */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
                <FiShoppingBag className="text-xl" />
              </span>
              <span className="text-xl font-black tracking-tight text-white">
                Ankara<span className="text-indigo-500">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              A marketplace woven around real stock, real reviews, and real sellers. 
              Designed for speed, reliability, and security.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-indigo-500 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-600/30"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links Layout (7 Cols) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {/* Shop Column */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Shop
              </h3>
              <ul className="mt-4 space-y-3">
                {SHOP_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Column */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Account
              </h3>
              <ul className="mt-4 space-y-3">
                {accountLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Column */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Tech Stack
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Next.js", "Express", "Prisma", "Tailwind"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-slate-800/80 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Ankara Marketplace. All rights reserved.</p>
            <p className="flex items-center gap-1.5 font-medium text-slate-400">
              Crafted with <FiHeart className="text-rose-500 fill-rose-500 text-xs" /> by{" "}
              <span className="font-semibold text-indigo-400">Himel</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}