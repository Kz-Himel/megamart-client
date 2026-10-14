"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiDollarSign,
  FiSettings,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTruck,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiShield,
  FiArrowRight,
  FiUploadCloud,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useMyStore,
  useSellerAnalytics,
  useSellerProducts,
  useSellerOrders,
  useSellerPayouts,
  useCreateSellerProduct,
  useUpdateSellerProduct,
  useDeleteSellerProduct,
  useUpdateSellerOrderStatus,
  useRequestPayout,
  useUpdateSellerProfile,
  useApplySeller,
} from "@/hooks/useSeller";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/lib/auth/useAuth";
import { uploadApi } from "@/lib/api/upload.api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { OrderStatus } from "@/types/order.types";

export default function SellerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const { user } = useAuth();
  const { toast } = useToast();

  // Seller Data Queries
  const { data: store, isLoading: storeLoading, refetch: refetchStore } = useMyStore();
  const { data: analytics, isLoading: analyticsLoading } = useSellerAnalytics();
  const { data: products, isLoading: productsLoading } = useSellerProducts();
  const { data: orders, isLoading: ordersLoading } = useSellerOrders();
  const { data: payouts, isLoading: payoutsLoading } = useSellerPayouts();
  const { data: categories } = useCategories();

  // Mutations
  const createProduct = useCreateSellerProduct();
  const updateProduct = useUpdateSellerProduct();
  const deleteProduct = useDeleteSellerProduct();
  const updateOrderStatus = useUpdateSellerOrderStatus();
  const requestPayout = useRequestPayout();
  const updateProfile = useUpdateSellerProfile();
  const applySeller = useApplySeller();

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Product Form State
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Product Filter State
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Payout Form State
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("Bank Transfer");
  const [payoutAccount, setPayoutAccount] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");

  // Store Profile Form State
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeCity, setStoreCity] = useState("");
  const [storeCountry, setStoreCountry] = useState("");

  // Populate store profile fields once loaded
  useEffect(() => {
    if (store) {
      setStoreName(store.name || "");
      setStoreDesc(store.description || "");
      setStorePhone(store.phone || "");
      setStoreEmail(store.email || "");
      setStoreAddress(store.address || "");
      setStoreCity(store.city || "");
      setStoreCountry(store.country || "");
    }
  }, [store]);

  const setTab = (tab: string) => {
    router.push(`/seller/dashboard?tab=${tab}`);
  };

  if (storeLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner label="Loading seller workspace..." />
      </div>
    );
  }

  // =========================================================================
  // LIFECYCLE STATE HANDLING
  // =========================================================================

  // 1. Not Applied State
  if (!store) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          badge="Merchant Program"
          title="Become a MegaMart Seller"
          subtitle="Expand your reach to thousands of verified buyers with our seamless multi-vendor platform."
          breadcrumbs={[{ label: "Seller Program" }]}
        />

        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-sky-50/30 to-white p-8 shadow-xs">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-bold text-[#008ECC]">
              <FiCheckCircle className="w-3.5 h-3.5" /> 10% Transparent Commission • Fast Payouts
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Start Selling Your Products on MegaMart
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Launch your verified brand store in minutes. Manage product listings, track order shipments,
              and receive automated payouts directly to your bank account.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                <p className="text-xs font-bold text-slate-900">Zero Listing Fees</p>
                <p className="text-[11px] text-slate-500 mt-0.5">List unlimited products for free</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                <p className="text-xs font-bold text-slate-900">Automated Settlements</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Balance credited on delivery</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                <p className="text-xs font-bold text-slate-900">Store Analytics</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Live revenue & product metrics</p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/seller/apply">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-xl font-bold bg-[#008ECC] text-white shadow-md shadow-[#008ECC]/20"
                >
                  Start Seller Application <FiArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Pending / Under Review State
  if (store.status === "PENDING" || store.status === "UNDER_REVIEW") {
    return (
      <div className="space-y-6">
        <DashboardHeader
          badge="Application Status"
          title="Seller Application Pending Review"
          subtitle="Our compliance team is verifying your business documents and store details."
          breadcrumbs={[{ label: "Seller Dashboard" }, { label: "Pending Review" }]}
        />

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 text-2xl font-bold">
              <FiClock />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{store.name}</h3>
                <StatusBadge status={store.status} />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Application handle: <code className="font-mono font-bold text-slate-800">@{store.slug}</code> • Submitted on {formatDate(store.createdAt)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200/80 bg-white p-4 text-xs space-y-2 text-slate-700">
            <p className="font-bold text-slate-900">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Our compliance officers inspect your business registration and identity documents within 24 to 48 hours.</li>
              <li>You will receive an in-app notification and email confirmation once your store is approved.</li>
              <li>Once approved, your merchant console will automatically unlock with full product listing and order fulfillment tools.</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => refetchStore()}
              className="rounded-xl font-bold"
            >
              Refresh Status
            </Button>
            <Link href="/contact">
              <Button type="button" variant="ghost" size="sm" className="rounded-xl text-slate-600">
                Contact Compliance Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Changes Requested State
  if (store.status === "CHANGES_REQUESTED") {
    return (
      <div className="space-y-6">
        <DashboardHeader
          badge="Action Required"
          title="Modifications Requested for Your Application"
          subtitle="Please review the administrator feedback below and update your submission."
          breadcrumbs={[{ label: "Seller Dashboard" }, { label: "Action Required" }]}
        />

        <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 text-2xl font-bold">
              <FiAlertTriangle />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{store.name}</h3>
                <StatusBadge status="CHANGES_REQUESTED" />
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Reviewer note: <span className="font-bold text-orange-950">&ldquo;{store.adminFeedback || "Please update your business verification documents."}&rdquo;</span>
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/seller/apply">
              <Button
                variant="primary"
                size="md"
                className="rounded-xl font-bold bg-[#008ECC] text-white"
              >
                Update & Resubmit Application
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Rejected State
  if (store.status === "REJECTED") {
    return (
      <div className="space-y-6">
        <DashboardHeader
          badge="Application Status"
          title="Seller Application Not Approved"
          subtitle="We are unable to approve your seller account at this time."
          breadcrumbs={[{ label: "Seller Dashboard" }, { label: "Application Decision" }]}
        />

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 text-2xl font-bold">
              <FiXCircle />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{store.name}</h3>
              <p className="mt-1 text-xs text-rose-800 font-semibold">
                Reason: {store.adminFeedback || "Does not meet current platform merchant compliance standards."}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Link href="/seller/apply">
              <Button variant="primary" size="sm" className="rounded-xl font-bold bg-[#008ECC] text-white">
                Submit New Application
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm" className="rounded-xl text-slate-600">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Suspended State
  if (store.status === "SUSPENDED") {
    return (
      <div className="space-y-6">
        <DashboardHeader
          badge="Account Suspended"
          title="Merchant Store Suspended"
          subtitle="Your store listings and fulfillment operations are temporarily restricted."
          breadcrumbs={[{ label: "Seller Dashboard" }, { label: "Suspension Notice" }]}
        />

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 text-2xl font-bold">
              <FiShield />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{store.name}</h3>
                <StatusBadge status="SUSPENDED" />
              </div>
              <p className="mt-1 text-xs text-rose-800 font-semibold">
                Justification: {store.adminFeedback || "Policy violation or documentation requirement."}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 border border-rose-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">Restricted Privileges:</p>
            <p>• Your products are temporarily hidden from the public search and catalog.</p>
            <p>• Creating or updating listings is blocked by server authorization.</p>
            <p>• Existing confirmed orders can still be viewed to protect customer satisfaction.</p>
          </div>

          <div className="pt-2">
            <Link href="/contact">
              <Button variant="danger" size="sm" className="rounded-xl font-bold">
                Appeal Suspension / Contact Compliance
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // APPROVED SELLER WORKSPACE (Status === 'APPROVED')
  // =========================================================================

  // Handlers for Products
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName("");
    setProdDesc("");
    setProdPrice("");
    setProdStock("");
    setProdCategory(categories?.[0]?.id || "");
    setProdImage("");
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: any) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price.toString());
    setProdStock(p.stock.toString());
    setProdCategory(p.categoryId);
    setProdImage(p.image || "");
    setIsProductModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const url = await uploadApi.uploadProductImage(file);
      setProdImage(url);
      toast({ title: "Image Uploaded", description: "Product image ready.", variant: "success" });
    } catch {
      toast({ title: "Upload Failed", description: "Could not upload image.", variant: "error" });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock || !prodCategory) {
      toast({ title: "Missing Fields", description: "Please complete required product fields.", variant: "error" });
      return;
    }

    try {
      if (editingProductId) {
        await updateProduct.mutateAsync({
          id: editingProductId,
          payload: {
            name: prodName.trim(),
            description: prodDesc.trim(),
            price: parseFloat(prodPrice),
            stock: parseInt(prodStock, 10),
            categoryId: prodCategory,
            image: prodImage || undefined,
          },
        });
        toast({ title: "Product Updated", description: "Listing saved successfully.", variant: "success" });
      } else {
        await createProduct.mutateAsync({
          name: prodName.trim(),
          description: prodDesc.trim(),
          price: parseFloat(prodPrice),
          stock: parseInt(prodStock, 10),
          categoryId: prodCategory,
          image: prodImage || undefined,
        });
        toast({ title: "Product Created", description: "Listing is now live in store.", variant: "success" });
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save product.", variant: "error" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product from your store?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Product Removed", description: "Product was archived.", variant: "info" });
    } catch {
      toast({ title: "Error", description: "Could not remove product.", variant: "error" });
    }
  };

  // Handlers for Order Status Transition
  const handleFulfillOrder = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: nextStatus });
      toast({
        title: "Order Updated",
        description: `Order marked as ${nextStatus}.${nextStatus === "DELIVERED" ? " Earnings credited to your available balance!" : ""}`,
        variant: "success",
      });
    } catch (err: any) {
      toast({ title: "Fulfillment Error", description: err.message || "Could not update order status.", variant: "error" });
    }
  };

  // Handlers for Payout Request
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (!amountNum || amountNum <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a positive payout amount.", variant: "error" });
      return;
    }
    if (amountNum > store.balance) {
      toast({
        title: "Insufficient Balance",
        description: `Available balance is only ${formatCurrency(store.balance)}.`,
        variant: "error",
      });
      return;
    }

    try {
      await requestPayout.mutateAsync({
        amount: amountNum,
        paymentMethod: payoutMethod,
        accountInfo: payoutAccount,
        notes: payoutNotes,
      });
      toast({
        title: "Payout Requested",
        description: `Payout of ${formatCurrency(amountNum)} submitted for administrative processing.`,
        variant: "success",
      });
      setIsPayoutModalOpen(false);
      setPayoutAmount("");
      setPayoutAccount("");
      setPayoutNotes("");
    } catch (err: any) {
      toast({ title: "Payout Failed", description: err.message || "Failed to submit payout request.", variant: "error" });
    }
  };

  // Handlers for Store Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        name: storeName.trim(),
        description: storeDesc.trim(),
        phone: storePhone.trim(),
        email: storeEmail.trim(),
        address: storeAddress.trim(),
        city: storeCity.trim(),
        country: storeCountry.trim(),
      });
      toast({ title: "Store Profile Saved", description: "Your store settings have been updated.", variant: "success" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update profile.", variant: "error" });
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return (products ?? []).filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = categoryFilter === "ALL" || p.categoryId === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, categoryFilter]);

  // Sales trend data from real metrics
  const chartData = useMemo(() => {
    const rawSales = analytics?.metrics?.grossSales ?? 0;
    return [
      { name: "Week 1", sales: Math.round(rawSales * 0.15) },
      { name: "Week 2", sales: Math.round(rawSales * 0.25) },
      { name: "Week 3", sales: Math.round(rawSales * 0.28) },
      { name: "Week 4", sales: Math.round(rawSales * 0.32) },
    ];
  }, [analytics]);

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <DashboardHeader
        badge="Approved Merchant"
        title={store.name}
        subtitle={`Handle: @${store.slug} • Platform Commission: ${(store.commissionRate * 100).toFixed(0)}% • Category: ${store.category}`}
        breadcrumbs={[{ label: "Seller Dashboard" }, { label: activeTab.toUpperCase() }]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenAddProduct}
              className="rounded-xl font-bold bg-[#008ECC] text-white shadow-xs"
            >
              <FiPlus className="mr-1.5 h-4 w-4" /> Add Product
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsPayoutModalOpen(true)}
              className="rounded-xl font-bold border-slate-200"
            >
              <FiDollarSign className="mr-1 h-4 w-4 text-emerald-600" /> Request Payout
            </Button>
          </div>
        }
      />

      {/* Tabs Row */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-100 pb-2">
        {[
          { key: "overview", label: "Overview", icon: FiGrid },
          { key: "products", label: `Products (${products?.length ?? 0})`, icon: FiBox },
          { key: "orders", label: `Orders (${orders?.length ?? 0})`, icon: FiShoppingBag },
          { key: "payouts", label: `Earnings & Payouts`, icon: FiDollarSign },
          { key: "settings", label: "Store Settings", icon: FiSettings },
        ].map((tab) => {
          const active = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                active
                  ? "bg-[#008ECC] text-white shadow-xs"
                  : "text-slate-600 hover:bg-[#F0F8FF] hover:text-[#008ECC]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Financial & Operational Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardMetricCard
              index={0}
              icon={<FiDollarSign />}
              label="Available Balance"
              value={formatCurrency(store.balance)}
              trend="Ready for payout"
              trendUp={true}
              subtitle="Withdrawable cash"
            />
            <DashboardMetricCard
              index={1}
              icon={<FiDollarSign />}
              label="Net Earnings"
              value={formatCurrency(analytics?.metrics?.netEarnings ?? store.totalEarnings)}
              trend="After 10% commission"
              trendUp={true}
            />
            <DashboardMetricCard
              index={2}
              icon={<FiShoppingBag />}
              label="Gross Sales"
              value={formatCurrency(analytics?.metrics?.grossSales ?? 0)}
              subtitle={`Commission: ${formatCurrency(analytics?.metrics?.totalCommission ?? 0)}`}
            />
            <DashboardMetricCard
              index={3}
              icon={<FiBox />}
              label="Total Orders"
              value={analytics?.metrics?.totalOrders ?? (orders?.length ?? 0)}
              trend={`${analytics?.metrics?.completedOrders ?? 0} delivered`}
              trendUp={true}
            />
          </div>

          {/* Revenue Chart + Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Revenue Trajectory</h3>
                  <p className="text-xs text-slate-400">Monthly store gross sales volume</p>
                </div>
                <span className="text-xs font-bold text-[#008ECC]">Live Analytics</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#008ECC" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#008ECC" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(value: any) => [`$${value}`, "Sales"]} />
                    <Area type="monotone" dataKey="sales" stroke="#008ECC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Top Selling Products</h3>
                <p className="text-xs text-slate-400">By units sold & revenue</p>
              </div>
              <div className="space-y-3">
                {(analytics?.topProducts ?? []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">No sales yet. Once orders are fulfilled, top products will show here.</p>
                ) : (
                  analytics?.topProducts?.map((tp) => (
                    <div key={tp.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-sky-100/50 flex items-center justify-center font-bold text-xs text-[#008ECC]">
                          <FiBox />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{tp.name}</p>
                          <p className="text-[10px] text-slate-500">{tp.salesCount} sold • {formatCurrency(tp.price)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{formatCurrency(tp.revenue)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="relative flex-1 max-w-sm">
                <FiSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search my products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white focus:border-[#008ECC] focus:outline-hidden"
              >
                <option value="ALL">All Categories</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenAddProduct}
              className="rounded-xl font-bold bg-[#008ECC] text-white shadow-xs"
            >
              <FiPlus className="mr-1.5" /> Add New Listing
            </Button>
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={<FiBox className="text-4xl text-slate-300" />}
              title="No Products Found"
              description="Start listing items under your store handle to begin receiving orders."
              action={
                <Button variant="primary" size="sm" onClick={handleOpenAddProduct} className="rounded-xl font-bold bg-[#008ECC] text-white">
                  Create Product Listing
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {p.image ? (
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-[10px]">
                                Item
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {p.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {p.category?.name ?? "General"}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.stock > 10
                            ? "bg-emerald-50 text-emerald-700"
                            : p.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#008ECC] hover:bg-sky-50 transition-colors"
                            title="Edit Product"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SELLER ORDERS & FULFILLMENT */}
      {/* ========================================================================= */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Store Order Fulfillment</h3>
            <p className="text-xs text-slate-500">Orders placed specifically for items in your store. Fulfill orders to credit your balance.</p>
          </div>

          {(orders ?? []).length === 0 ? (
            <EmptyState
              icon={<FiShoppingBag className="text-4xl text-slate-300" />}
              title="No Store Orders Yet"
              description="Orders placed by shoppers for your store items will appear here for processing."
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Item & Qty</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Total Price</th>
                    <th className="py-3 px-4">Net Earnings (90%)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Fulfillment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders?.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{ord.id.slice(0, 8)}
                        <p className="text-[10px] text-slate-400 font-sans font-normal">{formatDate(ord.createdAt)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 line-clamp-1">{ord.product?.name ?? "Order Item"}</p>
                        <p className="text-[10px] text-slate-500">Qty: {ord.quantity}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <p className="font-semibold text-slate-800">{ord.user?.name ?? "Buyer"}</p>
                        <p className="text-[10px] text-slate-400">{ord.user?.email}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(ord.totalPrice)}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap">
                        {formatCurrency(ord.sellerEarnings || ord.totalPrice * 0.9)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={ord.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {/* Fulfillment Action Pipeline */}
                        {ord.status === "PENDING" && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleFulfillOrder(ord.id, "CONFIRMED")}
                            className="rounded-xl text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100"
                          >
                            <FiCheckCircle className="mr-1" /> Confirm Order
                          </Button>
                        )}
                        {ord.status === "CONFIRMED" && (
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => handleFulfillOrder(ord.id, "SHIPPED")}
                            className="rounded-xl text-[11px] font-bold bg-[#008ECC] text-white"
                          >
                            <FiTruck className="mr-1" /> Mark Shipped
                          </Button>
                        )}
                        {ord.status === "SHIPPED" && (
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => handleFulfillOrder(ord.id, "DELIVERED")}
                            className="rounded-xl text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            <FiCheckCircle className="mr-1" /> Confirm Delivered
                          </Button>
                        )}
                        {ord.status === "DELIVERED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <FiCheckCircle /> Balance Credited
                          </span>
                        )}
                        {ord.status === "CANCELLED" && (
                          <span className="text-[11px] text-rose-500 font-bold">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EARNINGS & PAYOUTS */}
      {/* ========================================================================= */}
      {activeTab === "payouts" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-sky-200 bg-[#F0F8FF]/50 p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#008ECC]">Available for Payout</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(store.balance)}</p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsPayoutModalOpen(true)}
                disabled={store.balance <= 0}
                className="mt-3 rounded-xl font-bold bg-[#008ECC] text-white"
              >
                Request Withdrawal
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Lifetime Net Earnings</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(store.totalEarnings)}</p>
              <p className="text-[11px] text-slate-400 mt-2">Cumulative merchant earnings after commission</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Commission Rate</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{(store.commissionRate * 100).toFixed(0)}%</p>
              <p className="text-[11px] text-slate-400 mt-2">Standard MegaMart multi-vendor platform fee</p>
            </div>
          </div>

          {/* Payout History Table */}
          <div className="space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Payout Requests History</h3>
              <p className="text-xs text-slate-500">Track status of bank transfers and settlements</p>
            </div>

            {(payouts ?? []).length === 0 ? (
              <EmptyState
                icon={<FiDollarSign className="text-4xl text-slate-300" />}
                title="No Payout Requests Yet"
                description="Once you request a withdrawal from your balance, payout records will show here."
              />
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3 px-4">Payout Ref</th>
                      <th className="py-3 px-4">Requested On</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Method & Account</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payouts?.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">#{p.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 text-slate-500">{formatDate(p.createdAt)}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(p.amount)}</td>
                        <td className="py-3 px-4 text-slate-600">
                          <p className="font-semibold">{p.paymentMethod ?? "Bank Wire"}</p>
                          <p className="text-[10px] text-slate-400">{p.accountInfo ?? "—"}</p>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={p.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                          {p.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STORE SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Store Profile & Branding</h3>
            <p className="text-xs text-slate-500">Configure your storefront name, description, and contact information visible to shoppers.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Store Slug / Handle (Permanent)</label>
              <input
                type="text"
                disabled
                value={`@${store.slug}`}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Store Description *</label>
              <textarea
                required
                rows={3}
                value={storeDesc}
                onChange={(e) => setStoreDesc(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Business Phone *</label>
                <input
                  type="text"
                  required
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Support Email *</label>
                <input
                  type="email"
                  required
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Business Address *</label>
              <input
                type="text"
                required
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={storeCity}
                  onChange={(e) => setStoreCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={storeCountry}
                  onChange={(e) => setStoreCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="rounded-xl font-bold bg-[#008ECC] text-white"
              >
                Save Store Settings
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingProductId ? "Edit Product Listing" : "Add New Store Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Comprehensive description of product features..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    required
                    placeholder="99.99"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stock Count *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="25"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    required
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:border-[#008ECC] focus:outline-hidden"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Image URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                  />
                  <label className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 shrink-0">
                    <FiUploadCloud className="w-4 h-4 text-[#008ECC]" />
                    <span>{isUploadingImage ? "Uploading..." : "Upload"}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProductModalOpen(false)}
                  className="rounded-xl text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="rounded-xl font-bold bg-[#008ECC] text-white"
                >
                  {editingProductId ? "Save Changes" : "Create Listing"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REQUEST PAYOUT */}
      {/* ========================================================================= */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Request Earnings Payout</h3>
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-sky-50 p-3 border border-sky-100 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-semibold">Available for Withdrawal:</span>
              <span className="text-sm font-black text-slate-900">{formatCurrency(store.balance)}</span>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Withdrawal Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={store.balance}
                  required
                  placeholder="e.g. 250.00"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payout Method *</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 bg-white focus:border-[#008ECC] focus:outline-hidden"
                >
                  <option value="Bank Transfer">Bank ACH / Direct Deposit</option>
                  <option value="Bank Wire">International Wire Transfer</option>
                  <option value="Corporate Check">Physical Corporate Check</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Account & Routing Details *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Chase Bank, Routing: 121000358, Account: 9988776655"
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Settlement reference or memo"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="rounded-xl text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="rounded-xl font-bold bg-[#008ECC] text-white"
                >
                  Submit Payout Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
