"use client";

import Link from "next/link";
import { FiImage, FiChevronRight } from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";

// The reference's "Daily Essentials" row is grocery-specific (vegetables,
// fruit, a produce basket) and doesn't map onto a general marketplace's real
// categories at all — labeling arbitrary products "Daily Essentials" would
// be misleading on a store that might sell electronics or furniture. Same
// circle + label pattern, real products and real prices instead.
export function PopularPicks() {
  const { data: products, isLoading } = useProducts();

  // A different slice than FeaturedProducts (offset by 5) so the two rows
  // don't just repeat the same cards.
  const picks = [...(products ?? [])]
    .filter((p) => p.status === "ACTIVE")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(5, 11);

  if (!isLoading && picks.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
          <span className="inline-block border-b-2 border-accent pb-2">
            Popular <span className="text-accent">Picks</span>
          </span>
        </h2>
        <Link
          href="/products"
          className="flex flex-shrink-0 items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-accent"
        >
          View All <FiChevronRight aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-20 w-20 animate-pulse rounded-full bg-slate-100 sm:h-24 sm:w-24" />
              <div className="h-2.5 w-12 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {picks.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#F6F6F6] ring-1 ring-transparent transition-all group-hover:ring-accent sm:h-24 sm:w-24">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <FiImage className="text-2xl text-slate-300" aria-hidden="true" />
                )}
              </span>
              <span className="truncate text-xs font-medium text-slate-700 sm:text-sm">
                {product.name}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                ${product.price.toFixed(2)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}