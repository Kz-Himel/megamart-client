"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiShield,
  FiTruck,
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const VALUES = [
  {
    icon: FiShield,
    title: "Uncompromising Trust",
    desc: "Every seller is rigorously vetted before listing items. All orders are backed by 100% money-back buyer guarantee.",
  },
  {
    icon: FiTruck,
    title: "Rapid Worldwide Logistics",
    desc: "Direct shipping network with real-time parcel tracking and 2-day priority dispatch for prime marketplace items.",
  },
  {
    icon: FiUsers,
    title: "Empowering Independent Sellers",
    desc: "We provide state-of-the-art seller analytics and low commission fees so makers and merchants can thrive.",
  },
  {
    icon: FiAward,
    title: "Curated Excellence",
    desc: "From authentic electronics to organic apparel, our quality checks ensure every item matches its product description.",
  },
];

const STATS = [
  { value: "50,000+", label: "Happy Shoppers" },
  { value: "1,200+", label: "Verified Merchants" },
  { value: "99.8%", label: "On-Time Delivery" },
  { value: "24/7", label: "Customer Care" },
];

export default function AboutPage() {
  return (
    <div className="py-2 space-y-12">
      <Breadcrumbs items={[{ label: "About MegaMart" }]} />

      {/* Hero Section with 3D Visual */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EBF5FC] via-[#F4F9FD] to-white p-8 sm:p-14 border border-sky-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#008ECC] shadow-xs border border-sky-100">
              <FiShoppingBag className="w-3.5 h-3.5" />
              <span>Smart Shopping, Better Living</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Redefining Modern <span className="text-[#008ECC]">E-Commerce</span> with Trust & Speed
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              MegaMart is a next-generation multi-vendor e-commerce platform built to connect discerning buyers with reputable brands and independent vendors worldwide. We believe shopping should be frictionless, secure, and delightfully fast.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008ECC] text-white font-bold text-sm shadow-md hover:bg-[#007BB5] transition"
              >
                <span>Shop Marketplace</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/seller/apply"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:border-[#008ECC] hover:text-[#008ECC] transition"
              >
                <span>Become a Seller</span>
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl border border-sky-100 bg-white">
              <Image
                src="/images/hero_shopping_cart.jpg"
                alt="MegaMart 3D Platform"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-xs"
          >
            <p className="text-3xl font-extrabold text-[#008ECC] tracking-tight">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* Values & Standards */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008ECC]">
            Our Pillars
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Hundreds of Thousands Choose MegaMart
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Every feature on our platform is architected around transparency, quality verification, and consumer protection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-[#008ECC]/40 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F0F8FF] text-[#008ECC] flex items-center justify-center text-xl mb-4">
                  <Icon />
                </div>
                <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Multi-Vendor Commitment */}
      <section className="rounded-3xl bg-[#0F172A] text-white p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-block rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-400">
            The MegaMart Promise
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Connecting Global Buyers With Exceptional Stores
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Whether you&apos;re hunting for the latest high-spec smartphone, refreshing your summer wardrobe, or styling your home with ergonomic furniture, MegaMart brings verified sellers and transparent buyer guarantees under one seamless sky-blue roof.
          </p>
          <div className="pt-2 flex items-center gap-6 text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-sky-400" /> Real-time tracking
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-sky-400" /> Buyer escrow guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-sky-400" /> 24/7 dedicated support
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
