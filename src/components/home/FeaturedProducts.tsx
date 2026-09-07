"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiPackage } from "react-icons/fi";
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
    const distance = (card?.offsetWidth ?? 240) + 16;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section className="w-full py-4">
      {/* MegaMart Section Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="relative text-base sm:text-lg font-bold text-slate-800">
          Grab the best deal on <span className="text-sky-600">Smartphones</span>
          {/* Active bottom line matching MegaMart UI */}
          <span className="absolute -bottom-[13px] left-0 h-[3px] w-full bg-sky-500 rounded-full" />
        </h2>

        <div className="flex items-center gap-3">
          {/* View All Link */}
          <Link
            href="/products"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <span>View All</span>
            <FiChevronRight className="text-sm text-sky-500" aria-hidden="true" />
          </Link>

          {/* Scroll Navigation Arrows */}
          <div className="hidden items-center gap-1 sm:flex">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll left"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300 transition-all active:scale-95"
            >
              <FiChevronLeft className="text-sm" />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Scroll right"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300 transition-all active:scale-95"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner label="Loading products..." />}

      {/* Empty State */}
      {!isLoading && featured.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center text-slate-400">
          <FiPackage className="text-3xl text-slate-300" />
          <p className="text-xs font-medium">No products available in this section.</p>
        </div>
      )}

      {/* Product Carousel Track */}
      {featured.length > 0 && (
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pt-1"
        >
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              data-card
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: (index % 4) * 0.05 }}
              className="w-[210px] flex-shrink-0 snap-start sm:w-[230px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}