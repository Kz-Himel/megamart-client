export type ReviewStatus = "PUBLISHED" | "HIDDEN";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  userId: string;
  productId: string;
  user?: { id: string; name: string };
  product?: { id: string; name: string; image?: string | null };
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
  productId: string;
  status?: ReviewStatus;
}

export interface ReviewUpdatePayload {
  rating?: number;
  comment?: string;
  status?: ReviewStatus;
}