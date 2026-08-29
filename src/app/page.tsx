"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaSection } from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    // RootLayout already renders the page inside a <main> landmark, so this
    // is a plain wrapper — keeps the homepage's own width/spacing without
    // creating a second (invalid) nested <main>.
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <Testimonials />
      {/* <ReviewsSection /> */}
      <CtaSection />
    </div>
  );
}