"use client";

import { useState } from "react";
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
  FiRotateCcw,
  FiPlus,
  FiMinus,
  FiHeart,
  FiClock,
} from "react-icons/fi";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/lib/auth/useAuth";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProductCard } from "@/components/products/ProductCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { data: allProducts } = useProducts();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>("standard");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
          className="inline-flex items-center gap-1.5 rounded-full bg-[#008ECC] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          <FiArrowLeft /> Back to products
        </Link>
      </div>
    );
  }

  const canOrder = product.status === "ACTIVE" && product.stock > 0;
  const isWishlisted = isInWishlist(product.id);

  // Real rating computed from product reviews
  const reviews = product.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / reviews.length
      : null;

  // Related products from same category
  const related = (allProducts ?? [])
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.status === "ACTIVE")
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!canOrder) return;
    addItem(product, quantity);
  };

  // Gallery angles/thumbnails
  const galleryImages = [
    product.image || "",
    // Fallback secondary views for visual demonstration
    product.image || "",
  ].filter(Boolean);

  const skuCode = `MM-${product.id.substring(0, 8).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-6xl py-4 space-y-8">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `/categories/${product.category.id}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 items-start">
        {/* Left Column: Image Gallery Preview */}
        <div className="flex flex-col gap-4">
          <div className="relative flex h-80 sm:h-96 w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm group">
            {galleryImages[activeImageIndex] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={galleryImages[activeImageIndex]}
                alt={product.name}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-108"
              />
            ) : (
              <FiBox className="text-5xl text-slate-300" />
            )}

            {/* Wishlist Heart Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95 text-slate-400 hover:text-rose-500"
            >
              <FiHeart
                className={`text-lg ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
              />
            </button>
          </div>

          {/* Thumbnail Gallery Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border p-1 transition-all ${
                    activeImageIndex === idx
                      ? "border-[#008ECC] ring-2 ring-[#008ECC]/20 bg-white"
                      : "border-slate-200 bg-slate-50 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View angle ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
            <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <FiTruck className="text-[#008ECC] text-base" />
              <span className="font-semibold">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <FiShield className="text-[#008ECC] text-base" />
              <span className="font-semibold">100% Genuine</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <FiRotateCcw className="text-[#008ECC] text-base" />
              <span className="font-semibold">Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Details & Purchase Actions */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2">
            <Link
              href={product.category ? `/categories/${product.category.id}` : "/products"}
              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#008ECC] border border-sky-100 hover:bg-sky-100 transition-colors"
            >
              <FiTag className="text-xs" /> {product.category?.name ?? "General"}
            </Link>
            <StatusBadge status={product.status} />
          </div>

          <h1 className="text-2xl font-black text-slate-800 sm:text-3xl leading-tight">
            {product.name}
          </h1>

          {/* Rating Summary */}
          <div className="flex items-center gap-2">
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
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({reviews.length} customer {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-400">No customer reviews yet</span>
            )}
          </div>

          <p className="leading-relaxed text-slate-600 text-xs sm:text-sm">
            {product.description}
          </p>

          {/* Price & Stock Section */}
          <div className="flex items-baseline justify-between border-y border-slate-200 py-4">
            <PriceDisplay price={product.price} size="lg" />
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <FiCheckCircle className={product.stock > 0 ? "text-emerald-500" : "text-rose-500"} />
              <span className={product.stock > 0 ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                {product.stock > 0 ? `${product.stock} units in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Stock Urgency Banner */}
          {canOrder && product.stock <= 5 && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 border border-amber-200">
              <FiClock className="text-amber-600 text-sm shrink-0" />
              <span>Hurry! Only {product.stock} left in stock - order soon.</span>
            </div>
          )}

          {/* Packaging / Option Selector */}
          {canOrder && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Packaging Option
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOption("standard")}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border ${
                    selectedOption === "standard"
                      ? "border-[#008ECC] bg-sky-50 text-[#008ECC] ring-1 ring-[#008ECC]"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Standard Retail Box
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOption("gift")}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border ${
                    selectedOption === "gift"
                      ? "border-[#008ECC] bg-sky-50 text-[#008ECC] ring-1 ring-[#008ECC]"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Eco Gift Box (+$0.00)
                </button>
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          {canOrder && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quantity
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-200/60 rounded-l-xl transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="text-xs" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-800 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-200/60 rounded-r-xl transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  size="lg"
                  className="flex-1 justify-center rounded-2xl bg-[#008ECC] hover:bg-[#0073A8] text-white font-bold shadow-md"
                >
                  <FiShoppingCart className="mr-2 text-base" /> Add to Cart
                </Button>

                <Link
                  href={`/orders/new?productId=${product.id}&quantity=${quantity}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center rounded-2xl border-[#008ECC] text-[#008ECC] hover:bg-sky-50 font-bold"
                  >
                    Buy Now
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!canOrder && (
            <div className="pt-2">
              <Button disabled size="lg" className="w-full rounded-2xl sm:w-auto sm:px-10">
                {product.status === "OUT_OF_STOCK" ? "Out of Stock" : "Not Available"}
              </Button>
            </div>
          )}

          {/* Specifications Table */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              Product Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400">SKU Ref:</span>{" "}
                <span className="font-mono font-semibold text-slate-800">{skuCode}</span>
              </div>
              <div>
                <span className="text-slate-400">Category:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {product.category?.name ?? "General"}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Availability:</span>{" "}
                <span className="font-semibold text-emerald-600">In Stock Ready to Ship</span>
              </div>
              <div>
                <span className="text-slate-400">Warranty:</span>{" "}
                <span className="font-semibold text-slate-800">1 Year Official Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t border-slate-200 pt-8">
          <div className="mb-6">
            <h2 className="relative inline-block text-base sm:text-lg font-bold text-slate-800">
              Related <span className="text-[#008ECC]">Products</span>
              <span className="absolute -bottom-[13px] left-0 h-[3px] w-full bg-[#008ECC] rounded-full" />
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews & Feedback Section */}
      <div className="border-t border-slate-200 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="relative inline-block text-base sm:text-lg font-bold text-slate-800">
              Customer <span className="text-[#008ECC]">Reviews</span>
              <span className="absolute -bottom-[13px] left-0 h-[3px] w-full bg-[#008ECC] rounded-full" />
            </h2>
            <p className="mt-1 text-xs text-slate-500">Read verified buyer feedback for this product</p>
          </div>

          {averageRating !== null && (
            <div className="flex items-center gap-1.5 rounded-2xl bg-amber-50 px-3.5 py-1.5 border border-amber-200">
              <FiStar className="fill-amber-400 text-amber-400 text-base" />
              <span className="text-xs sm:text-sm font-bold text-amber-700">
                {averageRating.toFixed(1)} out of 5
              </span>
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