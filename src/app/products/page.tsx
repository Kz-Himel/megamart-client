"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiX,
  FiAlertCircle,
  FiPackage,
  FiSliders,
} from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatCurrency } from "@/lib/utils/formatters";

type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStock") === "true"
  );

  // Debounce search input
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
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStockOnly) params.set("inStock", "true");

    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, debouncedSearch, sort, minPrice, maxPrice, inStockOnly]);

  // Fetch products with server-side query params where applicable
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useProducts({
    categoryId: categoryId || undefined,
    search: debouncedSearch || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    inStock: inStockOnly || undefined,
    sort,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const activeCategory = categories?.find((c) => c.id === categoryId);

  // Client-side verification and fallback sorting
  const filtered = useMemo(() => {
    if (!products) return [];
    let result = products.filter((p) => p.status !== "INACTIVE");

    if (inStockOnly) {
      result = result.filter((p) => p.status === "ACTIVE" && p.stock > 0);
    }

    if (categoryId) {
      result = result.filter((p) => p.categoryId === categoryId);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) result = result.filter((p) => p.price >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
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
  }, [products, categoryId, debouncedSearch, sort, minPrice, maxPrice, inStockOnly]);

  const hasActiveFilters = Boolean(
    categoryId || debouncedSearch || minPrice || maxPrice || inStockOnly
  );

  const clearAllFilters = () => {
    setCategoryId("");
    setSearch("");
    setDebouncedSearch("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
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

      {/* Page Title & Count Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="relative inline-block text-xl font-extrabold text-slate-800 sm:text-2xl">
            {activeCategory ? activeCategory.name : "All"}{" "}
            <span className="text-[#008ECC]">Products</span>
            <span className="absolute -bottom-[17px] left-0 h-[3px] w-full bg-[#008ECC] rounded-full" />
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {isProductsLoading
              ? "Loading verified catalog..."
              : `Showing ${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
          </p>
        </div>

        {/* Category Quick Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={() => setCategoryId("")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              !categoryId
                ? "bg-[#008ECC] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {categories
            ?.filter((c) => c.status === "ACTIVE")
            .map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id === categoryId ? "" : cat.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  cat.id === categoryId
                    ? "bg-[#008ECC] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>
      </div>

      {/* Multi-parameter Filter & Control Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 items-center">
          {/* 1. Search Query Field (4 cols) */}
          <div className="relative sm:col-span-2 md:col-span-2 lg:col-span-4">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or keyword..."
              aria-label="Search products"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#008ECC] focus:bg-white"
            />
          </div>

          {/* 2. Category Select (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isCategoriesLoading}
              aria-label="Filter by category"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 outline-none transition-all focus:border-[#008ECC] focus:bg-white"
            >
              <option value="">All Categories</option>
              {categories
                ?.filter((c) => c.status === "ACTIVE")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* 3. Price Filter Inputs (3 cols) */}
          <div className="flex items-center gap-1.5 lg:col-span-3">
            <input
              type="number"
              min="0"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-[#008ECC] focus:bg-white"
              aria-label="Minimum price"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              min="0"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-[#008ECC] focus:bg-white"
              aria-label="Maximum price"
            />
          </div>

          {/* 4. Sort Dropdown (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort products"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 outline-none transition-all focus:border-[#008ECC] focus:bg-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bottom Filter Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-2.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-slate-300 text-[#008ECC] focus:ring-[#008ECC]"
            />
            <span>Show In-Stock Items Only</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="font-bold text-xs text-rose-500 hover:text-rose-600 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Badges Strip */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <FiSliders className="text-xs" /> Filters:
          </span>

          {activeCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#008ECC] border border-sky-100">
              Category: {activeCategory.name}
              <button
                onClick={() => setCategoryId("")}
                aria-label={`Remove ${activeCategory.name} filter`}
                className="rounded-full hover:opacity-70"
              >
                <FiX />
              </button>
            </span>
          )}

          {debouncedSearch && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#008ECC] border border-sky-100">
              Query: &ldquo;{debouncedSearch}&rdquo;
              <button
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                }}
                aria-label="Remove search filter"
                className="rounded-full hover:opacity-70"
              >
                <FiX />
              </button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#008ECC] border border-sky-100">
              Price: {minPrice ? formatCurrency(Number(minPrice)) : "$0"} -{" "}
              {maxPrice ? formatCurrency(Number(maxPrice)) : "Any"}
              <button
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                aria-label="Remove price filter"
                className="rounded-full hover:opacity-70"
              >
                <FiX />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
              In Stock Only
              <button
                onClick={() => setInStockOnly(false)}
                aria-label="Remove in stock filter"
                className="rounded-full hover:opacity-70"
              >
                <FiX />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Error State */}
      {isProductsError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 py-16 text-center">
          <FiAlertCircle className="text-3xl text-rose-400" />
          <div>
            <p className="text-sm font-semibold text-rose-700">Couldn&apos;t load products</p>
            <p className="mt-1 text-xs text-rose-500">Something went wrong reaching the server.</p>
          </div>
          <button
            onClick={() => refetchProducts()}
            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {!isProductsError && isProductsLoading && <ProductGridSkeleton count={8} />}

      {/* Rendered Products Grid */}
      {!isProductsError && !isProductsLoading && (
        <>
          {filtered.length === 0 && hasActiveFilters ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
              <FiPackage className="text-3xl text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No products match your filters</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Try widening your price range, clearing the search term, or selecting a different category.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-3 rounded-xl bg-[#008ECC] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#0073A8]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </>
      )}
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