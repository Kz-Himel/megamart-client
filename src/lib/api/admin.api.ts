import apiClient from "./client.api";
import { Store, StoreStatus, Payout, PayoutStatus } from "@/types/seller.types";

export interface UpdateSellerStatusPayload {
  status: StoreStatus;
  reason?: string;
}

export interface ProcessPayoutPayload {
  status: PayoutStatus;
  notes?: string;
}

export const adminApi = {
  getAllSellers: async (status?: string): Promise<Store[]> => {
    const { data } = await apiClient.get("/admin/sellers", {
      params: status ? { status } : undefined,
    });
    return data.data;
  },

  getSellerById: async (id: string): Promise<Store> => {
    const { data } = await apiClient.get(`/admin/sellers/${id}`);
    return data.data;
  },

  updateSellerStatus: async (id: string, payload: UpdateSellerStatusPayload): Promise<Store> => {
    const { data } = await apiClient.patch(`/admin/sellers/${id}/status`, payload);
    return data.data;
  },

  updateSellerCommission: async (id: string, commissionRate: number): Promise<Store> => {
    const { data } = await apiClient.patch(`/admin/sellers/${id}/commission`, { commissionRate });
    return data.data;
  },

  getAllPayouts: async (status?: string): Promise<Payout[]> => {
    const { data } = await apiClient.get("/admin/payouts", {
      params: status ? { status } : undefined,
    });
    return data.data;
  },

  processPayout: async (id: string, payload: ProcessPayoutPayload): Promise<Payout> => {
    const { data } = await apiClient.patch(`/admin/payouts/${id}`, payload);
    return data.data;
  },
};
