"use client";

import Link from "next/link";
import { FiHome, FiClock } from "react-icons/fi";

export default function SellerPendingPage() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center py-10 px-4">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 text-center shadow-lg">
        {/* 3D Verification Document & Support Headset Graphic */}
        <div className="relative mb-6 flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/seller_approval_badge.jpg"
            alt="Seller Account Pending Approval"
            className="h-full w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,142,204,0.15)] rounded-2xl"
          />
        </div>

        {/* Status Chip */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700 border border-amber-200 mb-3">
          <FiClock className="text-amber-600 text-xs" />
          <span>Under Administrative Review</span>
        </div>

        {/* Title & Message matching Reference Mockup */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Seller Account Pending Approval
        </h1>

        <p className="mt-3 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
          Your seller account is under review. We&apos;ll notify you once it&apos;s approved by our admin team.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 w-full max-w-xs flex flex-col gap-2">
          <Link
            href="/seller/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#008ECC] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#0073A8] transition-all active:scale-98"
          >
            <span>View Application Details</span>
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <FiHome className="text-base" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
