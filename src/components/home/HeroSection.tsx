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
      className="relative w-full overflow-hidden rounded-2xl bg-[#212844] px-8 py-10 sm:px-12 sm:py-14 md:py-16 text-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        {/* Left Content */}
        <div className="relative z-10 w-full max-w-xl pl-2 sm:pl-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-sm font-light text-slate-300 sm:text-base">
                {currentSlide.category
                  ? `Best Deal Online on ${currentSlide.category.name}`
                  : "Best Deal Online on smart watches"}
              </p>
              
              <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
                {currentSlide.name}
              </h1>

              <p className="mt-3 text-lg font-bold tracking-wide text-slate-200 sm:text-xl">
                UP TO 80% OFF
              </p>

              <div className="mt-6">
                <Link
                  href={`/products/${currentSlide.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-[#212844] transition-all hover:bg-slate-100 hover:shadow-lg"
                >
                  Shop now
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot Pagination */}
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
                      ? "w-7 bg-white"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — Product Image Container */}
        <div className="relative hidden flex-1 items-center justify-center sm:flex">
          {/* Subtle Background Glow Circle */}
          <div className="absolute h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10 flex h-60 w-60 items-center justify-center md:h-72 md:w-72"
            >
              {currentSlide.image ? (
                <img
                  src={currentSlide.image}
                  alt={currentSlide.name}
                  className="h-full w-full object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
                />
              ) : (
                <div className="h-full w-full rounded-2xl bg-white/10 backdrop-blur-sm" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Side Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous product"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#212844] sm:left-4"
          >
            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next product"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#212844] sm:right-4"
          >
            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}
    </section>
  );
}