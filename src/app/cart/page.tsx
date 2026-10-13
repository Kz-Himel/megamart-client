"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiShoppingCart,
  FiTrash2,
  FiArrowRight,
  FiPlus,
  FiMinus,
  FiShield,
  FiTruck,
  FiTag,
  FiArrowLeft,
} from "react-icons/fi";
import { useCart } from "@/lib/cart/CartContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatters";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function CartPage() {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart } =
    useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const shippingCost = subtotal >= 50 || subtotal === 0 ? 0 : 5.0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxEstimate = (subtotal - discountAmount) * 0.05;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + taxEstimate);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "MEGAMART10" || code === "SAVE10") {
      setDiscountPercent(10);
      setPromoMessage({ text: "Promo code applied! 10% discount added.", isError: false });
    } else if (code === "MEGAMART20") {
      setDiscountPercent(20);
      setPromoMessage({ text: "Promo code applied! 20% discount added.", isError: false });
    } else {
      setPromoMessage({ text: "Invalid promo code. Try 'SAVE10'.", isError: true });
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <EmptyState
          icon={<FiShoppingCart className="text-4xl text-slate-300" />}
          title="Your Shopping Cart is Empty"
          description="You haven't added any items to your cart yet. Browse our verified catalog and find great deals today!"
          action={
            <Link href="/products">
              <Button variant="primary" size="md" className="rounded-xl bg-[#008ECC] text-white font-bold">
                Explore Products
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Target link for checkout: points to complete checkout flow with all cart items
  const checkoutHref = promoCode.trim()
    ? `/orders/new?fromCart=true&promo=${encodeURIComponent(promoCode.trim().toUpperCase())}`
    : "/orders/new?fromCart=true";

  return (
    <div className="py-2 space-y-6">
      <Breadcrumbs items={[{ label: "Shopping Cart" }]} />

      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="relative inline-block text-xl font-extrabold text-slate-800 sm:text-2xl">
            Shopping <span className="text-[#008ECC]">Cart</span>
            <span className="absolute -bottom-[17px] left-0 h-[3px] w-full bg-[#008ECC] rounded-full" />
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="self-start text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items List (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => {
            const itemTotal = product.price * quantity;
            const maxStock = product.stock > 0 ? product.stock : 99;

            return (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <FiShoppingCart className="text-2xl text-slate-300" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {product.category?.name || "General"}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-bold text-sm text-slate-800 hover:text-[#008ECC] transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">
                        {formatCurrency(product.price)} each
                      </span>
                      {product.stock <= 5 && (
                        <span className="text-[10px] font-bold text-amber-600">
                          (Only {product.stock} left)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Stepper & Price */}
                <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-200/60 rounded-l-xl transition-colors"
                    >
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= maxStock}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-200/60 rounded-r-xl transition-colors disabled:opacity-40"
                    >
                      <FiPlus className="text-xs" />
                    </button>
                  </div>

                  {/* Item Total Price */}
                  <div className="w-20 text-right">
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      {formatCurrency(itemTotal)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name} from cart`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008ECC] hover:underline"
            >
              <FiArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Column (1 col) */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-extrabold text-slate-800">Order Summary</h2>

            {/* Calculations Breakdown */}
            <div className="mt-4 space-y-3 border-b border-slate-100 pb-4 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-semibold font-mono">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (5%)</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatCurrency(taxEstimate)}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="mt-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Promo Code
              </label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative flex-1">
                  <FiTag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. SAVE10"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs uppercase outline-none focus:border-[#008ECC] focus:bg-white"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" className="rounded-xl">
                  Apply
                </Button>
              </div>
              {promoMessage && (
                <p
                  className={`mt-1.5 text-[11px] font-medium ${
                    promoMessage.isError ? "text-rose-500" : "text-emerald-600"
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </form>

            {/* Grand Total */}
            <div className="mt-6 flex items-baseline justify-between border-t border-slate-100 pt-4">
              <span className="text-base font-extrabold text-slate-900">Total</span>
              <div className="text-right">
                <span className="text-2xl font-black text-[#008ECC] font-mono">
                  {formatCurrency(grandTotal)}
                </span>
                {shippingCost === 0 && (
                  <p className="text-[10px] text-emerald-600 font-medium">
                    Eligible for Free Shipping
                  </p>
                )}
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="mt-6">
              <Link href={checkoutHref} className="block w-full">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center rounded-xl bg-[#008ECC] hover:bg-[#0073A8] text-white font-bold shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="ml-1" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <FiShield className="text-emerald-500" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-[#008ECC]" />
                <span>Fast Dispatch & Real-Time Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
