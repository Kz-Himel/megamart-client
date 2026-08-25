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
    <section className="py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Featured products</h2>
          <p className="mt-1 text-sm text-muted">Fresh stock, picked from the current catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Scroll left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-accent hover:text-accent"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Scroll right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-accent hover:text-accent"
          >
            <FiChevronRight />
          </button>
          <Link
            href="/products"
            className="ml-2 flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            View all <FiArrowRight />
          </Link>
        </div>
      </div>

      {isLoading && <LoadingSpinner label="Loading products..." />}

      {!isLoading && featured.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center text-muted">
          <FiPackage className="text-2xl" />
          <p>No products yet — check back soon.</p>
        </div>
      )}

      {featured.length > 0 && (
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              data-card
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: (index % 4) * 0.06 }}
              className="w-[260px] flex-shrink-0 snap-start sm:w-[280px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}