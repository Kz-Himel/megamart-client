import Link from "next/link";
import { FiImage, FiStar } from "react-icons/fi";
import { Product } from "../../types/products.types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ProductCard({ product }: { product: Product }) {
  // Safe extraction for rating or fallback
  const rating = (product as any)?.rating ?? 4.8;
  const reviewCount = (product as any)?.reviewsCount ?? 32;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-slate-200 hover:shadow-md">
      {/* Product Image Box */}
      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100/70 p-4">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FiImage className="text-3xl text-slate-300" />
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
        <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        {/* Category Name */}
        <p className="mt-0.5 text-xs text-slate-400 font-medium">
          {product.category?.name || "General"}
        </p>

        {/* Rating and Stock */}
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <FiStar className="fill-amber-400 text-amber-400 text-xs" />
            <span>{rating}</span>
            <span className="text-[11px] font-normal text-slate-400">({reviewCount})</span>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* Price Tag */}
        <div className="mt-3 flex items-baseline gap-0.5 font-bold text-slate-900">
          <span className="text-sm">৳</span>
          <span className="text-base">{product.price.toLocaleString()}</span>
        </div>

        {/* Action Button */}
        <div className="mt-3 pt-1">
          <Link
            href={`/products/${product.id}`}
            className="flex w-full items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50/40 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}