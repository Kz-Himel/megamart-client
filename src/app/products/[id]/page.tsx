"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  FiBox, 
  FiShoppingCart, 
  FiTag, 
  FiStar, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiArrowLeft,
  FiTruck,
  FiShield,
  FiRotateCcw
} from "react-icons/fi";
import { Button } from "@heroui/react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProductCard } from "@/components/products/ProductCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { data: allProducts } = useProducts();
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading product details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 py-20 text-center">
        <FiAlertCircle className="text-3xl text-rose-400" />
        <div>
          <p className="text-sm font-semibold text-rose-700">Couldn&apos;t load this product</p>
          <p className="mt-1 text-xs text-rose-500">Something went wrong reaching the server.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
        <FiBox className="text-3xl text-slate-300" />
        <div>
          <p className="text-sm font-semibold text-slate-700">Product not found</p>
          <p className="mt-1 text-xs text-slate-500">It may have been removed or is no longer available.</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:bg-sky-700"
        >
          <FiArrowLeft /> Back to products
        </Link>
      </div>
    );
  }

  const canOrder = product.status === "ACTIVE" && product.stock > 0;

  // Real rating computed from product reviews
  const reviews = product.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / reviews.length
      : null;

  // Related products: same category
  const related = (allProducts ?? [])
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.status === "ACTIVE")
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl py-4 space-y-10">
      {/* Product Hero Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 items-start">
        {/* Product Image Preview - Reduced Height */}
        <div className="flex flex-col gap-4">
          <div className="relative flex h-80 sm:h-96 w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
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
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
            <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <FiTruck className="text-sky-600 text-base" />
              <span className="font-semibold">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <FiShield className="text-sky-600 text-base" />
              <span className="font-semibold">100% Genuine</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <FiRotateCcw className="text-sky-600 text-base" />
              <span className="font-semibold">Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-100">
              <FiTag className="text-xs" /> {product.category?.name ?? "Uncategorized"}
            </span>
            <StatusBadge status={product.status} />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">{product.name}</h1>

          {/* Rating Summary */}
          <div className="mt-2.5 flex items-center gap-2">
            {averageRating !== null ? (
              <>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={
                        i < Math.round(averageRating)
                          ? "fill-amber-400 text-amber-400 text-sm"
                          : "text-slate-200 text-sm"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{averageRating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-400">No reviews yet</span>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-slate-600 text-xs sm:text-sm">{product.description}</p>

          {/* Price & Stock Section */}
          <div className="mt-6 flex items-baseline gap-4 border-y border-slate-200 py-4">
            <div className="flex items-baseline gap-0.5 font-extrabold text-slate-900">
              <span className="text-lg">$</span>
              <span className="text-3xl tracking-tight">{product.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <FiCheckCircle className={product.stock > 0 ? "text-emerald-500" : "text-rose-500"} />
              <span className={product.stock > 0 ? "text-emerald-600 font-semibold" : "text-rose-500 font-semibold"}>
                {product.stock > 0 ? `${product.stock} units in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            {canOrder ? (
              <Link href={`/orders/new?productId=${product.id}`}>
                <Button
                  size="lg"
                  className="w-full rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md transition-all sm:w-auto sm:px-10"
                >
                  <FiShoppingCart className="mr-1 text-lg" /> Order Now
                </Button>
              </Link>
            ) : (
              <Button isDisabled size="lg" className="w-full rounded-2xl sm:w-auto sm:px-10">
                {product.status === "OUT_OF_STOCK" ? "Out of Stock" : "Not Available"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t border-slate-200 pt-8">
          <div className="mb-6">
            <h2 className="relative inline-block text-base sm:text-lg font-bold text-slate-800">
              You might <span className="text-sky-600">also like</span>
              <span className="absolute -bottom-[13px] left-0 h-[3px] w-full bg-sky-500 rounded-full" />
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews & Ratings Section */}
      <div className="border-t border-slate-200 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="relative inline-block text-base sm:text-lg font-bold text-slate-800">
              Customer <span className="text-sky-600">Reviews</span>
              <span className="absolute -bottom-[13px] left-0 h-[3px] w-full bg-sky-500 rounded-full" />
            </h2>
            <p className="mt-1 text-xs text-slate-500">Read what others think about this product</p>
          </div>

          {averageRating !== null && (
            <div className="flex items-center gap-1.5 rounded-2xl bg-amber-50 px-3.5 py-1.5 border border-amber-200">
              <FiStar className="fill-amber-400 text-amber-400 text-base" />
              <span className="text-xs sm:text-sm font-bold text-amber-700">{averageRating.toFixed(1)} out of 5</span>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xs sm:text-sm font-bold text-slate-800">Write a Review</h3>
            <ReviewForm productId={product.id} />
          </div>
        )}

        <ReviewList productId={product.id} reviews={reviews} />
      </div>
    </div>
  );
}