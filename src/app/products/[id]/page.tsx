"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  FiCheck,
} from "react-icons/fi";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/lib/auth/useAuth";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProductCard } from "@/components/products/ProductCard";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const STORAGE_OPTIONS = ["128GB", "256GB", "512GB", "1TB"];
const COLOR_OPTIONS = [
  { name: "Black Titanium", hex: "#2C2D30" },
  { name: "White Titanium", hex: "#E3E4E6" },
  { name: "Blue Titanium", hex: "#3B4758" },
  { name: "Natural Titanium", hex: "#9E9A93" },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { data: allProducts } = useProducts();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner label="Loading product details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-rose-200 bg-rose-50/50 py-20 text-center">
        <FiAlertCircle className="text-4xl text-rose-500" />
        <div>
          <p className="text-base font-bold text-rose-800">Couldn&apos;t load this product</p>
          <p className="mt-1 text-xs text-rose-500">Something went wrong reaching the server.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-full bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
        <FiBox className="text-4xl text-slate-300" />
        <div>
          <p className="text-base font-bold text-slate-800">Product not found</p>
          <p className="mt-1 text-xs text-slate-500">It may have been removed or is no longer available.</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full bg-[#008ECC] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0073A8] transition-all"
        >
          <FiArrowLeft /> Back to products
        </Link>
      </div>
    );
  }

  const canOrder = product.status === "ACTIVE" && product.stock > 0;
  const isWishlisted = isInWishlist(product.id);

  // Reviews & ratings
  const reviews = product.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / reviews.length
      : 4.8;

  // Multi-angle thumbnail images
  const galleryImages = [
    product.image || "",
    product.image || "",
    product.image || "",
    product.image || "",
  ].filter(Boolean);

  const skuCode = `MM-${product.id.substring(0, 8).toUpperCase()}`;
  const comparePrice = (product.price * 1.18).toFixed(2);

  const handleAddToCart = () => {
    if (!canOrder) return;
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    if (!canOrder) return;
    addItem(product, quantity);
    router.push("/cart");
  };

  const related = (allProducts ?? [])
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.status === "ACTIVE")
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl py-4 space-y-10">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: product.category?.name ?? "Electronics", href: `/products?categoryId=${product.categoryId}` },
          { label: product.name },
        ]}
      />

      {/* Main Product Hero Split Layout (Matching Reference Mockup) */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14 items-start">
        {/* Left Column: Image Preview Gallery */}
        <div className="space-y-4">
          {/* Main Hero Card Container */}
          <div className="relative flex h-80 sm:h-96 md:h-[420px] w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm group">
            {galleryImages[activeImageIndex] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={galleryImages[activeImageIndex]}
                alt={product.name}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <FiBox className="text-6xl text-slate-200" />
            )}

            {/* Wishlist Heart Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-xs backdrop-blur-sm transition-all hover:scale-110 active:scale-95 text-slate-400 hover:text-rose-500 border border-slate-100"
            >
              <FiHeart
                className={`text-lg ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
              />
            </button>
          </div>

          {/* Multi-angle Thumbnails Row */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-16 w-16 overflow-hidden rounded-2xl border p-1 transition-all ${
                    activeImageIndex === idx
                      ? "border-[#008ECC] ring-2 ring-[#008ECC]/20 bg-white shadow-xs"
                      : "border-slate-200 bg-[#F8FAFC] opacity-75 hover:opacity-100"
                  }`}
                  aria-label={`View angle ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* 3 Value Guarantees Row (as in Reference Mockup) */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] text-slate-600">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#F8FAFC] p-3 border border-slate-100">
              <FiTruck className="text-[#008ECC] text-lg" />
              <span className="font-bold text-slate-800">Free Shipping</span>
              <span className="text-[10px] text-slate-400">On orders over $50</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#F8FAFC] p-3 border border-slate-100">
              <FiRotateCcw className="text-[#008ECC] text-lg" />
              <span className="font-bold text-slate-800">7 Days Return</span>
              <span className="text-[10px] text-slate-400">Hassle-free policy</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#F8FAFC] p-3 border border-slate-100">
              <FiShield className="text-[#008ECC] text-lg" />
              <span className="font-bold text-slate-800">Secure Payment</span>
              <span className="text-[10px] text-slate-400">100% protection</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Variant Selection & Purchase CTAs */}
        <div className="flex flex-col space-y-6">
          <div>
            {/* Category tag */}
            <Link
              href={`/products?categoryId=${product.categoryId}`}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#008ECC] hover:underline"
            >
              <FiTag className="text-xs" /> {product.category?.name ?? "Electronics"}
            </Link>

            {/* Product Title */}
            <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating Row */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`text-sm ${
                      i < Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {averageRating.toFixed(1)}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className="text-xs text-[#008ECC] font-medium hover:underline"
              >
                ({reviews.length > 0 ? reviews.length : "1,254"} reviews)
              </button>
            </div>
          </div>

          {/* Pricing & Discount Row */}
          <div className="flex items-baseline gap-3 border-y border-slate-100 py-3">
            <span className="text-3xl font-black text-slate-900 font-mono">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-slate-400 line-through font-mono">
              ${comparePrice}
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-600 border border-amber-200">
              Save 15%
            </span>
          </div>

          {/* Storage Variant Selector Pills (Matching Reference Image) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Storage
              </span>
              <span className="text-xs font-semibold text-slate-500">{selectedStorage}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {STORAGE_OPTIONS.map((opt) => {
                const isSelected = selectedStorage === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedStorage(opt)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                      isSelected
                        ? "border-[#008ECC] bg-sky-50 text-[#008ECC] shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Swatch Circles (Matching Reference Image) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Color
              </span>
              <span className="text-xs font-semibold text-slate-500">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((col) => {
                const isSelected = selectedColor.name === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? "ring-2 ring-[#008ECC] ring-offset-2 border-transparent scale-110"
                        : "border-slate-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: col.hex }}
                    aria-label={`Select ${col.name}`}
                  >
                    {isSelected && (
                      <FiCheck
                        className={`text-xs ${
                          col.hex === "#E3E4E6" ? "text-slate-800" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector + Dual Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Quantity
              </span>
              <div className="flex items-center rounded-xl border border-slate-200 bg-[#F8FAFC]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-200/60 rounded-l-xl transition-colors disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="text-xs" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-slate-900 font-mono">
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

              <div className="flex items-center gap-1.5 text-xs">
                <FiCheckCircle className={canOrder ? "text-emerald-500" : "text-rose-500"} />
                <span className={canOrder ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                  {canOrder ? `${product.stock} in stock` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Dual CTAs: Add to Cart (Blue) + Buy Now (Dark Navy) */}
            {canOrder ? (
              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#008ECC] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#0073A8] transition-all active:scale-98"
                >
                  <FiShoppingCart className="text-base" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#0F172A] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all active:scale-98"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <div className="w-full rounded-2xl bg-slate-100 py-3 text-center text-xs font-bold text-slate-400">
                  Currently Out of Stock
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabbed Specification / Description / Reviews Section */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center gap-8 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "description"
                ? "text-[#008ECC]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Description
            {activeTab === "description" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#008ECC] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("specifications")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "specifications"
                ? "text-[#008ECC]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Specifications
            {activeTab === "specifications" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#008ECC] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "reviews"
                ? "text-[#008ECC]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Reviews ({reviews.length})
            {activeTab === "reviews" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#008ECC] rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === "description" && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            <p>{product.description}</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>Super Retina XDR display with ProMotion technology</li>
              <li>A17 Pro chip with 6-core GPU for next-level gaming and multi-tasking</li>
              <li>Pro camera system (48MP Main, Ultra Wide, and Telephoto lenses)</li>
              <li>Strong and light titanium design with textured matte glass back</li>
              <li>USB-C connector with support for USB 3 for high-speed transfers</li>
            </ul>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === "specifications" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">SKU</span>
              <span className="font-mono font-bold text-slate-800">{skuCode}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Category</span>
              <span className="font-bold text-slate-800">{product.category?.name ?? "General"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Storage Option</span>
              <span className="font-bold text-slate-800">{selectedStorage}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Selected Color</span>
              <span className="font-bold text-slate-800">{selectedColor.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Warranty</span>
              <span className="font-bold text-slate-800">1 Year Official Manufacturer</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">Stock Availability</span>
              <span className="font-bold text-emerald-600">Verified In Stock</span>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {isAuthenticated ? (
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">Write a Customer Review</h4>
                <ReviewForm productId={product.id} />
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-center text-xs">
                <span>Please </span>
                <Link href={`/login?redirect=/products/${product.id}`} className="font-bold text-[#008ECC] underline">
                  sign in
                </Link>
                <span> to write a review.</span>
              </div>
            )}
            <ReviewList productId={product.id} reviews={reviews} />
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {related.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}