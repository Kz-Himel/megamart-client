"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiLock,
  FiTag,
  FiShoppingBag,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import { Product } from "@/types/products.types";
import {
  CheckoutPayload,
  CheckoutResult,
  ShippingAddress,
} from "@/types/order.types";
import { useCheckoutOrder } from "@/hooks/useOrders";
import { formatCurrency, getErrorMessage } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { FeedbackAlert } from "@/components/ui/FeedbackAlert";

interface CheckoutItemWithProduct {
  product: Product;
  quantity: number;
}

interface CheckoutWizardProps {
  items: CheckoutItemWithProduct[];
  initialPromoCode?: string;
  defaultFullName?: string;
  onSuccess: (result: CheckoutResult) => void;
}

export function CheckoutWizard({
  items,
  initialPromoCode = "",
  defaultFullName = "",
  onSuccess,
}: CheckoutWizardProps) {
  const checkoutMutation = useCheckoutOrder();
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
  }, []);

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: defaultFullName,
    phone: "",
    streetAddress: "",
    city: "Dhaka",
    postalCode: "",
    country: "Bangladesh",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");
  const [promoCode, setPromoCode] = useState(initialPromoCode);
  const [appliedPromo, setAppliedPromo] = useState(initialPromoCode);
  const [promoFeedback, setPromoFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculations Preview
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discountPercent = 0;
  if (
    appliedPromo.toUpperCase() === "SAVE10" ||
    appliedPromo.toUpperCase() === "MEGAMART10"
  ) {
    discountPercent = 10;
  } else if (appliedPromo.toUpperCase() === "MEGAMART20") {
    discountPercent = 20;
  }

  const discountAmount = Math.round((subtotal * (discountPercent / 100)) * 100) / 100;
  const shippingFee =
    shippingMethod === "express" ? 15.0 : subtotal >= 50 ? 0 : 5.0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const estimatedTax = Math.round(taxableAmount * 0.05 * 100) / 100;
  const grandTotal = Math.round((taxableAmount + shippingFee + estimatedTax) * 100) / 100;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setAppliedPromo("");
      setPromoFeedback(null);
      return;
    }

    if (code === "SAVE10" || code === "MEGAMART10") {
      setAppliedPromo(code);
      setPromoFeedback({
        text: "Promo code SAVE10 applied! 10% discount added.",
        isError: false,
      });
    } else if (code === "MEGAMART20") {
      setAppliedPromo(code);
      setPromoFeedback({
        text: "Promo code MEGAMART20 applied! 20% discount added.",
        isError: false,
      });
    } else {
      setAppliedPromo("");
      setPromoFeedback({
        text: "Invalid promo code. Try 'SAVE10' or 'MEGAMART20'.",
        isError: true,
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!address.fullName.trim() || address.fullName.trim().length < 2) {
      errors.fullName = "Full name is required (at least 2 characters).";
    }
    if (!address.phone.trim() || address.phone.trim().length < 7) {
      errors.phone = "Valid phone number is required (at least 7 digits).";
    }
    if (!address.streetAddress.trim() || address.streetAddress.trim().length < 5) {
      errors.streetAddress = "Street address is required (at least 5 characters).";
    }
    if (!address.city.trim() || address.city.trim().length < 2) {
      errors.city = "City is required.";
    }
    if (!address.postalCode.trim() || address.postalCode.trim().length < 3) {
      errors.postalCode = "Postal code is required (at least 3 characters).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      setSubmitError("Please fill in all required shipping address fields.");
      return;
    }

    if (paymentMethod === "CARD") {
      setSubmitError(
        "Online credit/debit card processing is currently in boundary mode. Please select Cash on Delivery (COD) to place your order."
      );
      return;
    }

    const payload: CheckoutPayload = {
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
      shippingAddress: {
        fullName: address.fullName.trim(),
        phone: address.phone.trim(),
        streetAddress: address.streetAddress.trim(),
        city: address.city.trim(),
        postalCode: address.postalCode.trim(),
        country: address.country.trim() || "Bangladesh",
      },
      shippingMethod,
      paymentMethod,
      promoCode: appliedPromo.trim() || undefined,
      idempotencyKey: idempotencyKeyRef.current ?? undefined,
    };

    try {
      const result = await checkoutMutation.mutateAsync(payload);
      onSuccess(result);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(
        err,
        "Failed to place order. Please review your details and try again."
      );
      setSubmitError(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitError && (
        <FeedbackAlert
          variant="error"
          title="Checkout Error"
          onDismiss={() => setSubmitError(null)}
        >
          {submitError}
        </FeedbackAlert>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Form Details (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Section 1: Review Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#008ECC] text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-base font-extrabold text-slate-800">
                  Review Items ({items.length})
                </h2>
              </div>
              <Link
                href="/cart"
                className="text-xs font-semibold text-[#008ECC] hover:underline"
              >
                Modify Cart
              </Link>
            </div>

            <div className="divide-y divide-slate-100 pt-2">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <FiShoppingBag className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(product.price)} × {quantity}
                      </p>
                    </div>
                  </div>

                  <div className="font-extrabold text-slate-900 font-mono">
                    {formatCurrency(product.price * quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Contact & Shipping Address */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#008ECC] text-xs font-bold text-white">
                2
              </span>
              <div className="flex items-center gap-1.5">
                <FiMapPin className="text-[#008ECC]" />
                <h2 className="text-base font-extrabold text-slate-800">
                  Contact & Shipping Address
                </h2>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:bg-white ${
                    formErrors.fullName
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#008ECC]"
                  }`}
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  placeholder="e.g. +880 1700 000000"
                  className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:bg-white ${
                    formErrors.phone
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#008ECC]"
                  }`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={address.streetAddress}
                  onChange={(e) =>
                    setAddress({ ...address, streetAddress: e.target.value })
                  }
                  placeholder="e.g. House 42, Road 11, Banani"
                  className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:bg-white ${
                    formErrors.streetAddress
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#008ECC]"
                  }`}
                />
                {formErrors.streetAddress && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formErrors.streetAddress}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  City *
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  placeholder="e.g. Dhaka"
                  className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:bg-white ${
                    formErrors.city
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#008ECC]"
                  }`}
                />
                {formErrors.city && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formErrors.city}
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                  placeholder="e.g. 1213"
                  className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:bg-white ${
                    formErrors.postalCode
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#008ECC]"
                  }`}
                />
                {formErrors.postalCode && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formErrors.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Shipping Method */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#008ECC] text-xs font-bold text-white">
                3
              </span>
              <div className="flex items-center gap-1.5">
                <FiTruck className="text-[#008ECC]" />
                <h2 className="text-base font-extrabold text-slate-800">
                  Delivery Option
                </h2>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                  shippingMethod === "standard"
                    ? "border-[#008ECC] bg-[#008ECC]/5 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                      className="h-4 w-4 text-[#008ECC] focus:ring-[#008ECC]"
                    />
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      Standard Shipping
                    </span>
                  </div>
                  <span className="font-extrabold font-mono text-xs text-slate-900">
                    {subtotal >= 50 ? "FREE" : "$5.00"}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 pl-6">
                  Delivery in 3–5 business days. Free for orders over $50.
                </p>
              </label>

              <label
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                  shippingMethod === "express"
                    ? "border-[#008ECC] bg-[#008ECC]/5 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                      className="h-4 w-4 text-[#008ECC] focus:ring-[#008ECC]"
                    />
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      Express Courier
                    </span>
                  </div>
                  <span className="font-extrabold font-mono text-xs text-slate-900">
                    $15.00
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 pl-6">
                  Priority 24–48 hour dispatch & direct handling.
                </p>
              </label>
            </div>
          </div>

          {/* Section 4: Payment Method Selection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#008ECC] text-xs font-bold text-white">
                4
              </span>
              <div className="flex items-center gap-1.5">
                <FiCreditCard className="text-[#008ECC]" />
                <h2 className="text-base font-extrabold text-slate-800">
                  Payment Method
                </h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Cash on Delivery (COD) */}
              <label
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                  paymentMethod === "COD"
                    ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        Cash on Delivery (COD)
                      </span>
                      <span className="ml-2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                        Recommended
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500 pl-7">
                  Pay securely with cash upon physical delivery. Inspect parcel
                  at handover with zero upfront online risk.
                </p>
              </label>

              {/* Credit / Debit Card (Gateway Boundary) */}
              <label
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                  paymentMethod === "CARD"
                    ? "border-amber-400 bg-amber-50/50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-400"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        Credit / Debit Card (Online Gateway)
                      </span>
                      <span className="ml-2 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700">
                        Gateway Sandbox Boundary
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-800 pl-4">
                  <FiInfo className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Integration Boundary: Online card provider requires live merchant
                    credentials. For immediate order placement, please select{" "}
                    <strong>Cash on Delivery (COD)</strong> above.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Placement (1 col) */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-extrabold text-slate-800">
              Order Summary
            </h2>

            {/* Calculations Breakdown */}
            <div className="mt-4 space-y-3 border-b border-slate-100 pb-4 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-semibold font-mono">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping ({shippingMethod})</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (5%)</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatCurrency(estimatedTax)}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="mt-4">
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
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-xl"
                  onClick={handleApplyPromo}
                >
                  Apply
                </Button>
              </div>
              {promoFeedback && (
                <p
                  className={`mt-1.5 text-[11px] font-medium ${
                    promoFeedback.isError
                      ? "text-rose-500"
                      : "text-emerald-600"
                  }`}
                >
                  {promoFeedback.text}
                </p>
              )}
            </div>

            {/* Grand Total */}
            <div className="mt-6 flex items-baseline justify-between border-t border-slate-100 pt-4">
              <span className="text-base font-extrabold text-slate-900">
                Total
              </span>
              <div className="text-right">
                <span className="text-2xl font-black text-[#008ECC] font-mono">
                  {formatCurrency(grandTotal)}
                </span>
                <p className="text-[10px] text-slate-400 font-medium">
                  Server-authoritative calculation
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={checkoutMutation.isPending}
                className="w-full justify-center rounded-xl bg-[#008ECC] hover:bg-[#0073A8] text-white font-bold shadow-md disabled:opacity-50"
              >
                {checkoutMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Placing Order...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <FiLock className="text-sm" />
                    Confirm & Place Order
                    <FiArrowRight className="ml-1" />
                  </span>
                )}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <FiShield className="text-emerald-500" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-[#008ECC]" />
                <span>Inspected Delivery & Stock Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
