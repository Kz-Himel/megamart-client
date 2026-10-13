export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface Order {
  id: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  userId: string;
  productId: string;
  user?: { id: string; name: string; email: string };
  product?: { id: string; name: string; price: number; image?: string | null };
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  quantity: number;
  productId: string;
}

export interface UpdateOrderPayload {
  status?: OrderStatus;
  quantity?: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: "standard" | "express";
  paymentMethod: "COD" | "CARD";
  promoCode?: string;
  idempotencyKey?: string;
}

export interface CheckoutSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
}

export interface CheckoutResult {
  orderReference: string;
  orders: Order[];
  summary: CheckoutSummary;
  shippingAddress: ShippingAddress;
  shippingMethod: "standard" | "express";
  paymentMethod: "COD" | "CARD";
  paymentStatus: string;
  status: OrderStatus;
  createdAt: string;
}