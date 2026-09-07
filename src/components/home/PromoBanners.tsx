"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export function PromoBanners() {
  return (
    <section className="w-full py-4">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Banner 1 */}
        <div className="relative flex min-h-[180px] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E293B] to-[#334155] p-6 text-white shadow-md sm:p-8">
          <div className="relative z-10 max-w-[240px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Limited Time Offer
            </span>
            <h3 className="mt-1 text-xl font-extrabold sm:text-2xl">
              Latest Smart Accessories
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Get up to 40% OFF on premium gadgets.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-sky-600 hover:shadow-lg"
            >
              <span>Shop Deals</span>
              <FiArrowRight />
            </Link>
          </div>
          {/* Decorative Circle Background */}
          <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-sky-500/10 blur-xl" />
        </div>

        {/* Banner 2 */}
        <div className="relative flex min-h-[180px] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-6 text-white shadow-md sm:p-8">
          <div className="relative z-10 max-w-[240px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              New Arrival
            </span>
            <h3 className="mt-1 text-xl font-extrabold sm:text-2xl">
              Trendy Fashion Essentials
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Explore the fresh collection today.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-slate-900 transition-all hover:bg-slate-100 hover:shadow-lg"
            >
              <span>Explore Now</span>
              <FiArrowRight />
            </Link>
          </div>
          {/* Decorative Circle Background */}
          <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-amber-500/10 blur-xl" />
        </div>
      </div>
    </section>
  );
}