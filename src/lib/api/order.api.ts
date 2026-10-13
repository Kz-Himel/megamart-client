import apiClient from "../api/client.api";
import { ApiResponse } from "@/types/common.types";
import {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
  CheckoutPayload,
  CheckoutResult,
} from "@/types/order.types";

export const orderApi = {
  getAll: async () => {
    const res = await apiClient.get<ApiResponse<Order[]>>("/orders");
    return res.data.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return res.data.data;
  },

  checkout: async (payload: CheckoutPayload) => {
    const res = await apiClient.post<ApiResponse<CheckoutResult>>(
      "/orders/checkout",
      payload
    );
    return res.data.data;
  },

  create: async (payload: CreateOrderPayload) => {
    const res = await apiClient.post<ApiResponse<Order>>("/orders", payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateOrderPayload) => {
    const res = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<Order>>(`/orders/${id}`);
    return res.data.data;
  },
};