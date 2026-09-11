export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  status: CategoryStatus;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
  status?: CategoryStatus;
}