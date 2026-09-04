"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";

/**
 * Renders the real-category pill row (desktop, under the header) or the
 * equivalent list (mobile menu). Kept in its own component — rather than
 * inline in Navbar — because it's the only piece that needs
 * `useSearchParams()`, and that hook forces whatever calls it directly into
 * client-only rendering unless it's wrapped in its own `<Suspense>`.
 * Wrapping this component alone keeps the rest of the header (and every
 * static page under it) statically prerenderable.
 */
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
      <>
        <Link
          href="/products"
          onClick={onNavigate}
          className={`text-xs font-semibold py-1.5 ${
            pathname === "/products" && !activeCategoryId ? "text-accent" : "text-slate-700"
          }`}
        >
          All Products
        </Link>
        {activeCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            onClick={onNavigate}
            className={`text-xs font-semibold py-1.5 ${
              activeCategoryId === category.id ? "text-accent" : "text-slate-700"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </>
    );
  }

  if (activeCategories.length === 0) return null;

  return (
    <div className="hidden border-b border-border bg-white md:block">
      <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
        <Link
          href="/products"
          className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            pathname === "/products" && !activeCategoryId
              ? "bg-accent text-accent-foreground"
              : "text-slate-600 hover:bg-[#F6F6F6]"
          }`}
        >
          All Products
        </Link>
        {activeCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategoryId === category.id
                ? "bg-accent text-accent-foreground"
                : "text-slate-600 hover:bg-[#F6F6F6]"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}