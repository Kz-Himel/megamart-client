"use client";

import { motion } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";
import { FaQuoteLeft, FaStar } from "react-icons/fa6";
import { useReviews } from "@/hooks/useReviews";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function Testimonials() {
  const { data: reviews, isLoading } = useReviews();

  const featured = (reviews ?? [])
    .filter((r) => r.status === "PUBLISHED" && r.rating >= 4 && r.comment)
    .slice(0, 3);

  if (isLoading) {
    return (
      <section className="w-full">
        <LoadingSpinner label="Loading reviews..." />
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="mb-1 inline-block text-xs font-bold uppercase tracking-wider text-accent">
          Social Proof
        </span>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          What buyers are saying
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Pulled straight from verified product reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {featured.map((review, index) => (
          <motion.figure
            key={review.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-white via-slate-50/50 to-accent/5 p-6 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
          >
            {/* Background Decorative Quote Mark */}
            <FaQuoteLeft className="pointer-events-none absolute -right-2 -top-2 text-6xl text-slate-100 transition-colors duration-300 group-hover:text-accent/10" />

            <div className="relative space-y-3.5">
              {/* Header: Icon & Star Rating */}
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <FiMessageSquare className="text-base" />
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 rounded-full bg-price/10 px-2.5 py-1 backdrop-blur-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xs ${
                        i < review.rating ? "text-price" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <blockquote className="line-clamp-4 text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
                &ldquo;{review.comment}&rdquo;
              </blockquote>
            </div>

            {/* User Info & Product Name */}
            <figcaption className="relative mt-6 border-t border-slate-100 pt-3.5 text-[11px] text-slate-400">
              <span className="font-bold text-slate-800 transition-colors group-hover:text-accent">
                {review.user?.name ?? "Verified buyer"}
              </span>
              {review.product?.name && (
                <span className="block truncate text-[10px] text-slate-400">
                  {review.product.name}
                </span>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}