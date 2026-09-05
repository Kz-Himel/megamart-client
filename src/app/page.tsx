"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { TopBrands } from "@/components/home/TopBrands";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaSection } from "@/components/home/CtaSection";
import { PopularPicks } from "@/components/home/PopularPicks";

export default function HomePage() {
  return (
    // RootLayout already renders the page inside a <main> landmark, so this
    // is a plain wrapper — keeps the homepage's own width/spacing without
    // creating a second (invalid) nested <main>.
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6">
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <TopBrands />
      <PopularPicks />
      {/* Not in the reference design — kept since they're existing, real
          functionality (reviews, CTA), just placed after the matched
          sections rather than removed. */}
      <Testimonials />
      {/* <ReviewsSection /> */}
      <CtaSection />
    </div>
  );
}