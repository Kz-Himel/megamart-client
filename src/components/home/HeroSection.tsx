"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#EBF5FC] via-[#F0F8FF] to-[#E3F2FD] border border-sky-100 p-8 sm:p-12 md:p-16 shadow-xs">
      {/* Background Soft Glow Accents */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
      <div className="absolute left-10 -bottom-20 h-72 w-72 rounded-full bg-blue-100/50 blur-2xl pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-10 lg:flex-row">
        {/* Left Content Column */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          {/* Subtle Translucent Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#008ECC] shadow-xs backdrop-blur-xs"
          >
            <HiSparkles className="text-sm text-[#008ECC]" />
            <span>Smart Shopping, Better Living</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-5xl/tight"
          >
            Everything You Need <br className="hidden sm:inline" />
            <span className="text-[#008ECC]">In One Place</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-slate-600"
          >
            Discover amazing deals, top brands and the best products — all at your fingertips.
          </motion.p>

          {/* Dual Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#008ECC] px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0073A8] hover:shadow-lg active:scale-95"
            >
              <span>Shop Now</span>
              <FiArrowRight className="text-base" />
            </Link>

            <Link
              href="/products?sort=price-asc"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:border-[#008ECC] hover:text-[#008ECC] active:scale-95"
            >
              <span>Explore Deals</span>
            </Link>
          </motion.div>
        </div>

        {/* Right 3D Visual Column */}
        <div className="relative flex w-full items-center justify-center lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative h-72 w-72 sm:h-96 sm:w-96 md:h-[420px] md:w-[420px]"
          >
            {/* Float effect */}
            <motion.div
              animate={{ y: [-4, 6, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero_shopping_cart.jpg"
                alt="MegaMart 3D Shopping Cart with Deals"
                className="h-full w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,142,204,0.15)] rounded-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}