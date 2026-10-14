"use client";

import { useState } from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiShield } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

export type DecisionType = "APPROVE" | "REJECT" | "CHANGES_REQUESTED" | "SUSPEND";

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  targetName: string;
  decisionType: DecisionType;
  requiresReason?: boolean;
  onConfirm: (reason: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function DecisionModal({
  isOpen,
  onClose,
  title,
  description,
  targetName,
  decisionType,
  requiresReason = false,
  onConfirm,
  isSubmitting = false,
}: DecisionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (requiresReason && !reason.trim()) {
      setError("Please provide a justification reason for this administrative decision.");
      return;
    }
    setError("");
    await onConfirm(reason.trim());
    setReason("");
  };

  const getTheme = () => {
    switch (decisionType) {
      case "APPROVE":
        return {
          icon: <FiCheckCircle className="h-6 w-6 text-emerald-600" />,
          bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
          btnVariant: "primary" as const,
          btnText: "Confirm Approval",
        };
      case "CHANGES_REQUESTED":
        return {
          icon: <FiClock className="h-6 w-6 text-amber-600" />,
          bg: "bg-amber-50 text-amber-600 border-amber-100",
          btnVariant: "secondary" as const,
          btnText: "Request Changes",
        };
      case "SUSPEND":
        return {
          icon: <FiShield className="h-6 w-6 text-rose-600" />,
          bg: "bg-rose-50 text-rose-600 border-rose-100",
          btnVariant: "danger" as const,
          btnText: "Suspend Store",
        };
      case "REJECT":
      default:
        return {
          icon: <FiXCircle className="h-6 w-6 text-rose-600" />,
          bg: "bg-rose-50 text-rose-600 border-rose-100",
          btnVariant: "danger" as const,
          btnText: "Confirm Rejection",
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-start gap-3.5">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${theme.bg}`}>
            {theme.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs">
          <span className="font-semibold text-slate-700">Target: </span>
          <span className="font-bold text-slate-900">{targetName}</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Administrative Decision Notes / Feedback {requiresReason ? <span className="text-rose-500">*</span> : "(Optional)"}
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            rows={3}
            placeholder={
              decisionType === "CHANGES_REQUESTED"
                ? "Describe what the seller needs to correct or upload..."
                : decisionType === "SUSPEND"
                ? "State the compliance violation or policy reason for suspension..."
                : "Add notes for audit records and email notification..."
            }
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
          />
          {error && <p className="text-[11px] font-semibold text-rose-600">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl text-slate-600"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={theme.btnVariant}
            size="sm"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            className="rounded-xl font-bold shadow-xs"
          >
            {theme.btnText}
          </Button>
        </div>
      </div>
    </div>
  );
}
