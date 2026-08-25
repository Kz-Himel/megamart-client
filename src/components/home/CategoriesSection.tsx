"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiTag } from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();
  const featured = categories?.filter((c) => c.status === "ACTIVE").slice(0, 6) ?? [];

  return (
    <section className="py-8">
      <div className="stitch-divider mb-8" />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Shop by category</h2>
        <Link
          href="/categories"
          className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          View all <FiArrowRight />
        </Link>
      </div>

      {isLoading && <LoadingSpinner label="Loading categories..." />}

      {!isLoading && featured.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center text-muted">
          <FiTag className="text-2xl" />
          <p>No categories yet — check back soon.</p>
        </div>
      )}

      {featured.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}