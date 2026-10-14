"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiX,
  FiAlertCircle,
  FiPackage,
  FiSliders,
  FiChevronDown,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const BRANDS = ["Samsung", "Apple", "Xiaomi", "Sony", "HP", "Nike", "Adidas"];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "0");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "1500");
  const [appliedMinPrice, setAppliedMinPrice] = useState(searchParams.get("minPrice") ?? "0");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(searchParams.get("maxPrice") ?? "1500");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync URL query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (sort !== "newest") params.set("sort", sort);
    if (appliedMinPrice && appliedMinPrice !== "0") params.set("minPrice", appliedMinPrice);
    if (appliedMaxPrice && appliedMaxPrice !== "1500") params.set("maxPrice", appliedMaxPrice);

    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
  }, [categoryId, debouncedSearch, sort, appliedMinPrice, appliedMaxPrice, router]);

  // Fetch verified products
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useProducts({
    categoryId: categoryId || undefined,
    search: debouncedSearch || undefined,
    minPrice: appliedMinPrice ? Number(appliedMinPrice) : undefined,
    maxPrice: appliedMaxPrice ? Number(appliedMaxPrice) : undefined,
    sort,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const activeCategories = (categories ?? []).filter((c) => c.status === "ACTIVE");

  const activeCategory = activeCategories.find((c) => c.id === categoryId);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleApplyPrice = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

  // Filter client-side by status, search, and brands
  const filtered = useMemo(() => {
    if (!products) return [];
    let result = products.filter((p) => p.status !== "INACTIVE");

    if (categoryId) {
      result = result.filter((p) => p.categoryId === categoryId);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) =>
        selectedBrands.some(
          (brand) =>
            p.name.toLowerCase().includes(brand.toLowerCase()) ||
            p.description?.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    if (appliedMinPrice) {
      const min = Number(appliedMinPrice);
      if (!isNaN(min)) result = result.filter((p) => p.price >= min);
    }

    if (appliedMaxPrice) {
      const max = Number(appliedMaxPrice);
      if (!isNaN(max)) result = result.filter((p) => p.price <= max);
    }

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
      default:
        return [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [
    products,
    categoryId,
    debouncedSearch,
    selectedBrands,
    appliedMinPrice,
    appliedMaxPrice,
    sort,
  ]);

  const clearAllFilters = () => {
    setCategoryId("");
    setSearch("");
    setDebouncedSearch("");
    setMinPrice("0");
    setMaxPrice("1500");
    setAppliedMinPrice("0");
    setAppliedMaxPrice("1500");
    setSelectedBrands([]);
    setSort("newest");
  };

  return (
    <div className="py-2 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={
          activeCategory
            ? [
                { label: "Products", href: "/products" },
                { label: activeCategory.name },
              ]
            : [{ label: "All Products" }]
        }
      />

      {/* Top Promotional Banner (Matching Reference Image) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#008ECC] via-[#0284C7] to-[#38BDF8] p-6 sm:p-10 text-white shadow-md">
        {/* Soft Background Radial Light */}
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between max-w-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-100">
            Exclusive Deal
          </span>
          <h2 className="mt-1 text-2xl sm:text-4xl font-black text-white leading-tight">
            Latest Tech. <br />
            Smarter. Faster. Better.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-sky-100 max-w-sm">
            Discover the latest gadgets and electronics to elevate your everyday workflow.
          </p>
          <div className="pt-4">
            <Link
              href="/products?categoryId=electronics"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-[#008ECC] shadow-md transition-all hover:bg-slate-50 hover:shadow-lg active:scale-95"
            >
              <span>Shop Now</span>
              <FiArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* 3D Floating Tech Gadgets Asset on Right */}
        <div className="absolute right-0 bottom-0 top-0 hidden md:flex items-center justify-end w-1/2 pointer-events-none pr-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/tech_banner_gadgets.jpg"
            alt="Latest Tech Gadgets"
            className="h-64 w-64 lg:h-72 lg:w-72 object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)] rounded-2xl"
          />
        </div>
      </div>

      {/* Main Two-Column Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 items-start">
        {/* Mobile Filters Toggle Button */}
        <div className="flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs"
          >
            <FiSliders className="text-[#008ECC]" />
            <span>Filter & Categories</span>
          </button>
          <span className="text-xs font-semibold text-slate-500">
            {filtered.length} Products
          </span>
        </div>

        {/* Left Sidebar Filter (Desktop & Collapsible Mobile) */}
        <aside
          className={`space-y-6 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs lg:col-span-1 lg:sticky lg:top-24 ${
            isMobileFiltersOpen ? "block" : "hidden lg:block"
          }`}
        >
          {/* Categories Filter Block */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Categories
              </h3>
              {categoryId && (
                <button
                  type="button"
                  onClick={() => setCategoryId("")}
                  className="text-[11px] font-semibold text-[#008ECC] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="mt-3 space-y-1">
              <button
                type="button"
                onClick={() => setCategoryId("")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  !categoryId
                    ? "bg-[#008ECC] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#008ECC]"
                }`}
              >
                <span>All Categories</span>
                {!categoryId && <FiCheck className="text-xs" />}
              </button>

              {activeCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(isSelected ? "" : cat.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      isSelected
                        ? "bg-[#008ECC] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#008ECC]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <FiCheck className="text-xs" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider Block */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Price Range
            </h3>

            <div className="space-y-3">
              {/* Range slider input */}
              <input
                type="range"
                min="0"
                max="2500"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-[#008ECC] cursor-pointer"
                aria-label="Price range upper limit"
              />

              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                <span>$0</span>
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[#008ECC]">
                  ${maxPrice}
                </span>
                <span>$2,500</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Min</label>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Max</label>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyPrice}
                className="w-full rounded-xl bg-[#008ECC] py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0073A8] transition-all active:scale-98"
              >
                Apply Price
              </button>
            </div>
          </div>

          {/* Brand Filter Checkboxes */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Brand
            </h3>

            <div className="space-y-2">
              {BRANDS.map((brand) => {
                const checked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-[#008ECC]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBrand(brand)}
                      className="h-4 w-4 rounded-md border-slate-300 text-[#008ECC] focus:ring-[#008ECC]"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Clear All Filters */}
          <div className="pt-2">
            <button
              type="button"
              onClick={clearAllFilters}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Right Main Content Column: Header + Products Grid */}
        <main className="lg:col-span-3 space-y-5">
          {/* Header Row: All Products (count) + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                All Products{" "}
                <span className="text-sm font-semibold text-slate-400 font-mono">
                  ({filtered.length})
                </span>
              </h1>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-slate-800 outline-none focus:border-[#008ECC] cursor-pointer shadow-2xs"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isProductsLoading && <ProductGridSkeleton count={8} />}

          {/* Error State */}
          {isProductsError && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-rose-200 bg-rose-50/50 py-16 text-center">
              <FiAlertCircle className="text-3xl text-rose-500" />
              <div>
                <p className="text-sm font-bold text-rose-800">
                  Failed to load products
                </p>
                <p className="mt-1 text-xs text-rose-600">
                  Check your network connection and try again.
                </p>
              </div>
              <button
                type="button"
                onClick={() => refetchProducts()}
                className="rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isProductsLoading && !isProductsError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
              <FiPackage className="text-4xl text-slate-300" />
              <div>
                <p className="text-base font-bold text-slate-800">
                  No matching products found
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Try adjusting your category, price range, or brand filters.
                </p>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="rounded-full bg-[#008ECC] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0073A8] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Product Cards Grid: 3 columns on tablet/desktop (Matching Mockup) */}
          {!isProductsLoading && !isProductsError && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 sm:gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <ProductsContent />
    </Suspense>
  );
}