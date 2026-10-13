"use client";

import { FiCreditCard, FiCheckCircle, FiShield, FiInfo } from "react-icons/fi";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">Payment Methods</h1>
        <p className="mt-1 text-xs text-slate-500">
          Manage your checkout payment options and security preferences
        </p>
      </div>

      <div className="space-y-4">
        {/* Cash on Delivery Card (Active) */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-lg">
                💵
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    Cash on Delivery (COD)
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                    Default & Active
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-600">
                  Pay securely with exact cash when your package is delivered to your doorstep.
                </p>
              </div>
            </div>
            <FiCheckCircle className="text-emerald-600 text-xl shrink-0" />
          </div>

          <div className="mt-4 flex flex-wrap gap-4 pt-3 border-t border-emerald-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <FiShield className="text-emerald-600" />
              <span>Zero upfront transaction risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Inspected courier handover</span>
            </div>
          </div>
        </div>

        {/* Online Cards (Sandbox Boundary) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-700 text-lg">
                <FiCreditCard />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    Credit / Debit Cards & Online Gateway
                  </h3>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                    Integration Boundary
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Visa, Mastercard, American Express, and mobile wallets.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50/80 p-3 text-xs text-amber-900 border border-amber-200/60">
            <FiInfo className="text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Merchant Gateway Notice:</strong> Live card processing is in sandbox/boundary mode.
              Cash on Delivery (COD) is active and recommended for all orders.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}