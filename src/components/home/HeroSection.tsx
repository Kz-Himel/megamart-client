"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import { Button } from "@heroui/react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export function HeroSection() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();

  const [currentIndex, setCurrentIndex] = useState(0);

  const activeProducts = products?.filter((p) => p.status === "ACTIVE") ?? [];
  const productCount = activeProducts.length;
  const categoryCount = categories?.filter((c) => c.status === "ACTIVE").length ?? 0;

  // Rating Stats
  const allRatings = activeProducts.flatMap((p) => p.reviews?.map((r) => r.rating) ?? []);
  const avgRating = allRatings.length
    ? (allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length).toFixed(1)
    : null;

  // Categories Marquee list
  const chipNames = categories?.filter((c) => c.status === "ACTIVE").map((c) => c.name) ?? [];
  const marqueeNames = chipNames.length ? [...chipNames, ...chipNames] : [];

  // Top Carousel Items
  const slides = activeProducts.length > 0 ? activeProducts.slice(0, 5) : [];

  // Auto-play interval (20 seconds)
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 20000); // 20000ms = 20 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  const currentSlideRating = currentSlide?.reviews?.length
    ? (currentSlide.reviews.reduce((s, r) => s + r.rating, 0) / currentSlide.reviews.length).toFixed(1)
    : null;

  return (
    <section className="relative flex flex-col items-center gap-10 py-16 text-center">
      <div className="relative min-h-[260px] w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Top Chip Badge */}
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <FiShoppingBag /> {currentSlide ? currentSlide.name : "Product Marketplace"}
            </span>

            {/* Main Headline */}
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {currentSlide ? (
                <>
                  Featured Product — <span className="text-accent">{currentSlide.name}</span>
                </>
              ) : (
                <>
                  Every catalog has a thread —{" "}
                  <span className="text-accent">yours starts here</span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-xl text-muted line-clamp-2">
              {currentSlide?.description ||
                "Browse categories, compare products, and check out — with real-time stock and reviews from real buyers."}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={currentSlide ? `/products/${currentSlide.id}` : "/products"}>
                <Button>
                  {currentSlide ? (
                    <>
                      View Item (${currentSlide.price.toFixed(2)}) <FiArrowRight className="ml-1" />
                    </>
                  ) : (
                    <>
                      Browse products <FiArrowRight className="ml-1" />
                    </>
                  )}
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="ghost">Explore categories</Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Marketplace Stats */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
        <span>
          <span className="font-display text-lg font-semibold text-foreground">
            {productCount}
          </span>{" "}
          products live
        </span>
        <span className="h-4 w-px bg-border" />
        <span>
          <span className="font-display text-lg font-semibold text-foreground">
            {categoryCount}
          </span>{" "}
          categories
        </span>
        {(avgRating || currentSlideRating) && (
          <>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1">
              <span className="font-display text-lg font-semibold text-foreground">
                {currentSlideRating || avgRating}
              </span>
              <FaStar className="text-xs text-accent inline" />
              avg. rating
            </span>
          </>
        )}
      </div>

      {/* Continuous Marquee Categories */}
      {marqueeNames.length > 0 && (
        <div className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee-track flex w-max gap-3">
            {marqueeNames.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex-shrink-0 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground/80"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}