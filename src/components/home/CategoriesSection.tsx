"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FiArrowRight, 
  FiFolder, 
  FiTv, 
  FiShoppingBag, 
  FiHome, 
  FiBookOpen, 
  FiSmile, 
  FiCpu, 
  FiWatch, 
  FiGift 
} from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Category interfaces
interface Category {
  id: string;
  name: string;
  status: string;
  image?: string;
}

interface Product {
  id: string;
  categoryId: string;
  status: string;
  images?: string[];
}

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  const iconClasses = "text-xl text-indigo-600 transition-colors group-hover:text-white";

  if (name.includes("electronic") || name.includes("device") || name.includes("gadget")) return <FiTv className={iconClasses} aria-hidden="true" />;
  if (name.includes("fashion") || name.includes("cloth") || name.includes("wear")) return <FiShoppingBag className={iconClasses} aria-hidden="true" />;
  if (name.includes("home") || name.includes("living") || name.includes("furniture")) return <FiHome className={iconClasses} aria-hidden="true" />;
  if (name.includes("book") || name.includes("study") || name.includes("education")) return <FiBookOpen className={iconClasses} aria-hidden="true" />;
  if (name.includes("beauty") || name.includes("health") || name.includes("care")) return <FiSmile className={iconClasses} aria-hidden="true" />;
  if (name.includes("tech") || name.includes("computer") || name.includes("mobile")) return <FiCpu className={iconClasses} aria-hidden="true" />;
  if (name.includes("watch") || name.includes("accessory") || name.includes("jewel")) return <FiWatch className={iconClasses} aria-hidden="true" />;
  if (name.includes("toy") || name.includes("gift")) return <FiGift className={iconClasses} aria-hidden="true" />;
  return <FiFolder className={iconClasses} aria-hidden="true" />;
};

export function CategoriesSection() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: products, isLoading: isProductsLoading } = useProducts();

  const isLoading = isCategoriesLoading || isProductsLoading;

  // Optimize category list
  const featured = useMemo(() => {
    return categories?.filter((c: Category) => c.status === "ACTIVE").slice(0, 4) ?? [];
  }, [categories]);

  // Group active products by categoryId for O(1) lookups
  const categoryProductsMap = useMemo(() => {
    const map = new Map<string, Product[]>();
    if (!products) return map;

    for (const product of products) {
      if (product.status !== "INACTIVE") {
        const existing = map.get(product.categoryId) || [];
        existing.push(product);
        map.set(product.categoryId, existing);
      }
    }
    return map;
  }, [products]);

  return (
    <section className="w-full py-4">
      <div className="mb-6">
        <span className="mb-1 inline-block text-xs font-bold uppercase tracking-wider text-indigo-600">
          Explore
        </span>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Popular Categories
          </h2>
          <Link
            href="/categories"
            className="group flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1 py-0.5"
          >
            <span>View all</span>
            <FiArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {isLoading && <LoadingSpinner label="Loading categories..." />}

      {!isLoading && featured.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center text-xs text-slate-400">
          No categories available right now.
        </div>
      )}

      {!isLoading && featured.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featured.map((category: Category, index: number) => {
            const categoryProducts = categoryProductsMap.get(category.id) ?? [];
            const count = categoryProducts.length;
            const thumb = category.image || categoryProducts.find((p) => Boolean(p.images?.[0]))?.images?.[0];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/products?categoryId=${category.id}`}
                  className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/40 to-indigo-50/20 p-4 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {/* Background Glow */}
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-500/5 transition-transform duration-500 group-hover:scale-150 group-hover:bg-indigo-500/10" />

                  {/* Icon/Image Wrapper */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50/80 ring-1 ring-indigo-500/10 transition-all duration-300 group-hover:bg-indigo-600 group-hover:ring-indigo-600 group-hover:shadow-md group-hover:shadow-indigo-600/30">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={category.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      getCategoryIcon(category.name)
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="relative min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800 transition-colors duration-200 group-hover:text-indigo-600 sm:text-sm">
                      {category.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 transition-colors group-hover:bg-indigo-100/80 group-hover:text-indigo-700">
                        {count} {count === 1 ? "item" : "items"}
                      </span>
                    </div>
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