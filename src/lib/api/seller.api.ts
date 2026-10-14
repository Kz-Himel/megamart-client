import apiClient from "./client.api";
import { Store, SellerAnalytics, Payout } from "@/types/seller.types";
import { Product } from "@/types/products.types";
import { Order, OrderStatus } from "@/types/order.types";

export interface SellerApplyPayload {
  name: string;
  slug: string;
  description: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  taxId?: string;
  verificationDoc?: string;
  termsAccepted: boolean;
}

export interface SellerProfilePayload {
  name?: string;
  description?: string;
  category?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface SellerProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
  status?: string;
}

export interface RequestPayoutPayload {
  amount: number;
  paymentMethod: string;
  accountInfo: string;
  notes?: string;
}

export const sellerApi = {
  apply: async (payload: SellerApplyPayload): Promise<Store> => {
    const { data } = await apiClient.post("/seller/apply", payload);
    return data.data;
  },

  getMyStore: async (): Promise<Store> => {
    const { data } = await apiClient.get("/seller/me");
    return data.data;
  },

  updateProfile: async (payload: SellerProfilePayload): Promise<Store> => {
    const { data } = await apiClient.patch("/seller/profile", payload);
    return data.data;
  },

  getSellerProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get("/seller/products");
    return data.data;
  },

  createProduct: async (payload: SellerProductPayload): Promise<Product> => {
    const { data } = await apiClient.post("/seller/products", payload);
    return data.data;
  },

  updateProduct: async (id: string, payload: Partial<SellerProductPayload>): Promise<Product> => {
    const { data } = await apiClient.patch(`/seller/products/${id}`, payload);
    return data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/seller/products/${id}`);
  },

  getSellerOrders: async (): Promise<Order[]> => {
    const { data } = await apiClient.get("/seller/orders");
    return data.data;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const { data } = await apiClient.patch(`/seller/orders/${orderId}/status`, { status });
    return data.data;
  },

  getSellerAnalytics: async (): Promise<SellerAnalytics> => {
    const { data } = await apiClient.get("/seller/analytics");
    return data.data;
  },

  requestPayout: async (payload: RequestPayoutPayload): Promise<Payout> => {
    const { data } = await apiClient.post("/seller/payouts", payload);
    return data.data;
  },

  getMyPayouts: async (): Promise<Payout[]> => {
    const { data } = await apiClient.get("/seller/payouts");
    return data.data;
  },

  getPublicStore: async (slug: string): Promise<{ store: Store; products: Product[] }> => {
    const { data } = await apiClient.get(`/seller/stores/${slug}`);
    return data.data;
  },
};
