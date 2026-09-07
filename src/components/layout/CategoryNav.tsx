"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";

export function CategoryNav({
  variant,
  onNavigate,
}: {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: categories } = useCategories();

  const activeCategoryId =
    pathname === "/products" ? searchParams.get("categoryId") : null;
  const activeCategories = categories?.filter((c) => c.status === "ACTIVE") ?? [];

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1 py-1">
        <Link
          href="/products"
          onClick={onNavigate}
          className={`flex items-center justify-between py-2 text-xs font-semibold ${
            pathname === "/products" && !activeCategoryId
              ? "text-sky-600 font-bold"
              : "text-slate-700"
          }`}
        >
          <span>Groceries / All</span>
          <FiChevronDown className="text-slate-400" />
        </Link>
        {activeCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            onClick={onNavigate}
            className={`flex items-center justify-between py-2 text-xs font-medium ${
              activeCategoryId === category.id
                ? "text-sky-600 font-bold"
                : "text-slate-600"
            }`}
          >
            <span>{category.name}</span>
            <FiChevronDown className="text-slate-400" />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden border-b border-slate-100 bg-white md:block">
      <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 text-xs sm:text-sm font-medium">
        
        {/* Active Pill / First Category Item (Matching MegaMart Image) */}
        <Link
          href="/products"
          className={`flex items-center gap-1.5 flex-shrink-0 rounded-full px-3.5 py-1.5 transition-all ${
            pathname === "/products" && !activeCategoryId
              ? "bg-sky-50 text-sky-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span>Groceries</span>
          <FiChevronDown className="text-xs text-sky-600" />
        </Link>

        {/* Dynamic Category List with Dropdown Indicators */}
        {activeCategories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              className={`flex items-center gap-1.5 flex-shrink-0 rounded-full px-3.5 py-1.5 transition-all ${
                isActive
                  ? "bg-sky-50 text-sky-600 font-semibold"
                  : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
              }`}
            >
              <span>{category.name}</span>
              <FiChevronDown
                className={`text-xs ${
                  isActive ? "text-sky-600" : "text-slate-400"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}