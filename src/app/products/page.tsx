"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX, FiAlertCircle, FiPackage } from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";

type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useProducts();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState<SortOption>("newest");

  // Debounce typing so we're not re-filtering on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Keep the URL shareable/bookmarkable without a hard navigation.
  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    if (debouncedSearch) params.set("search", debouncedSearch);
    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, debouncedSearch]);

  const activeCategory = categories?.find((c) => c.id === categoryId);

  const filtered = useMemo(() => {
    if (!products) return [];
    const result = products
      .filter((p) => p.status !== "INACTIVE")
      .filter((p) => (categoryId ? p.categoryId === categoryId : true))
      .filter((p) =>
        debouncedSearch ? p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) : true
      );

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "newest":
      default:
        return [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [products, categoryId, debouncedSearch, sort]);

  const hasActiveFilters = Boolean(categoryId || search);

  return (
    <div className="py-2">
      {/* MegaMart Standard Page Header */}
      <div className="mb-6 border-b border-slate-200 pb-3">
        <h1 className="relative inline-block text-xl font-extrabold text-slate-800 sm:text-2xl">
          All <span className="text-sky-600">Products</span>
          <span className="absolute -bottom-[13px] left-0 h-[3px] w-full bg-sky-500 rounded-full" />
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          {isProductsLoading
            ? "Loading catalog..."
            : `Showing ${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Field */}
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full rounded-full border border-slate-200 bg-[#F6F6F6] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={isCategoriesLoading}
          aria-label="Filter by category"
          className="rounded-full border border-slate-200 bg-[#F6F6F6] px-4 py-2.5 text-xs sm:text-sm text-slate-700 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 sm:w-52"
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

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort products"
          className="rounded-full border border-slate-200 bg-[#F6F6F6] px-4 py-2.5 text-xs sm:text-sm text-slate-700 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 sm:w-48"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filter Badge */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {activeCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-100">
              {activeCategory.name}
              <button
                onClick={() => setCategoryId("")}
                aria-label={`Remove ${activeCategory.name} filter`}
                className="rounded-full hover:opacity-70"
              >
                <FiX />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setCategoryId("");
              setSearch("");
            }}
            className="text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            Clear all
          </button>
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

      {/* Loading State */}
      {!isProductsError && isProductsLoading && <ProductGridSkeleton count={8} />}

      {/* Loaded Content */}
      {!isProductsError && !isProductsLoading && (
        <>
          {filtered.length === 0 && hasActiveFilters ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
              <FiPackage className="text-3xl text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No products match your filters.</p>
              <button
                onClick={() => {
                  setCategoryId("");
                  setSearch("");
                }}
                className="mt-1 text-xs font-semibold text-sky-600 hover:underline"
              >
                Clear filters
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