"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api/order.api";
import { CreateOrderPayload, OrderStatus, UpdateOrderPayload } from "@/types/order.types";

export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: string) => ["orders", id] as const,
};

export function useOrders(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: orderApi.getAll,
    enabled: options?.enabled ?? true,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}

// id passed as mutation variable (not hook arg) — needed for per-row updates in a table
export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderPayload }) =>
      orderApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}