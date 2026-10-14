"use client";

import Link from "next/link";
import Image from "next/image";
import { FiStar, FiShoppingBag, FiTrash2, FiExternalLink } from "react-icons/fi";
import { useReviews, useDeleteReview } from "@/hooks/useReviews";
import { useAuth } from "@/lib/auth/useAuth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils/formatters";

export default function CustomerReviewsPage() {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useReviews();
  const deleteReview = useDeleteReview();
  const { toast } = useToast();

  const myReviews = (reviews ?? []).filter((r) => r.userId === user?.id);

  const handleDelete = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
      toast({
        title: "Review Removed",
        description: "Your product review has been deleted.",
        variant: "info",
      });
    } catch {
      toast({
        title: "Delete Failed",
        description: "Could not remove review.",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        badge="Community Feedback"
        title="My Reviews & Ratings"
        subtitle="Manage product reviews and ratings you have shared with the MegaMart community."
        breadcrumbs={[{ label: "Account", href: "/account" }, { label: "Reviews" }]}
      />

      {isLoading && <LoadingSpinner label="Loading your reviews..." />}

      {!isLoading && myReviews.length === 0 && (
        <EmptyState
          icon={<FiStar className="text-4xl text-slate-300" />}
          title="No Reviews Yet"
          description="You haven't submitted any product reviews. Review your purchased items to help other shoppers!"
          action={
            <Link href="/orders">
              <Button
                variant="primary"
                size="md"
                className="rounded-xl font-bold bg-[#008ECC] text-white"
              >
                <FiShoppingBag className="mr-1.5" /> View Past Orders
              </Button>
            </Link>
          }
        />
      )}

      {!isLoading && myReviews.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {myReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {review.product?.image ? (
                      <Image
                        src={review.product.image}
                        alt={review.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-xs">
                        Item
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/products/${review.productId}`}
                      className="text-sm font-bold text-slate-900 hover:text-[#008ECC] transition-colors flex items-center gap-1.5"
                    >
                      <span>{review.product?.name ?? "Purchased Product"}</span>
                      <FiExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                    <p className="text-[11px] text-slate-400">
                      Reviewed on {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-700 ml-1">{review.rating}.0</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Review"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
