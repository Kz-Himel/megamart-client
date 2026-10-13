import apiClient from "../api/client.api";
import { ApiResponse } from "@/types/common.types";
import { Product, ProductPayload, ProductFilterParams } from "../../types/products.types";

export const productApi = {
  getAll: async (params?: ProductFilterParams) => {
    const res = await apiClient.get<ApiResponse<Product[]>>("/products", { params });
    return res.data.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data.data;
  },

  create: async (payload: ProductPayload) => {
    const res = await apiClient.post<ApiResponse<Product>>(
      "/products",
      payload
    );
    return res.data.data;
  },

  update: async (id: string, payload: Partial<ProductPayload>) => {
    const res = await apiClient.patch<ApiResponse<Product>>(
      `/products/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<Product>>(
      `/products/${id}`
    );
    return res.data.data;
  },
};