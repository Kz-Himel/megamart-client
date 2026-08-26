"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import { Button } from "@heroui/react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const DEFAULT_SLIDES = [
  {
    id: "1",
    name: "Premium E-Commerce Collection",
    description: "Browse categories, compare products, and check out — with real-time stock and reviews.",
    price: 99.99,
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Modern Tech & Electronics",
    description: "Discover the latest gadgets and electronics from verified global sellers.",
    price: 149.99,
    bgImage: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Fashion & Lifestyle Essentials",
    description: "Upgrade your lifestyle with trending fashion lines and exclusive marketplace items.",
    price: 79.99,
    bgImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1600&auto=format&fit=crop",
  },
];

export function HeroSection() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();

  const [currentIndex, setCurrentIndex] = useState(0);

  const activeProducts = products?.filter((p) => p.status === "ACTIVE") ?? [];
  const productCount = activeProducts.length;
  const categoryCount = categories?.filter((c) => c.status === "ACTIVE").length ?? 0;

  const slides = activeProducts.length > 0
    ? activeProducts.slice(0, 5).map((p, index) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        bgImage: p.images?.[0] || DEFAULT_SLIDES[index % DEFAULT_SLIDES.length].bgImage,
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

  const currentSlideRating = currentSlide?.reviews?.length
    ? (currentSlide.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / currentSlide.reviews.length).toFixed(1)
    : null;

  const chipNames = categories?.filter((c) => c.status === "ACTIVE").map((c) => c.name) ?? [];
  const marqueeNames = chipNames.length ? [...chipNames, ...chipNames] : [];

  return (
    <section className="relative flex h-[80vh] max-h-[600px] w-full flex-col items-center justify-between overflow-hidden rounded-3xl border border-border px-4 py-6 text-center">
      {/* Dynamic Background Image Slider */}
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

      {/* Dark Overlay for Text Visibility */}
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-[2px]" />

      {/* Main Content (Centered) */}
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
            {/* Top Badge */}
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/20 px-3 py-1 text-xs font-medium text-accent backdrop-blur-md">
              <FiShoppingBag /> {currentSlide.name}
            </span>

            {/* Headline */}
            <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              Featured — <span className="text-accent">{currentSlide.name}</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-2 max-w-lg text-xs text-gray-200 line-clamp-2 sm:text-sm">
              {currentSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6">
              <Link href={`/products/${currentSlide.id}`}>
                <Button size="sm" className="bg-accent font-medium text-accent-foreground sm:size-md">
                  Shop Now (${currentSlide.price.toFixed(2)}) <FiArrowRight className="ml-1" />
                </Button>
              </Link>

              <Link href="/categories">
                <Button size="sm" variant="ghost" className="border-white/20 text-white hover:bg-white/10 sm:size-md">
                  Explore categories
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Content: Stats & Marquee */}
      <div className="w-full space-y-3">
        {/* Marketplace Stats */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-gray-300">
          <span>
            <span className="font-display font-semibold text-white">
              {productCount}
            </span>{" "}
            products live
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span>
            <span className="font-display font-semibold text-white">
              {categoryCount}
            </span>{" "}
            categories
          </span>
          {currentSlideRating && (
            <>
              <span className="h-3 w-px bg-white/20" />
              <span className="flex items-center gap-1">
                <span className="font-display font-semibold text-white">
                  {currentSlideRating}
                </span>
                <FaStar className="inline text-[10px] text-accent" />
                avg. rating
              </span>
            </>
          )}
        </div>

        {/* Categories Marquee */}
        {marqueeNames.length > 0 && (
          <div className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-track flex w-max gap-2">
              {marqueeNames.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="flex-shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200 backdrop-blur-md"
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