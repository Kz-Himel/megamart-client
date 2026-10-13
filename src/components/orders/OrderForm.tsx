"use client";

import { CheckoutWizard } from "./CheckoutWizard";
import { Product } from "@/types/products.types";
import { CreateOrderPayload } from "@/types/order.types";

interface OrderFormProps {
  products: Product[];
  defaultProductId?: string;
  onSubmit: (payload: CreateOrderPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function OrderForm({
  products,
  defaultProductId,
  onSubmit,
}: OrderFormProps) {
  const selectedProduct =
    products.find((p) => p.id === defaultProductId) ?? products[0];

  if (!selectedProduct) {
    return <p className="text-sm text-slate-500">No product available to order.</p>;
  }

  return (
    <CheckoutWizard
      items={[{ product: selectedProduct, quantity: 1 }]}
      onSuccess={async () => {
        await onSubmit({
          productId: selectedProduct.id,
          quantity: 1,
        });
      }}
    />
  );
}

export { CheckoutWizard };