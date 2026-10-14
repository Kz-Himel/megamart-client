"use client";

import { useState, useMemo } from "react";
import {
  FiDollarSign,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiEye,
} from "react-icons/fi";
import { useAdminPayouts, useProcessPayout } from "@/hooks/useAdmin";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Payout, PayoutStatus } from "@/types/seller.types";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";

export default function AdminPayoutsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: payouts, isLoading, refetch } = useAdminPayouts(filter === "ALL" ? undefined : filter);
  const processPayout = useProcessPayout();

  const filteredPayouts = useMemo(() => {
    return (payouts ?? []).filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        p.id.toLowerCase().includes(q) ||
        (p.store?.name ?? "").toLowerCase().includes(q) ||
        (p.paymentMethod ?? "").toLowerCase().includes(q) ||
        (p.accountInfo ?? "").toLowerCase().includes(q);
      return matchSearch;
    });
  }, [payouts, search]);

  const handleAction = async (payoutId: string, status: PayoutStatus) => {
    try {
      setIsProcessing(true);
      await processPayout.mutateAsync({
        id: payoutId,
        payload: {
          status,
          notes: actionNotes.trim() || undefined,
        },
      });

      toast({
        title: status === "PAID" ? "Payout Approved" : "Payout Rejected",
        description:
          status === "PAID"
            ? "Settlement has been finalized and recorded as paid."
            : "Payout rejected. Requested amount has been refunded back to store balance.",
        variant: status === "PAID" ? "success" : "info",
      });

      setSelectedPayout(null);
      setActionNotes("");
      refetch();
    } catch (err: unknown) {
      toast({
        title: "Processing Error",
        description: err instanceof Error ? err.message : "Failed to process payout.",
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = (payouts ?? []).filter((p) => p.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <DashboardHeader
        badge="Financial Settlements"
        title="Seller Payout Approvals"
        subtitle="Review, approve, and finalize withdrawal requests from approved merchant store balances."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Payouts" }]}
      />

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "All Requests" },
            { key: "PENDING", label: `Pending Reviews ${pendingCount > 0 ? `(${pendingCount})` : ""}` },
            { key: "PAID", label: "Paid & Settled" },
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
            placeholder="Search stores or accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner label="Loading payout queue..." />
        </div>
      ) : filteredPayouts.length === 0 ? (
        <EmptyState
          icon={<FiDollarSign className="text-4xl text-slate-300" />}
          title="No Payout Requests Found"
          description={filter === "PENDING" ? "There are no pending withdrawal requests to settle." : "No payouts match the selected filter."}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Payout Ref</th>
                <th className="py-3 px-4">Merchant Store</th>
                <th className="py-3 px-4">Requested On</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method & Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    #{p.id.slice(0, 8)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 line-clamp-1">{p.store?.name ?? "Merchant Store"}</p>
                    <p className="font-mono text-[10px] text-[#008ECC]">@{p.store?.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(p.createdAt)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap text-sm">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <p className="font-semibold text-slate-800">{p.paymentMethod ?? "Bank Wire"}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{p.accountInfo ?? "—"}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedPayout(p);
                        setActionNotes(p.notes || "");
                      }}
                      className="rounded-xl text-[11px] font-bold"
                    >
                      <FiEye className="mr-1" /> Process
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Process Payout Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#008ECC]">Settlement Request</span>
                <h3 className="text-lg font-bold text-slate-900">Process Payout #{selectedPayout.id.slice(0, 8)}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayout(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Merchant Store:</span>
                <span className="font-bold text-slate-900">{selectedPayout.store?.name} (@{selectedPayout.store?.slug})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Withdrawal Amount:</span>
                <span className="font-black text-slate-900 text-sm">{formatCurrency(selectedPayout.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payment Route:</span>
                <span className="font-bold text-slate-800">{selectedPayout.paymentMethod ?? "Bank Transfer"}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-500 font-medium">Account Details:</span>
                <span className="font-mono text-slate-800 text-right max-w-xs">{selectedPayout.accountInfo ?? "—"}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Transaction Reference / Administrative Notes
              </label>
              <textarea
                rows={2}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="e.g. Wire transfer reference #WT-894103..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPayout(null)}
                disabled={isProcessing}
                className="rounded-xl text-slate-600"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                {selectedPayout.status !== "REJECTED" && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleAction(selectedPayout.id, "REJECTED")}
                    className="rounded-xl font-bold bg-rose-600 text-white"
                  >
                    <FiXCircle className="mr-1" /> Reject & Refund
                  </Button>
                )}

                {selectedPayout.status !== "PAID" && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleAction(selectedPayout.id, "PAID")}
                    className="rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <FiCheckCircle className="mr-1" /> Approve & Mark Paid
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
