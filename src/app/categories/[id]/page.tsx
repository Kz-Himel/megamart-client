"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiFolder,
  FiSearch,
  FiArrowLeft,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: products, isLoading: isProductsLoading, isError, refetch } = useProducts({
    categoryId: id,
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const category = categories?.find((c) => c.id === id);

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = products.filter((p) => p.status !== "INACTIVE");

    if (inStockOnly) {
      list = list.filter((p) => p.status === "ACTIVE" && p.stock > 0);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "newest":
      default:
        return [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [products, search, sort, inStockOnly]);

  if (isCategoriesLoading) {
    return (
      <div className="py-8">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-100 mb-6" />
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (!category && !isCategoriesLoading) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<FiFolder className="text-4xl text-slate-300" />}
          title="Category Not Found"
          description="The category you requested could not be found or has been removed."
          action={
            <Link href="/categories">
              <Button variant="primary" size="md" className="rounded-xl bg-[#008ECC] text-white">
                View All Categories
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const categoryName = category?.name ?? "Category";

  return (
    <div className="py-2 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/categories" },
          { label: categoryName },
        ]}
      />

      {/* Category Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A2238] to-[#253252] p-6 sm:p-10 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block rounded-full bg-sky-500/20 px-3.5 py-1 text-xs font-semibold text-sky-300">
            Category Collection
          </span>
          <h1 className="mt-2 text-2xl font-black text-white sm:text-4xl">
            {categoryName}
          </h1>
          <p className="mt-2 text-xs text-slate-300 sm:text-sm">
            {category?.description ||
              `Discover verified ${categoryName.toLowerCase()} products with direct delivery and buyer protection.`}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-300 font-semibold">
            <span className="rounded-full bg-white/10 px-3 py-1">
              {filtered.length} {filtered.length === 1 ? "Product" : "Products"} available
            </span>
          </div>
        </div>
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        {/* Search within Category */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search in ${categoryName}...`}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#008ECC] focus:bg-white"
          />
        </div>

        {/* Right Controls: In-Stock Toggle & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-slate-300 text-[#008ECC] focus:ring-[#008ECC]"
            />
            <span>In Stock Only</span>
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort products"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 outline-none focus:border-[#008ECC] focus:bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 py-16 text-center">
          <FiAlertCircle className="text-3xl text-rose-400" />
          <div>
            <p className="text-sm font-semibold text-rose-700">Couldn&apos;t load products</p>
            <p className="mt-1 text-xs text-rose-500">Something went wrong reaching the server.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {!isError && isProductsLoading && <ProductGridSkeleton count={4} />}

      {/* Products Grid */}
      {!isError && !isProductsLoading && (
        <>
          {filtered.length === 0 ? (
            <div className="py-10">
              <EmptyState
                icon={<FiPackage className="text-4xl text-slate-300" />}
                title="No Products Found"
                description={
                  search || inStockOnly
                    ? "No products match your active search or stock filters."
                    : `There are currently no products available under ${categoryName}.`
                }
                action={
                  search || inStockOnly ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setInStockOnly(false);
                      }}
                      className="rounded-xl"
                    >
                      Reset Filters
                    </Button>
                  ) : (
                    <Link href="/products">
                      <Button variant="primary" size="sm" className="rounded-xl bg-[#008ECC] text-white">
                        Browse All Products
                      </Button>
                    </Link>
                  )
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Bottom Navigation */}
      <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 font-semibold text-[#008ECC] hover:underline"
        >
          <FiArrowLeft /> All Categories
        </Link>
        <Link
          href="/products"
          className="font-semibold text-slate-500 hover:text-slate-800"
        >
          View Entire Store Catalog &rarr;
        </Link>
      </div>
    </div>
  );
}
