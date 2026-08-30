"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiShoppingBag, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import { Button } from "@heroui/react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop";

const AUTOPLAY_MS = 6000;

export function HeroSection() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeProducts = products?.filter((p) => p.status === "ACTIVE") ?? [];
  const productCount = activeProducts.length;
  const activeCategories = categories?.filter((c) => c.status === "ACTIVE") ?? [];
  const categoryCount = activeCategories.length;

  // Real products only — every slide here corresponds to an actual product
  // with a real id, price, and image. No fabricated fallback listings.
  const slides = activeProducts.slice(0, 5);
  const hasSlides = slides.length > 0;

  const goTo = useCallback(
    (index: number) => {
      if (!hasSlides) return;
      setCurrentIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [hasSlides, slides.length]
  );

  useEffect(() => {
    if (!hasSlides || slides.length < 2 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [hasSlides, slides.length, isPaused]);

  const currentSlide = slides[currentIndex];
  const currentSlideReviews = currentSlide?.reviews ?? [];
  const currentSlideRating =
    currentSlideReviews.length > 0
      ? (
          currentSlideReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          currentSlideReviews.length
        ).toFixed(1)
      : null;

  const chipNames = activeCategories.map((c) => c.name);
  const marqueeNames = chipNames.length ? [...chipNames, ...chipNames] : [];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex h-[62vh] min-h-[420px] w-full flex-col items-center justify-between overflow-hidden rounded-3xl border border-slate-200/60 p-5 text-center shadow-sm sm:h-[70vh] sm:min-h-[480px] sm:max-h-[600px] sm:p-8"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide?.id ?? "fallback"}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentSlide?.image || FALLBACK_BG})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/85 via-slate-950/55 to-slate-950/35" />

      <div className="relative my-auto flex w-full max-w-2xl flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide?.id ?? "empty"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-200 backdrop-blur-md">
              <FiShoppingBag className="text-indigo-300" aria-hidden="true" />
              {currentSlide ? "Featured product" : "Ankara Marketplace"}
            </span>

            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-6xl">
              {currentSlide ? (
                <>
                  <span className="block sm:inline">Discover </span>
                  <span className="text-indigo-400">{currentSlide.name}</span>
                </>
              ) : (
                "A marketplace built for real shopping"
              )}
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-slate-200/90 line-clamp-2 sm:text-sm md:text-base">
              {currentSlide
                ? currentSlide.description
                : "Browse real categories, compare real products, and check out with confidence."}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {currentSlide ? (
                <Link href={`/products/${currentSlide.id}`}>
                  <Button
                    size="lg"
                    className="rounded-full bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-900/30 transition-transform hover:bg-indigo-700 active:scale-95"
                  >
                    Shop now — ${currentSlide.price.toFixed(2)} <FiArrowRight className="ml-1.5 text-sm" />
                  </Button>
                </Link>
              ) : (
                <Link href="/products">
                  <Button
                    size="lg"
                    className="rounded-full bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-900/30 transition-transform hover:bg-indigo-700 active:scale-95"
                  >
                    Browse products <FiArrowRight className="ml-1.5 text-sm" />
                  </Button>
                </Link>
              )}

              <Link href="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/25 bg-white/10 px-6 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 sm:text-sm"
                >
                  Explore categories
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual controls — only meaningful with more than one slide */}
        {slides.length > 1 && (
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() => goTo(currentIndex - 1)}
              aria-label="Previous product"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              <FiChevronLeft />
            </button>
            <div className="flex items-center gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo(currentIndex + 1)}
              aria-label="Next product"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs text-slate-300">
          <span>
            <span className="font-semibold text-white">{productCount}</span> products live
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span>
            <span className="font-semibold text-white">{categoryCount}</span> categories
          </span>
          {currentSlideRating && (
            <>
              <span className="h-3 w-px bg-white/20" />
              <span className="flex items-center gap-1">
                <span className="font-semibold text-white">{currentSlideRating}</span>
                <FaStar className="inline text-[10px] text-amber-400" aria-hidden="true" /> avg. rating
              </span>
            </>
          )}
        </div>

        {marqueeNames.length > 0 && (
          <div className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-track flex w-max gap-2">
              {marqueeNames.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="flex-shrink-0 rounded-full border border-white/10 bg-white/10 px-3.5 py-1 text-xs text-slate-200 backdrop-blur-md"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}