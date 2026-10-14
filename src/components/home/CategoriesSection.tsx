"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category.types";

function CategoryIcon({ name }: { name: string }) {
  const n = name.toLowerCase();

  if (n.includes("elect") || n.includes("gadget") || n.includes("laptop")) {
    return (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 64 64" fill="none">
        <rect x="12" y="14" width="40" height="26" rx="4" fill="url(#laptopGrad)" />
        <rect x="16" y="18" width="32" height="18" rx="2" fill="#0F172A" />
        <path d="M6 44h52a3 3 0 0 1 3 3v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a3 3 0 0 1 3-3z" fill="#94A3B8" />
        <rect x="26" y="44" width="12" height="2" rx="1" fill="#CBD5E1" />
        <defs>
          <linearGradient id="laptopGrad" x1="12" y1="14" x2="52" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes("fash") || n.includes("cloth") || n.includes("wear")) {
    return (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 64 64" fill="none">
        <path d="M22 12l10 6 10-6 12 10-5 10-7-4v24H22V28l-7 4-5-10 12-10z" fill="url(#shirtGrad)" />
        <path d="M26 12a6 6 0 0 0 12 0H26z" fill="#E2E8F0" />
        <defs>
          <linearGradient id="shirtGrad" x1="10" y1="12" x2="54" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes("home") || n.includes("furn") || n.includes("living")) {
    return (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 64 64" fill="none">
        <path d="M18 20a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v16H18V20z" fill="url(#chairGrad)" />
        <rect x="12" y="32" width="8" height="14" rx="4" fill="#38BDF8" />
        <rect x="44" y="32" width="8" height="14" rx="4" fill="#0284C7" />
        <rect x="16" y="38" width="32" height="10" rx="3" fill="#0369A1" />
        <path d="M20 48l-3 8M44 48l3 8" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="chairGrad" x1="18" y1="16" x2="46" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284C7" />
            <stop offset="1" stopColor="#0C4A6E" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes("beauty") || n.includes("health") || n.includes("cosmetic")) {
    return (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 64 64" fill="none">
        <rect x="22" y="22" width="20" height="32" rx="6" fill="url(#beautyGrad)" />
        <rect x="28" y="16" width="8" height="6" fill="#F43F5E" />
        <path d="M30 16v-4h10" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="34" r="4" fill="#FFF1F2" />
        <defs>
          <linearGradient id="beautyGrad" x1="22" y1="22" x2="42" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FB7185" />
            <stop offset="1" stopColor="#E11D48" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes("sport") || n.includes("outdoor") || n.includes("fit")) {
    return (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="22" fill="#FFFFFF" stroke="#008ECC" strokeWidth="2.5" />
        <path d="M32 20l7 5-3 8h-8l-3-8 7-5z" fill="#008ECC" />
        <path d="M32 10v10M13 23l9 2M18 45l8-4M46 45l-8-4M51 23l-9 2M32 54v-11" stroke="#008ECC" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes("toy") || n.includes("game") || n.includes("kid")) {
    return (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 64 64" fill="none">
        <circle cx="21" cy="22" r="6" fill="#F59E0B" />
        <circle cx="43" cy="22" r="6" fill="#F59E0B" />
        <circle cx="32" cy="32" r="14" fill="url(#bearGrad)" />
        <circle cx="27" cy="29" r="2" fill="#1E293B" />
        <circle cx="37" cy="29" r="2" fill="#1E293B" />
        <ellipse cx="32" cy="36" rx="5" ry="3.5" fill="#FEF3C7" />
        <circle cx="32" cy="35" r="1.5" fill="#1E293B" />
        <defs>
          <linearGradient id="bearGrad" x1="18" y1="18" x2="46" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes("book") || n.includes("station") || n.includes("note")) {
    return (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 64 64" fill="none">
        <rect x="16" y="12" width="32" height="42" rx="4" fill="url(#bookGrad)" />
        <rect x="20" y="16" width="24" height="34" rx="2" fill="#F8FAFC" />
        <path d="M26 24h12M26 30h12M26 36h8" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34 12v14l3-3 3 3V12" fill="#008ECC" />
        <defs>
          <linearGradient id="bookGrad" x1="16" y1="12" x2="48" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Default / Groceries / Food
  return (
    <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 64 64" fill="none">
      <ellipse cx="26" cy="24" rx="6" ry="6" fill="#10B981" />
      <ellipse cx="38" cy="22" rx="7" ry="7" fill="#F59E0B" />
      <circle cx="32" cy="20" r="5" fill="#EF4444" />
      <path d="M14 30h36l-4 22H18L14 30z" fill="url(#basketGrad)" />
      <path d="M14 30c0-9 8-16 18-16s18 7 18 16" stroke="#92400E" strokeWidth="3" fill="none" />
      <defs>
        <linearGradient id="basketGrad" x1="14" y1="30" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D97706" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  // If database categories exist, map them; otherwise show default 8 categories from reference image
  const defaultCategories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home-living", name: "Home & Living" },
    { id: "beauty-health", name: "Beauty & Health" },
    { id: "sports-outdoors", name: "Sports & Outdoors" },
    { id: "toys-games", name: "Toys & Games" },
    { id: "books-stationery", name: "Books & Stationery" },
    { id: "groceries", name: "Groceries" },
  ];

  const dbCategories = (categories ?? []).filter((c: Category) => c.status === "ACTIVE");
  const displayList = dbCategories.length >= 4 ? dbCategories : defaultCategories;

  return (
    <section className="w-full py-4 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Shop by Category
          </h2>
        </div>

        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#008ECC] hover:underline group"
        >
          <span>View All</span>
          <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 8 Squircle Cards Grid (as in Reference Image) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 sm:gap-4">
        {isLoading && dbCategories.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5 animate-pulse">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-slate-100" />
                <div className="h-3 w-14 rounded-full bg-slate-100" />
              </div>
            ))
          : displayList.map((item) => (
              <Link
                key={item.id}
                href={`/products?categoryId=${item.id}`}
                className="group flex flex-col items-center gap-2.5 text-center transition-all"
              >
                {/* Squircle Card Container */}
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-slate-200/90 bg-[#F8FAFC] shadow-2xs transition-all duration-300 group-hover:bg-white group-hover:border-[#008ECC]/50 group-hover:shadow-md group-hover:-translate-y-1">
                  <CategoryIcon name={item.name} />
                </div>

                {/* Category Title */}
                <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-[#008ECC] line-clamp-1 max-w-[95px]">
                  {item.name}
                </span>
              </Link>
            ))}
      </div>
    </section>
  );
}