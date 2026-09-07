import Link from "next/link";
import { FiImage, FiStar, FiArrowRight } from "react-icons/fi";
import { Product } from "../../types/products.types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ProductCard({ product }: { product: Product }) {
  // Real rating computed from this product's actual reviews
  const reviews = product.reviews ?? [];
  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
      : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-sky-200 hover:shadow-md"
    >
      {/* Product Image Box — ager motoi full object-cover ekhane rakha hoyeche */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100/70">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FiImage className="text-3xl text-slate-300" />
          </div>
        )}

        {/* Status Badge overlay */}
        {product.status && (
          <div className="absolute left-2.5 top-2.5">
            <StatusBadge status={product.status} />
          </div>
        )}
      </div>

      {/* Product Information Section */}
      <div className="flex flex-1 flex-col pt-3">
        {/* Product Name */}
        <h3 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-sky-600">
          {product.name}
        </h3>

        {/* Category Name */}
        <p className="mt-0.5 text-xs font-medium text-slate-400">
          {product.category?.name || "General"}
        </p>

        {/* Rating and Stock */}
        <div className="mt-1.5 flex items-center justify-between text-xs">
          {rating !== null ? (
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <FiStar className="fill-amber-400 text-xs text-amber-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-[11px] font-normal text-slate-400">({reviewCount})</span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-slate-400">No reviews yet</span>
          )}

          <span className="text-[11px] font-medium text-slate-400">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* Price Tag */}
        <div className="mt-3 flex items-baseline gap-0.5 font-bold text-slate-900">
          <span className="text-sm">$</span>
          <span className="text-base">{product.price.toFixed(2)}</span>
        </div>

        {/* View details indicator */}
        <div className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50/50 py-2 text-xs font-semibold text-sky-600 transition-colors group-hover:bg-sky-500 group-hover:text-white">
          View Details
          <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}