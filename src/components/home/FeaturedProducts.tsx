"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiPackage } from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function FeaturedProducts() {
  const { data: products, isLoading } = useProducts();

  const bestSellers = products?.filter((p) => p.status === "ACTIVE").slice(0, 5) ?? [];

  return (
    <section className="w-full py-4 space-y-6">
      {/* MegaMart Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          Best Selling Products
        </h2>

        <Link
          href="/products?sort=popular"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#008ECC] hover:underline group"
        >
          <span>View All</span>
          <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner label="Loading best selling products..." />}

      {/* Empty State */}
      {!isLoading && bestSellers.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center text-slate-400">
          <FiPackage className="text-3xl text-slate-300" />
          <p className="text-xs font-medium">No products available in this section.</p>
        </div>
      )}

      {/* 5-Column Responsive Product Grid (Matching Reference Image) */}
      {bestSellers.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}