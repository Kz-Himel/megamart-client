"use client";

import { useState } from "react";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { Product } from "@/types/products.types";
import { CreateOrderPayload } from "@/types/order.types";
import { getErrorMessage } from "@/lib/utils/formatters";

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
  isSubmitting,
}: OrderFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState(defaultProductId ?? products[0]?.id ?? "");

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get("quantity") || 1);

    if (!productId) {
      setError("Please select a product");
      return;
    }
    if (selectedProduct && quantity > selectedProduct.stock) {
      setError(`Only ${selectedProduct.stock} in stock`);
      return;
    }

    try {
      await onSubmit({ productId, quantity });
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not place order"));
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="w-full max-w-lg space-y-4 rounded-2xl border border-border bg-surface p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Product</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} — ${product.price.toFixed(2)} ({product.stock} in stock)
            </option>
          ))}
        </select>
      </div>

      <TextField name="quantity" type="number" defaultValue="1" isRequired minLength={1}>
        <Label className="text-sm font-medium">Quantity</Label>
        <Input type="number" min={1} />
        <FieldError className="text-xs text-danger" />
      </TextField>

      {selectedProduct && (
        <p className="font-mono text-sm text-muted">
          Unit price: <span className="text-price-foreground">${selectedProduct.price.toFixed(2)}</span>
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <Button type="submit" className="w-full" isDisabled={isSubmitting || !productId}>
        {isSubmitting ? "Placing order..." : "Place order"}
      </Button>
    </Form>
  );
}