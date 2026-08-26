"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiBox, FiShoppingCart, FiTag, FiHeart, FiStar, FiCheckCircle } from "react-icons/fi";
import { Button } from "@heroui/react";
import { useProduct } from "@/hooks/useProducts";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
  INACTIVE: "bg-rose-50 text-rose-600 border-rose-200",
  OUT_OF_STOCK: "bg-amber-50 text-amber-600 border-amber-200",
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (isLoading) return <LoadingSpinner label="Loading product..." />;
  if (!product) return null;

  const canOrder = product.status === "ACTIVE" && product.stock > 0;
  
  // Safe extraction for product ratings
  const reviews = product.reviews ?? [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc: number, rev: any) => acc + (rev.rating || 5), 0) / reviews.length).toFixed(1)
    : "4.8";

  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div className="mx-auto max-w-6xl py-4 space-y-12">
      {/* Product Hero Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Product Image Preview */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/70 p-8 shadow-sm">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <FiBox className="text-5xl text-slate-300" />
          )}

          {/* Quick Wishlist Floating Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm border border-slate-100 text-slate-500 hover:text-rose-500 transition-colors"
            aria-label="Add to Wishlist"
          >
            <FiHeart className={`text-lg ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <FiTag className="text-xs" /> {product.category?.name ?? "Uncategorized"}
            </span>
            <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${STATUS_STYLES[product.status] || "bg-slate-100 text-slate-600"}`}>
              {product.status.replace("_", " ")}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{product.name}</h1>

          {/* Gold Star Ratings Summary */}
          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-amber-400 text-amber-400 text-sm" />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700">{averageRating}</span>
            <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
          </div>

          <p className="mt-4 leading-relaxed text-slate-600 text-sm">{product.description}</p>

          {/* Price & Stock Section */}
          <div className="mt-6 flex items-baseline gap-3 border-y border-slate-100 py-4">
            <div className="flex items-baseline gap-0.5 font-bold text-slate-900">
              <span className="text-lg">৳</span>
              <span className="text-3xl tracking-tight">{product.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <FiCheckCircle className="text-emerald-500" />
              <span>{product.stock} units available</span>
            </div>
          </div>

          {/* Action Buttons: Order Now & Add to Wishlist */}
          <div className="mt-6 flex items-center gap-3">
            {canOrder ? (
              <Link href={`/orders/new?productId=${product.id}`} className="flex-1">
                <Button
                  size="lg"
                  className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-100"
                >
                  <FiShoppingCart className="mr-1 text-lg" /> Order Now
                </Button>
              </Link>
            ) : (
              <Button isDisabled size="lg" className="flex-1 rounded-2xl">
                {product.status === "OUT_OF_STOCK" ? "Out of Stock" : "Not Available"}
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlistToggle}
              className={`rounded-2xl border-slate-200 font-medium transition-colors ${
                isWishlisted ? "border-rose-200 bg-rose-50 text-rose-600" : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <FiHeart className={`text-lg ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
              <span className="hidden sm:inline">{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="border-t border-slate-100 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Customer Reviews</h2>
            <p className="text-xs text-slate-500">Read what others think about this product</p>
          </div>

          {/* Gold Star Badge Header */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-amber-50 px-3.5 py-1.5 border border-amber-200/60">
            <FiStar className="fill-amber-400 text-amber-400 text-base" />
            <span className="text-sm font-bold text-amber-900">{averageRating} out of 5</span>
          </div>
        </div>

        {isAuthenticated && (
          <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Write a Review</h3>
            <ReviewForm productId={product.id} />
          </div>
        )}

        {/* Reviews List Component Container */}
        <div className="gold-ratings-theme">
          <ReviewList productId={product.id} reviews={reviews} />
        </div>
      </div>
    </div>
  );
}