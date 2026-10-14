"use client";

import { useState, useMemo } from "react";
import {
  FiBriefcase,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiClock,
  FiShield,
  FiExternalLink,
  FiFileText,
} from "react-icons/fi";
import { useAdminSellers, useUpdateSellerStatus, useUpdateSellerCommission } from "@/hooks/useAdmin";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DecisionModal, DecisionType } from "@/components/dashboard/DecisionModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Store, StoreStatus } from "@/types/seller.types";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";

export default function AdminSellersPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Decision Modal State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<DecisionType>("APPROVE");
  const [targetStore, setTargetStore] = useState<Store | null>(null);

  // Commission Edit State
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [newCommissionRate, setNewCommissionRate] = useState("10");

  // Backend queries & mutations
  const { data: sellers, isLoading, refetch } = useAdminSellers(filter === "ALL" ? undefined : filter);
  const updateStatus = useUpdateSellerStatus();
  const updateCommission = useUpdateSellerCommission();

  const filteredStores = useMemo(() => {
    return (sellers ?? []).filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.user?.name ?? "").toLowerCase().includes(q);
      return matchSearch;
    });
  }, [sellers, search]);

  const handleOpenDecision = (store: Store, type: DecisionType) => {
    setTargetStore(store);
    setDecisionType(type);
    setDecisionModalOpen(true);
  };

  const handleConfirmDecision = async (reason: string) => {
    if (!targetStore) return;

    let targetStatus: StoreStatus;
    switch (decisionType) {
      case "APPROVE":
        targetStatus = "APPROVED";
        break;
      case "CHANGES_REQUESTED":
        targetStatus = "CHANGES_REQUESTED";
        break;
      case "SUSPEND":
        targetStatus = "SUSPENDED";
        break;
      case "REJECT":
      default:
        targetStatus = "REJECTED";
        break;
    }

    try {
      await updateStatus.mutateAsync({
        id: targetStore.id,
        payload: {
          status: targetStatus,
          reason: reason || undefined,
        },
      });

      toast({
        title: "Store Status Updated",
        description: `Store "${targetStore.name}" is now ${targetStatus}.`,
        variant: "success",
      });

      setDecisionModalOpen(false);
      if (selectedStore?.id === targetStore.id) {
        setSelectedStore((prev) => (prev ? { ...prev, status: targetStatus, adminFeedback: reason } : null));
      }
      refetch();
    } catch (err: unknown) {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Could not update seller status.",
        variant: "error",
      });
    }
  };

  const handleSaveCommission = async () => {
    if (!selectedStore) return;
    const rate = parseFloat(newCommissionRate) / 100;
    if (isNaN(rate) || rate < 0 || rate > 0.5) {
      toast({ title: "Invalid Rate", description: "Commission must be between 0% and 50%.", variant: "error" });
      return;
    }

    try {
      await updateCommission.mutateAsync({
        id: selectedStore.id,
        commissionRate: rate,
      });
      setSelectedStore({ ...selectedStore, commissionRate: rate });
      setIsEditingCommission(false);
      toast({ title: "Commission Updated", description: `Commission set to ${(rate * 100).toFixed(0)}%.`, variant: "success" });
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Could not update commission.", variant: "error" });
    }
  };

  const pendingCount = (sellers ?? []).filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW").length;

  return (
    <div className="space-y-6">
      <DashboardHeader
        badge="Platform Compliance"
        title="Seller Management & Applications"
        subtitle="Review new merchant credentials, moderate store catalogs, manage commissions, and enforce compliance."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Sellers" }]}
      />

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "All Sellers" },
            { key: "PENDING", label: `Pending Reviews ${pendingCount > 0 ? `(${pendingCount})` : ""}` },
            { key: "APPROVED", label: "Approved" },
            { key: "CHANGES_REQUESTED", label: "Changes Requested" },
            { key: "SUSPENDED", label: "Suspended" },
            { key: "REJECTED", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                filter === tab.key
                  ? "bg-[#008ECC] text-white shadow-xs"
                  : "text-slate-600 hover:bg-[#F0F8FF] hover:text-[#008ECC]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search stores or owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner label="Loading seller accounts..." />
        </div>
      ) : filteredStores.length === 0 ? (
        <EmptyState
          icon={<FiBriefcase className="text-4xl text-slate-300" />}
          title="No Sellers Found"
          description={filter === "PENDING" ? "There are no pending seller applications awaiting review." : "No store records match the current filter."}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Store & Handle</th>
                <th className="py-3 px-4">Owner Contact</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStores.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 line-clamp-1">{s.name}</p>
                    <p className="font-mono text-[10px] text-[#008ECC]">@{s.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <p className="font-semibold text-slate-800">{s.user?.name ?? s.email}</p>
                    <p className="text-[10px] text-slate-400">{s.phone} • {s.city}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {s.category}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                    {(s.commissionRate * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(s.balance)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedStore(s);
                          setNewCommissionRate((s.commissionRate * 100).toString());
                        }}
                        className="rounded-xl text-[11px] font-bold"
                      >
                        <FiEye className="mr-1" /> Review
                      </Button>

                      {s.status === "PENDING" && (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenDecision(s, "APPROVE")}
                          className="rounded-xl text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED APPLICATION REVIEW DRAWER / MODAL */}
      {/* ========================================================================= */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#008ECC]">Store Dossier</span>
                <h3 className="text-xl font-black text-slate-900">{selectedStore.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStore(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Status:</span>
                <StatusBadge status={selectedStore.status} />
              </div>
              <span className="text-slate-400 font-mono">Handle: @{selectedStore.slug}</span>
            </div>

            {/* Verification Documents & Identity Card */}
            <div className="rounded-xl border border-sky-200 bg-[#F0F8FF]/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FiFileText className="text-[#008ECC]" /> Business Verification Document
                </span>
                {selectedStore.verificationDoc ? (
                  <a
                    href={selectedStore.verificationDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#008ECC] hover:underline"
                  >
                    <span>Inspect Document</span>
                    <FiExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">No document attached</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Tax ID / Registration: <span className="font-bold text-slate-800">{selectedStore.taxId || "Not supplied"}</span>
              </p>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-100 p-3.5 bg-slate-50/50 space-y-1.5">
                <p className="font-bold text-slate-900">Owner Credentials</p>
                <p className="text-slate-600">Name: <span className="font-semibold text-slate-800">{selectedStore.user?.name ?? "—"}</span></p>
                <p className="text-slate-600">Email: <span className="font-semibold text-slate-800">{selectedStore.user?.email ?? selectedStore.email}</span></p>
                <p className="text-slate-600">Phone: <span className="font-semibold text-slate-800">{selectedStore.phone}</span></p>
              </div>

              <div className="rounded-xl border border-slate-100 p-3.5 bg-slate-50/50 space-y-1.5">
                <p className="font-bold text-slate-900">Registered Business Address</p>
                <p className="text-slate-600">{selectedStore.address}</p>
                <p className="text-slate-600">{selectedStore.city}, {selectedStore.country}</p>
                <p className="text-slate-400 text-[10px]">Submitted: {formatDate(selectedStore.createdAt)}</p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-slate-100 p-3.5 bg-white text-xs space-y-1">
              <p className="font-bold text-slate-900">Store Description</p>
              <p className="text-slate-600 leading-relaxed">{selectedStore.description}</p>
            </div>

            {/* Commission Settings */}
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Platform Commission Rate</p>
                <p className="text-[11px] text-slate-500">Currently taking {(selectedStore.commissionRate * 100).toFixed(0)}% from sales</p>
              </div>

              {isEditingCommission ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newCommissionRate}
                    onChange={(e) => setNewCommissionRate(e.target.value)}
                    className="w-16 rounded-lg border border-slate-300 p-1 text-center font-bold text-xs"
                  />
                  <span className="font-bold">%</span>
                  <Button size="sm" variant="primary" onClick={handleSaveCommission} className="rounded-lg text-xs py-1 px-2.5">
                    Save
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => setIsEditingCommission(true)} className="rounded-lg text-xs">
                  Change Rate
                </Button>
              )}
            </div>

            {/* Audit Feedback / Notes */}
            {selectedStore.adminFeedback && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                <span className="font-bold">Latest Administrator Feedback: </span>
                <span>{selectedStore.adminFeedback}</span>
              </div>
            )}

            {/* Decision Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {selectedStore.status !== "APPROVED" && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenDecision(selectedStore, "APPROVE")}
                    className="rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <FiCheckCircle className="mr-1.5" /> Approve Store
                  </Button>
                )}

                {selectedStore.status !== "CHANGES_REQUESTED" && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenDecision(selectedStore, "CHANGES_REQUESTED")}
                    className="rounded-xl font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                  >
                    <FiClock className="mr-1.5" /> Request Changes
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedStore.status !== "SUSPENDED" && selectedStore.status === "APPROVED" && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleOpenDecision(selectedStore, "SUSPEND")}
                    className="rounded-xl font-bold"
                  >
                    <FiShield className="mr-1.5" /> Suspend
                  </Button>
                )}

                {selectedStore.status !== "REJECTED" && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleOpenDecision(selectedStore, "REJECT")}
                    className="rounded-xl font-bold bg-rose-600 text-white"
                  >
                    <FiXCircle className="mr-1.5" /> Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Confirmation Modal with reason feedback input */}
      {targetStore && (
        <DecisionModal
          isOpen={decisionModalOpen}
          onClose={() => setDecisionModalOpen(false)}
          title={
            decisionType === "APPROVE"
              ? "Approve Seller Store"
              : decisionType === "CHANGES_REQUESTED"
              ? "Request Application Changes"
              : decisionType === "SUSPEND"
              ? "Suspend Merchant Store"
              : "Reject Seller Application"
          }
          description={
            decisionType === "APPROVE"
              ? "Approving this store grants the user the SELLER role and unlocks their merchant workspace."
              : decisionType === "CHANGES_REQUESTED"
              ? "Specify the corrections or documents required before re-submission."
              : decisionType === "SUSPEND"
              ? "Suspending this store will immediately hide all their products and block merchant actions."
              : "State the reason for rejecting this merchant registration."
          }
          targetName={`${targetStore.name} (@${targetStore.slug})`}
          decisionType={decisionType}
          requiresReason={decisionType !== "APPROVE"}
          onConfirm={handleConfirmDecision}
          isSubmitting={updateStatus.isPending}
        />
      )}
    </div>
  );
}
