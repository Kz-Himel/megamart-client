import apiClient from "./client.api";
import { ApiResponse } from "@/types/common.types";

export const uploadApi = {
  uploadProductImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await apiClient.post<ApiResponse<{ url: string }>>(
      "/uploads/product-image",
      formData,
      // Let the browser set the multipart boundary itself — overriding the
      // client's default "application/json" header is required here.
      { headers: { "Content-Type": undefined } }
    );
    return res.data.data.url;
  },
};