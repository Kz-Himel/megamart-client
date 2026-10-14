"use client";

import Link from "next/link";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";

const TRENDING_ITEMS = [
  {
    title: "Wireless Earbuds",
    price: "From $19.99",
    href: "/products?search=earbuds",
    icon: (
      <svg className="h-7 w-7 text-[#008ECC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
      </svg>
    ),
  },
  {
    title: "Smart Watches",
    price: "From $29.99",
    href: "/products?search=watch",
    icon: (
      <svg className="h-7 w-7 text-[#008ECC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7"/>
        <polyline points="12 9 12 12 13.5 13.5"/>
        <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/>
      </svg>
    ),
  },
  {
    title: "Gaming Accessories",
    price: "From $14.99",
    href: "/products?search=gaming",
    icon: (
      <svg className="h-7 w-7 text-[#008ECC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3"/>
        <line x1="6" y1="12" x2="10" y2="12"/>
        <line x1="8" y1="10" x2="8" y2="14"/>
        <circle cx="16" cy="10" r="1" fill="currentColor"/>
        <circle cx="18" cy="12" r="1" fill="currentColor"/>
      </svg>
    ),
  },
];

export function PromoBanners() {
  return (
    <section className="w-full py-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Left 3D Promotional Banner (Approx 65% width) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-[#008ECC] to-[#0284C7] p-8 text-white shadow-md lg:col-span-8 min-h-[260px]">
          {/* Subtle Background Glow */}
          <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full max-w-sm sm:max-w-md">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                MegaMart Specials
              </span>
              <h3 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Big Deals <br />
                Bigger Smiles
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-medium text-sky-100">
                Up to 50% OFF on top brands & verified products
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs sm:text-sm font-bold text-[#008ECC] shadow-md transition-all hover:bg-slate-50 hover:shadow-lg active:scale-95"
              >
                <span>Shop Now</span>
                <FiArrowRight className="text-sm" />
              </Link>
            </div>
          </div>

          {/* 3D Gift Box Asset floating on right */}
          <div className="absolute right-0 bottom-0 top-0 hidden sm:flex items-center justify-end w-1/2 pointer-events-none pr-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/promo_big_deals.jpg"
              alt="MegaMart Big Deals Gift Box"
              className="h-56 w-56 sm:h-64 sm:w-64 object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)] rounded-2xl"
            />
          </div>
        </div>

        {/* Right "Trending Now" Section (Approx 35% width) */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Trending Now
            </h3>
            <p className="text-[11px] text-slate-400">Popular items customers love</p>
          </div>

          <div className="divide-y divide-slate-100 py-2">
            {TRENDING_ITEMS.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group flex items-center justify-between py-3.5 transition-colors hover:bg-slate-50/60 rounded-xl px-2"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 transition-colors group-hover:bg-sky-100/70 border border-sky-100/60">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 transition-colors group-hover:text-[#008ECC]">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-[#008ECC] font-mono">
                      {item.price}
                    </span>
                  </div>
                </div>

                <FiChevronRight className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#008ECC]" />
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#008ECC]"
            >
              <span>Explore All Trending</span>
              <FiChevronRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}