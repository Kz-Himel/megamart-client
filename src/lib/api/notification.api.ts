import apiClient from "./client.api";
import { NotificationItem } from "@/types/seller.types";

export const notificationApi = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const { data } = await apiClient.get("/notifications");
    return data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/read-all");
  },
};
