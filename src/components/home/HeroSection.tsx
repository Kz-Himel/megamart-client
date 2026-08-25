"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { Button } from "@heroui/react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export function HeroSection() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();

  const activeProducts = products?.filter((p) => p.status === "ACTIVE") ?? [];
  const productCount = activeProducts.length;
  const categoryCount = categories?.filter((c) => c.status === "ACTIVE").length ?? 0;

  const allRatings = activeProducts.flatMap((p) => p.reviews?.map((r) => r.rating) ?? []);
  const avgRating = allRatings.length
    ? (allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length).toFixed(1)
    : null;

  const chipNames = categories?.filter((c) => c.status === "ACTIVE").map((c) => c.name) ?? [];
  const marqueeNames = chipNames.length ? [...chipNames, ...chipNames] : [];

  return (
    <section className="flex flex-col items-center gap-10 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <FiShoppingBag /> Product Marketplace
        </span>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Every catalog has a thread —{" "}
          <span className="text-accent">yours starts here</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Browse categories, compare products, and check out — with real-time
          stock and reviews from real buyers.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/products">
            <Button>
              Browse products <FiArrowRight className="ml-1" />
            </Button>
          </Link>
          <Link href="/categories">
            <Button variant="ghost">Explore categories</Button>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
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
          {avgRating && (
            <>
              <span className="h-4 w-px bg-border" />
              <span>
                <span className="font-display text-lg font-semibold text-foreground">
                  {avgRating}
                </span>{" "}
                avg. rating
              </span>
            </>
          )}
        </div>
      </motion.div>

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