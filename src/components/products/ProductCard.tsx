"use client";

import Link from "next/link";
import { FiImage, FiStar, FiArrowRight, FiHeart } from "react-icons/fi";
import { Product } from "../../types/products.types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

export interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onQuickAdd,
  onToggleWishlist,
  isWishlisted = false,
  className,
}: ProductCardProps) {
  const reviews = product.reviews ?? [];
  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
      : null;

  const isOutOfStock = product.status === "OUT_OF_STOCK" || product.stock <= 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) onToggleWishlist(product);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) onQuickAdd(product);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3",
        "transition-all duration-300 hover:border-[#008ECC]/40 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {/* Product Image Area */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-108"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <FiImage className="text-4xl" />
          </div>
        )}

        {/* Stock / Status Badge */}
        <div className="absolute left-2.5 top-2.5 z-10">
          {isOutOfStock ? (
            <Badge variant="danger" size="xs" showDot>
              Out of stock
            </Badge>
          ) : product.stock <= 5 ? (
            <Badge variant="warning" size="xs">
              Only {product.stock} left
            </Badge>
          ) : (
            <Badge variant="success" size="xs">
              In stock
            </Badge>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all",
            "hover:scale-110 active:scale-95",
            isWishlisted
              ? "text-rose-500 hover:text-rose-600"
              : "text-slate-400 hover:text-rose-500"
          )}
        >
          <FiHeart className={cn("text-sm", isWishlisted && "fill-current")} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col pt-3">
        {/* Category Tag */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
          {product.category?.name || "General"}
        </span>

        {/* Product Title */}
        <h3 className="mt-0.5 font-bold text-sm text-slate-800 line-clamp-1 transition-colors group-hover:text-[#008ECC]">
          {product.name}
        </h3>

        {/* Rating and Reviews Counter */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          {rating !== null ? (
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <FiStar className="fill-amber-400 text-amber-400 text-xs" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-[11px] font-normal text-slate-400">({reviewCount})</span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-slate-400">No reviews yet</span>
          )}
        </div>

        {/* Price Display */}
        <div className="mt-3 flex items-center justify-between">
          <PriceDisplay price={product.price} size="md" />
        </div>

        {/* Action Button: Quick Add or View Details */}
        <div className="mt-3">
          {onQuickAdd && !isOutOfStock ? (
            <button
              type="button"
              onClick={handleQuickAddClick}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-800 transition-all hover:bg-[#008ECC] hover:text-white active:scale-98"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/60 py-2 text-xs font-semibold text-slate-600 transition-all group-hover:border-[#008ECC] group-hover:bg-[#008ECC] group-hover:text-white">
              <span>View Details</span>
              <FiArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}