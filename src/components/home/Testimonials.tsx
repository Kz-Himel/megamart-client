"use client";

import { motion } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";
import { useReviews } from "@/hooks/useReviews";
import { StarRating } from "../ui/StarRating";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function Testimonials() {
  const { data: reviews, isLoading } = useReviews();

  const featured = (reviews ?? [])
    .filter((r) => r.status === "PUBLISHED" && r.rating >= 4 && r.comment)
    .slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-8">
        <LoadingSpinner label="Loading reviews..." />
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="py-8">
      <div className="stitch-divider mb-8" />

      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold">What buyers are saying</h2>
        <p className="mt-1 text-sm text-muted">Pulled straight from verified product reviews.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {featured.map((review, index) => (
          <motion.figure
            key={review.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="stitch-edge flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
          >
            <FiMessageSquare className="text-lg text-accent/60" />
            <StarRating rating={review.rating} />
            <blockquote className="line-clamp-4 flex-1 text-sm text-foreground/90">
              &ldquo;{review.comment}&rdquo;
            </blockquote>
            <figcaption className="pt-8 text-xs text-muted">
              <span className="font-medium text-foreground">
                {review.user?.name ?? "Verified buyer"}
              </span>
              {review.product?.name && <> &middot; {review.product.name}</>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}