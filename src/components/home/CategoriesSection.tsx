"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiImage } from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();
  const { data: products } = useProducts();

  const featured = categories?.filter((c) => c.status === "ACTIVE").slice(0, 4) ?? [];

  const productsIn = (categoryId: string) =>
    products?.filter((p) => p.categoryId === categoryId && p.status !== "INACTIVE") ?? [];

  return (
    <section className="py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Popular Categories</h2>
        <Link
          href="/categories"
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View all <FiArrowRight className="text-xs" />
        </Link>
      </div>

      {isLoading && <LoadingSpinner label="Loading categories..." />}

      {!isLoading && featured.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-xs text-slate-500">
          No categories yet — check back soon.
        </div>
      )}

      {featured.length > 0 && (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {featured.map((category, index) => {
            const inCategory = productsIn(category.id);
            const thumb = inCategory.find((p) => !!p.image)?.image;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <Link
                  href={`/products?categoryId=${category.id}`}
                  className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white transition-all duration-200 hover:border-slate-200 hover:shadow-sm"
                >
                  {/* Category Image/Icon Container */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100/80 group-hover:bg-indigo-50/50 transition-colors">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={category.name}
                        className="h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <FiImage className="text-lg text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    )}
                  </div>

                  {/* Text Container */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {inCategory.length}+ products
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}