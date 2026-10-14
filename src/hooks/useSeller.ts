import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sellerApi,
  SellerApplyPayload,
  SellerProfilePayload,
  SellerProductPayload,
  RequestPayoutPayload,
} from "@/lib/api/seller.api";
import { OrderStatus } from "@/types/order.types";

export const SELLER_QUERY_KEYS = {
  myStore: ["seller", "myStore"] as const,
  analytics: ["seller", "analytics"] as const,
  products: ["seller", "products"] as const,
  orders: ["seller", "orders"] as const,
  payouts: ["seller", "payouts"] as const,
  publicStore: (slug: string) => ["seller", "publicStore", slug] as const,
};

export function useMyStore() {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.myStore,
    queryFn: sellerApi.getMyStore,
    retry: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useSellerAnalytics() {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.analytics,
    queryFn: sellerApi.getSellerAnalytics,
    refetchInterval: 1000 * 30, // 30s live updates
  });
}

export function useSellerProducts() {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.products,
    queryFn: sellerApi.getSellerProducts,
  });
}

export function useSellerOrders() {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.orders,
    queryFn: sellerApi.getSellerOrders,
    refetchInterval: 1000 * 30,
  });
}

export function useSellerPayouts() {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.payouts,
    queryFn: sellerApi.getMyPayouts,
  });
}

export function useApplySeller() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SellerApplyPayload) => sellerApi.apply(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore });
    },
  });
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SellerProfilePayload) => sellerApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore });
    },
  });
}

export function useCreateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SellerProductPayload) => sellerApi.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.analytics });
    },
  });
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SellerProductPayload> }) =>
      sellerApi.updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellerApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.analytics });
    },
  });
}

export function useUpdateSellerOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      sellerApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.analytics });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestPayoutPayload) => sellerApi.requestPayout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.payouts });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.analytics });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.myStore });
    },
  });
}
