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
      className="relative w-full overflow-hidden rounded-3xl bg-[#1A2238] px-8 py-10 sm:px-14 sm:py-12 md:py-16 text-white shadow-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        {/* Left Content Container */}
        <div className="relative z-10 w-full max-w-lg pl-2 sm:pl-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-sm font-normal text-slate-300 sm:text-base tracking-wide">
                {currentSlide.category
                  ? `Best Deal Online on ${currentSlide.category.name.toLowerCase()}`
                  : "Best Deal Online on smart watches"}
              </p>

              <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
                {currentSlide.name}
              </h1>

              <p className="mt-2 text-lg font-bold tracking-widest text-slate-100 sm:text-xl">
                UP TO 80% OFF
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dot Pagination Below Text (Pixel Exact Position) */}
          {slides.length > 1 && (
            <div className="mt-8 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — Product Image Preview */}
        <div className="relative hidden flex-1 items-center justify-center sm:flex">
          {/* Circular Visual Glow Frame */}
          <div className="absolute h-60 w-60 rounded-full bg-sky-500/10 blur-2xl md:h-72 md:w-72" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 flex h-64 w-64 items-center justify-center md:h-80 md:w-80"
            >
              {currentSlide.image ? (
                <img
                  src={currentSlide.image}
                  alt={currentSlide.name}
                  className="h-full w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div className="h-full w-full rounded-2xl bg-slate-800/50 backdrop-blur-md" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Side Navigation Arrows (Overlay Buttons) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous product"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#1A2238] sm:left-4"
          >
            <FiChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next product"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#1A2238] sm:right-4"
          >
            <FiChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </>
      )}
    </section>
  );
}