"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/lib/api/product.api";
import { ProductPayload, ProductFilterParams } from "../types/products.types";

export const productKeys = {
  all: ["products"] as const,
  list: (params?: ProductFilterParams) => ["products", "list", params] as const,
  detail: (id: string) => ["products", id] as const,
};

export function useProducts(params?: ProductFilterParams) {
  return useQuery({
    queryKey: params ? productKeys.list(params) : productKeys.all,
    queryFn: () => productApi.getAll(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => productApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ProductPayload>) => productApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}