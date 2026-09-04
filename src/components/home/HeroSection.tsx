"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";

const AUTOPLAY_MS = 6000;

export function HeroSection() {
  const { data: products } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Real products only, most recently added first (stand-in for "featured"
  // since the backend has no featured flag) — every slide is a real product
  // with a real id, price, and image.
  const slides = useMemo(
    () =>
      (products ?? [])
        .filter((p) => p.status === "ACTIVE")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [products]
  );
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

  if (!hasSlides) return null;

  const currentSlide = slides[currentIndex];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden rounded-2xl bg-navy px-6 py-10 sm:px-10 sm:py-14 md:py-16"
    >
      <div className="mx-auto flex max-w-7xl items-center">
        {/* Left — copy */}
        <div className="relative z-10 w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-sm text-navy-foreground/80 sm:text-base">
                {currentSlide.category
                  ? `Featured in ${currentSlide.category.name}`
                  : "Featured on Ankara"}
              </p>
              <h1 className="mt-2 text-3xl font-bold uppercase leading-[1.05] tracking-tight text-navy-foreground sm:text-4xl md:text-5xl">
                {currentSlide.name}
              </h1>
              {/* Real price, not a fabricated discount claim — the product
                  model has no discount/oldPrice field to show one honestly. */}
              <p className="mt-3 text-xl font-bold text-navy-foreground sm:text-2xl">
                ${currentSlide.price.toFixed(2)}
              </p>

              <Link
                href={`/products/${currentSlide.id}`}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Shop now
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Dot pagination */}
          {slides.length > 1 && (
            <div className="mt-8 flex items-center gap-1.5 sm:mt-10">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-6 bg-navy-foreground"
                      : "w-1.5 bg-navy-foreground/35 hover:bg-navy-foreground/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — product image */}
        <div className="relative hidden flex-1 items-center justify-center sm:flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex h-48 w-48 items-center justify-center md:h-64 md:w-64"
            >
              {currentSlide.image ? (
                <img
                  src={currentSlide.image}
                  alt={currentSlide.name}
                  className="h-full w-full object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="h-full w-full rounded-2xl bg-navy-foreground/10" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous product"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-transform hover:scale-105 sm:left-5"
          >
            <FiChevronLeft aria-hidden="true" />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next product"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-transform hover:scale-105 sm:right-5"
          >
            <FiChevronRight aria-hidden="true" />
          </button>
        </>
      )}
    </section>
  );
}