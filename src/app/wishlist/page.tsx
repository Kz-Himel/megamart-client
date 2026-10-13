"use client";

import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { useCart } from "@/lib/cart/CartContext";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { items, totalWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveAllToCart = () => {
    items.forEach((product) => {
      if (product.status === "ACTIVE" && product.stock > 0) {
        addItem(product, 1);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <EmptyState
          icon={<FiHeart className="text-4xl text-slate-300" />}
          title="Your Wishlist is Empty"
          description="You haven't saved any products to your wishlist yet. Click the heart icon on any product to save it for later!"
          action={
            <Link href="/products">
              <Button variant="primary" size="md" className="rounded-xl bg-[#008ECC] text-white font-bold">
                Discover Products
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="relative inline-block text-xl font-extrabold text-slate-800 sm:text-2xl">
            My <span className="text-[#008ECC]">Wishlist</span>
            <span className="absolute -bottom-[17px] left-0 h-[3px] w-full bg-[#008ECC] rounded-full" />
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {totalWishlist} {totalWishlist === 1 ? "saved item" : "saved items"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleMoveAllToCart}
            className="rounded-xl border-slate-200 text-xs font-semibold"
          >
            <FiShoppingCart className="mr-1 text-xs" /> Move All to Cart
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={clearWishlist}
            className="rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <FiTrash2 className="mr-1 text-xs" /> Clear
          </Button>
        </div>
      </div>

      {/* Wishlist Products Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={true}
          />
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008ECC] hover:underline"
        >
          <FiArrowLeft /> Continue Browsing
        </Link>
      </div>
    </div>
  );
}
