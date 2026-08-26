"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import { Button } from "@heroui/react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

interface SlideItem {
  id: string;
  name: string;
  description: string;
  price: number;
  bgImage: string;
  reviews?: Array<{ rating: number }>;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: "1",
    name: "Premium E-Commerce Collection",
    description: "Browse categories, compare products, and check out — with real-time stock and reviews.",
    price: 99.99,
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    reviews: [],
  },
  {
    id: "2",
    name: "Modern Tech & Electronics",
    description: "Discover the latest gadgets and electronics from verified global sellers.",
    price: 149.99,
    bgImage: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1600&auto=format&fit=crop",
    reviews: [],
  },
];

export function HeroSection() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeProducts = products?.filter((p) => p.status === "ACTIVE") ?? [];
  const productCount = activeProducts.length;
  const categoryCount = categories?.filter((c) => c.status === "ACTIVE").length ?? 0;

  const slides: SlideItem[] = activeProducts.length > 0
    ? activeProducts.slice(0, 5).map((p, index) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        bgImage: (p as any).image || (p as any).images?.[0] || DEFAULT_SLIDES[index % DEFAULT_SLIDES.length].bgImage,
        reviews: p.reviews,
      }))
    : DEFAULT_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];
  const currentSlideRating = currentSlide?.reviews && currentSlide.reviews.length > 0
    ? (currentSlide.reviews.reduce((s: number, r: { rating: number }) => s + (r.rating || 0), 0) / currentSlide.reviews.length).toFixed(1)
    : null;

  const chipNames = categories?.filter((c) => c.status === "ACTIVE").map((c) => c.name) ?? [];
  const marqueeNames = chipNames.length ? [...chipNames, ...chipNames] : [];

  return (
    <section className="relative flex h-[75vh] min-h-[460px] max-h-[560px] w-full flex-col items-center justify-between overflow-hidden rounded-3xl border border-slate-200/60 p-6 text-center shadow-sm sm:p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.bgImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentSlide.bgImage})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 -z-10 bg-slate-950/65 backdrop-blur-[2px]" />

      <div className="relative my-auto flex w-full max-w-2xl flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
              <FiShoppingBag className="text-indigo-400" /> {currentSlide.name}
            </span>

            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Featured — <span className="text-indigo-400">{currentSlide.name}</span>
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-slate-200 line-clamp-2 sm:text-sm">
              {currentSlide.description}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={`/products/${currentSlide.id}`}>
                <Button size="md" className="rounded-full bg-indigo-600 font-semibold text-white shadow-md transition-transform hover:bg-indigo-700 active:scale-95">
                  Shop Now (${currentSlide.price.toFixed(2)}) <FiArrowRight className="ml-1 text-sm" />
                </Button>
              </Link>

              <Link href="/categories">
                <Button size="md" variant="outline" className="rounded-full border-white/20 bg-white/10 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20">
                  Explore categories
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-slate-300">
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
                <FaStar className="inline text-[10px] text-amber-400" /> avg. rating
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