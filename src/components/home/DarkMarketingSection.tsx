"use client";

import Link from "next/link";
import { FiShoppingBag, FiTrendingUp, FiSliders } from "react-icons/fi";

export function DarkMarketingSection() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-[#0B132B] px-8 py-12 sm:px-12 sm:py-16 text-white shadow-xl my-8">
      {/* Subtle Cyan / Blue Glow Behind Visual */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute left-10 top-0 h-64 w-64 rounded-full bg-sky-500/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-10 lg:flex-row">
        {/* Left Content Column */}
        <div className="flex w-full flex-col lg:w-3/5 text-center lg:text-left">
          {/* Brand Monogram Tag */}
          <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-sky-400 backdrop-blur-md">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#008ECC] text-white text-[10px] font-black">
              M
            </span>
            <span>MegaMart Ecosystem</span>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            More Than Just <br className="hidden sm:inline" />
            An Online Store
          </h2>

          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
            MegaMart is your trusted e-commerce platform, where buyers, sellers, and admins come together to create a seamless, high-velocity shopping experience.
          </p>

          {/* 3 Role Pillars: Buy, Sell, Manage */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/products"
              className="flex flex-col items-center lg:items-start rounded-2xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 hover:border-sky-400/50 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008ECC] text-white shadow-md mb-3 transition-transform group-hover:scale-110">
                <FiShoppingBag className="text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white">Buy</h3>
              <p className="mt-1 text-xs text-slate-400 text-center lg:text-left">
                Shop from top brands & verified sellers
              </p>
            </Link>

            <Link
              href="/seller/apply"
              className="flex flex-col items-center lg:items-start rounded-2xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 hover:border-sky-400/50 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md mb-3 transition-transform group-hover:scale-110">
                <FiTrendingUp className="text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white">Sell</h3>
              <p className="mt-1 text-xs text-slate-400 text-center lg:text-left">
                Grow your business & reach customers
              </p>
            </Link>

            <Link
              href="/dashboard"
              className="flex flex-col items-center lg:items-start rounded-2xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 hover:border-sky-400/50 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md mb-3 transition-transform group-hover:scale-110">
                <FiSliders className="text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white">Manage</h3>
              <p className="mt-1 text-xs text-slate-400 text-center lg:text-left">
                Full catalog control & real-time analytics
              </p>
            </Link>
          </div>
        </div>

        {/* Right 3D Visual Column: Glowing 3D Bag */}
        <div className="relative flex w-full items-center justify-center lg:w-2/5">
          <div className="relative h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/dark_marketing_bag.jpg"
              alt="MegaMart Glowing 3D Shopping Bag"
              className="h-full w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,142,204,0.3)] rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
