"use client";

import { motion } from "framer-motion";
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
      <section className="w-full py-4">
        <LoadingSpinner label="Loading reviews..." />
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="w-full py-6">
      {/* MegaMart Standard Header */}
      <div className="mb-6 border-b border-slate-200 pb-3">
        <h2 className="relative inline-block text-base sm:text-lg font-bold text-slate-800">
          What our <span className="text-sky-600">customers say</span>
          {/* Active bottom line matching MegaMart UI */}
          <span className="absolute -bottom-[13px] left-0 h-[3px] w-full bg-sky-500 rounded-full" />
        </h2>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {featured.map((review, index) => {
          const userName = review.user?.name ?? "Verified Buyer";
          const firstInitial = userName.charAt(0).toUpperCase();

          return (
            <motion.figure
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-sky-300 hover:shadow-md"
            >
              {/* Background Decorative Quote */}
              <FaQuoteLeft className="pointer-events-none absolute -right-2 -top-2 text-6xl text-slate-100 transition-colors duration-300 group-hover:text-sky-50" />

              <div className="relative space-y-3">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xs ${
                        i < review.rating ? "text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="line-clamp-4 text-xs font-normal leading-relaxed text-slate-600 sm:text-sm">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
              </div>

              {/* User Profile Footer */}
              <figcaption className="relative mt-5 flex items-center gap-3 border-t border-slate-100 pt-3.5">
                {/* User Avatar Circle */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700 text-xs">
                  {firstInitial}
                </div>

                <div className="overflow-hidden text-left">
                  <span className="block truncate text-xs font-semibold text-slate-800 transition-colors group-hover:text-sky-600">
                    {userName}
                  </span>
                  {review.product?.name && (
                    <span className="block truncate text-[11px] text-slate-400">
                      Purchased: {review.product.name}
                    </span>
                  )}
                </div>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </section>
  );
}