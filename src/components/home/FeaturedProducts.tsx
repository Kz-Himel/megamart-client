"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiPackage } from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function FeaturedProducts() {
  const { data: products, isLoading } = useProducts();
  const trackRef = useRef<HTMLDivElement>(null);

  const featured = products?.filter((p) => p.status === "ACTIVE").slice(0, 8) ?? [];

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const distance = (card?.offsetWidth ?? 280) + 16;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section className="w-full">
      {/* Header Area */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Featured Products
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Fresh stock, handpicked from our latest catalog.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {/* Scroll Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll left"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
            >
              <FiChevronLeft className="text-sm" />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Scroll right"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>

          {/* View All Button */}
          <Link
            href="/products"
            className="group flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            <span>View all</span>
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner label="Loading products..." />}

      {/* Empty State */}
      {!isLoading && featured.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center text-slate-400">
          <FiPackage className="text-3xl text-slate-300" />
          <p className="text-xs font-medium">No products yet — check back soon.</p>
        </div>
      )}

      {/* Product Carousel Track */}
      {featured.length > 0 && (
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 pt-1"
        >
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              data-card
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: (index % 4) * 0.05 }}
              className="w-[250px] flex-shrink-0 snap-start sm:w-[270px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}