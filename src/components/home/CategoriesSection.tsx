"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiHeadphones,
  FiHome,
  FiBook,
  FiWatch,
  FiCoffee,
  FiTag,
} from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ICON_RULES: Array<[RegExp, typeof FiTag]> = [
  [/electronic|gadget|tech|audio|headphone/i, FiHeadphones],
  [/home|living|furniture|decor/i, FiHome],
  [/book|stationery/i, FiBook],
  [/watch|fashion|cloth|apparel|wear/i, FiWatch],
  [/food|grocery|kitchen|coffee/i, FiCoffee],
];

function guessIcon(name: string) {
  const match = ICON_RULES.find(([pattern]) => pattern.test(name));
  return match ? match[1] : FiTag;
}

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();
  const { data: products } = useProducts();

  const featured = categories?.filter((c) => c.status === "ACTIVE").slice(0, 4) ?? [];

  const countFor = (categoryId: string) =>
    products?.filter((p) => p.categoryId === categoryId && p.status !== "INACTIVE").length ?? 0;

  return (
    <section className="py-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Popular Categories</h2>
        <Link
          href="/categories"
          className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          View all <FiArrowRight />
        </Link>
      </div>

      {isLoading && <LoadingSpinner label="Loading categories..." />}

      {!isLoading && featured.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted">
          No categories yet — check back soon.
        </div>
      )}

      {featured.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {featured.map((category, index) => {
            const Icon = guessIcon(category.name);
            const count = countFor(category.id);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <Link
                  href={`/products?categoryId=${category.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-lg text-accent">
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{category.name}</span>
                    <span className="block text-xs text-muted">
                      {count} {count === 1 ? "product" : "products"}
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}