"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiCopy,
  FiCheck,
  FiTruck,
  FiMapPin,
  FiDollarSign,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";
import { CheckoutResult } from "@/types/order.types";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";

interface OrderConfirmationProps {
  result: CheckoutResult;
}

export function OrderConfirmation({ result }: OrderConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(result.orderReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      {/* Success Hero Card */}
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/70 to-white p-6 sm:p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
          <FiCheckCircle className="text-3xl sm:text-4xl" />
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-800">
          Thank you! Order Placed
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          We&apos;ve received your order. Our warehouse team is already preparing
          your items for dispatch.
        </p>

        {/* Order Reference Box */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Order Reference:</span>
          <span className="font-mono text-sm font-extrabold text-[#008ECC]">
            {result.orderReference}
          </span>
          <button
            type="button"
            onClick={handleCopyRef}
            className="ml-2 flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            title="Copy order reference"
          >
            {copied ? (
              <>
                <FiCheck className="text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <FiCopy /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Shipping Destination */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
            <FiMapPin className="text-[#008ECC]" />
            <h3>Delivery Details</h3>
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            <p className="font-bold text-slate-800 text-sm">{result.shippingAddress.fullName}</p>
            <p className="font-medium text-slate-700">{result.shippingAddress.phone}</p>
            <p>{result.shippingAddress.streetAddress}</p>
            <p>
              {result.shippingAddress.city}, {result.shippingAddress.postalCode}
            </p>
            <p>{result.shippingAddress.country}</p>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600">
            <FiTruck className="text-[#008ECC] shrink-0" />
            <span>
              Method:{" "}
              <strong className="text-slate-800 capitalize">
                {result.shippingMethod} Shipping
              </strong>
            </span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
            <FiDollarSign className="text-emerald-600" />
            <h3>Payment Method</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Method</span>
              <span className="rounded-lg bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                {result.paymentMethod === "COD" ? "Cash on Delivery" : "Online Card"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Payment Status</span>
              <span className="rounded-lg bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                Pending on Delivery
              </span>
            </div>
            <p className="pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
              Please keep the exact cash amount ready for the delivery rider upon
              physical parcel handover.
            </p>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4">
          Ordered Products ({result.orders.length} {result.orders.length === 1 ? "item" : "items"})
        </h3>

        <div className="divide-y divide-slate-100">
          {result.orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                  {order.product?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <FiShoppingBag className="text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800 line-clamp-1">
                    {order.product?.name ?? "MegaMart Product"}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Qty: {order.quantity} × {formatCurrency(order.product?.price ?? 0)}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-[11px] font-bold text-[#008ECC] hover:underline"
                    >
                      View Order Details →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-slate-900 font-mono">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className="mt-4 border-t border-slate-200 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono font-semibold text-slate-800">
              {formatCurrency(result.summary.subtotal)}
            </span>
          </div>

          {result.summary.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Promo Discount</span>
              <span className="font-mono">-{formatCurrency(result.summary.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-mono font-semibold text-slate-800">
              {result.summary.shippingFee === 0 ? "FREE" : formatCurrency(result.summary.shippingFee)}
            </span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Tax (5%)</span>
            <span className="font-mono font-semibold text-slate-800">
              {formatCurrency(result.summary.tax)}
            </span>
          </div>

          <div className="flex justify-between items-baseline border-t border-slate-100 pt-3 text-sm font-extrabold text-slate-900">
            <span>Grand Total</span>
            <span className="text-lg font-black text-[#008ECC] font-mono">
              {formatCurrency(result.summary.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-center pt-2">
        <Link href="/products" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full justify-center rounded-xl font-bold">
            Continue Shopping
          </Button>
        </Link>

        <Link href="/orders" className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center rounded-xl bg-[#008ECC] text-white font-bold shadow-md"
          >
            <span>View All Orders</span>
            <FiArrowRight className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
