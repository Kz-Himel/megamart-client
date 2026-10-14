export type StoreStatus =
  | "DRAFT"
  | "PENDING"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type PayoutStatus = "PENDING" | "PROCESSING" | "PAID" | "REJECTED";

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logo?: string | null;
  banner?: string | null;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  taxId?: string | null;
  verificationDoc?: string | null;
  status: StoreStatus;
  adminFeedback?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  commissionRate: number;
  balance: number;
  totalEarnings: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  auditLogs?: StoreAuditLog[];
}

export interface StoreAuditLog {
  id: string;
  storeId: string;
  fromStatus: StoreStatus;
  toStatus: StoreStatus;
  reason?: string | null;
  reviewedBy: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  storeId: string;
  amount: number;
  status: PayoutStatus;
  paymentMethod?: string | null;
  accountInfo?: string | null;
  processedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  store?: {
    id: string;
    name: string;
    slug: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface SellerAnalyticsMetrics {
  grossSales: number;
  totalCommission: number;
  netEarnings: number;
  availableBalance: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  salesCount: number;
  revenue: number;
}

export interface SellerAnalytics {
  metrics: SellerAnalyticsMetrics;
  topProducts: TopProduct[];
  recentOrders: Array<{
    id: string;
    quantity: number;
    totalPrice: number;
    commissionAmount: number;
    sellerEarnings: number;
    status: string;
    createdAt: string;
    product: {
      id: string;
      name: string;
      price: number;
      image?: string | null;
    };
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}
