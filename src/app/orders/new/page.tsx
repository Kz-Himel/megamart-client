"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiShoppingBag, FiShield, FiLock } from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/lib/cart/CartContext";
import { useAuthContext } from "@/lib/auth/AuthContext";
import { CheckoutWizard } from "@/components/orders/CheckoutWizard";
import { OrderConfirmation } from "@/components/orders/OrderConfirmation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CheckoutResult } from "@/types/order.types";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { user } = useAuthContext();
  const { items: cartItems, clearCart } = useCart();
  const { data: products, isLoading: isLoadingProducts } = useProducts();

  const [orderResult, setOrderResult] = useState<CheckoutResult | null>(null);

  const productId = searchParams.get("productId");
  const quantityParam = searchParams.get("quantity");
  const promoParam = searchParams.get("promo") ?? "";

  // If order was successfully placed, render OrderConfirmation view
  if (orderResult) {
    return <OrderConfirmation result={orderResult} />;
  }

  // 1. Direct product checkout mode (e.g. "Buy Now" on product detail)
  if (productId) {
    if (isLoadingProducts) {
      return <LoadingSpinner label="Loading product details..." />;
    }

    const targetProduct = products?.find((p) => p.id === productId);

    if (!targetProduct) {
      return (
        <EmptyState
          icon={<FiShoppingBag className="text-4xl text-slate-300" />}
          title="Product Not Found"
          description="The selected product could not be found or is no longer available."
          action={
            <Link href="/products">
              <Button variant="primary" size="md" className="rounded-xl bg-[#008ECC] text-white font-bold">
                Browse Products
              </Button>
            </Link>
          }
        />
      );
    }

    const qty = Math.max(1, Number(quantityParam) || 1);

    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: targetProduct.name, href: `/products/${targetProduct.id}` },
            { label: "Direct Checkout" },
          ]}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-2">
          <div>
            <h1 className="relative inline-block text-xl font-extrabold text-slate-800 sm:text-2xl">
              Express <span className="text-[#008ECC]">Checkout</span>
              <span className="absolute -bottom-[17px] left-0 h-[3px] w-full bg-[#008ECC] rounded-full" />
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Complete your order for {targetProduct.name}
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <FiLock className="text-xs" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <CheckoutWizard
          items={[{ product: targetProduct, quantity: qty }]}
          initialPromoCode={promoParam}
          defaultFullName={user?.name ?? ""}
          onSuccess={(result) => {
            setOrderResult(result);
          }}
        />
      </div>
    );
  }

  // 2. Multi-item Cart Checkout mode
  if (cartItems.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<FiShoppingBag className="text-4xl text-slate-300" />}
          title="Your Shopping Cart is Empty"
          description="Add items to your cart before proceeding to checkout."
          action={
            <Link href="/products">
              <Button variant="primary" size="md" className="rounded-xl bg-[#008ECC] text-white font-bold">
                Explore Catalog
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Shopping Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-2">
        <div>
          <h1 className="relative inline-block text-xl font-extrabold text-slate-800 sm:text-2xl">
            Secure <span className="text-[#008ECC]">Checkout</span>
            <span className="absolute -bottom-[17px] left-0 h-[3px] w-full bg-[#008ECC] rounded-full" />
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Review delivery details and finalize your order
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <FiShield className="text-xs" />
          <span>Verified Safe Checkout</span>
        </div>
      </div>

      <CheckoutWizard
        items={cartItems}
        initialPromoCode={promoParam}
        defaultFullName={user?.name ?? ""}
        onSuccess={(result) => {
          clearCart();
          setOrderResult(result);
        }}
      />
    </div>
  );
}

export default function NewOrderPage() {
  return (
    <div className="py-2">
      <Suspense fallback={<LoadingSpinner label="Preparing checkout..." />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}