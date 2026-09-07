"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { TopBrands } from "@/components/home/TopBrands";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaSection } from "@/components/home/CtaSection";
import { PopularPicks } from "@/components/home/PopularPicks";
import { ValueProposition } from "@/components/home/ValueProposition";
import { PromoBanners } from "@/components/home/PromoBanners";

export default function HomePage() {
  return (
    // RootLayout already renders the page inside a <main> landmark, so this
    // is a plain wrapper — keeps the homepage's own width/spacing without
    // creating a second (invalid) nested <main>.
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 sm:px-6">
      <HeroSection />
      
      {/* 1. Value Proposition (Trust Badges under Banner) */}
      <ValueProposition />

      {/* Categories */}
      <CategoriesSection />

      {/* Main Deals / Featured Products */}
      <FeaturedProducts />

      {/* 2. Promo Banners (High-converting offer banners) */}
      <PromoBanners />

      {/* Top Brands & Popular Picks */}
      <TopBrands />
      <PopularPicks />

      {/* Reviews & Call To Action */}
      <Testimonials />
      <CtaSection />
    </div>
  );
}