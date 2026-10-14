import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  UpdateSellerStatusPayload,
  ProcessPayoutPayload,
} from "@/lib/api/admin.api";

export const ADMIN_QUERY_KEYS = {
  sellers: (status?: string) => ["admin", "sellers", status ?? "all"] as const,
  seller: (id: string) => ["admin", "seller", id] as const,
  payouts: (status?: string) => ["admin", "payouts", status ?? "all"] as const,
};

export function useAdminSellers(status?: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.sellers(status),
    queryFn: () => adminApi.getAllSellers(status),
  });
}

export function useAdminSeller(id: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.seller(id),
    queryFn: () => adminApi.getSellerById(id),
    enabled: !!id,
  });
}

export function useUpdateSellerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSellerStatusPayload }) =>
      adminApi.updateSellerStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.seller(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateSellerCommission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, commissionRate }: { id: string; commissionRate: number }) =>
      adminApi.updateSellerCommission(id, commissionRate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.seller(variables.id) });
    },
  });
}

export function useAdminPayouts(status?: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.payouts(status),
    queryFn: () => adminApi.getAllPayouts(status),
  });
}

export function useProcessPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProcessPayoutPayload }) =>
      adminApi.processPayout(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
    },
  });
}
