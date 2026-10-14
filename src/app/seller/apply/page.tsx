"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function SellerApplyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [storeName, setStoreName] = useState("");
  const [storeCategory, setStoreCategory] = useState("Electronics");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate safe local persistence of application state
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "megamart_seller_application",
          JSON.stringify({
            userId: user?.id,
            storeName,
            storeCategory,
            phone,
            address,
            description,
            businessId,
            status: "PENDING",
            submittedAt: new Date().toISOString(),
          })
        );
      }
      router.push("/seller/pending");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-4 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Become a Seller" },
        ]}
      />

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#008ECC]">
            Merchant Program
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Apply to Sell on MegaMart
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Reach thousands of buyers, manage your catalog, and grow your e-commerce business.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-xs text-sky-800 flex items-center justify-between">
            <span>Please log in to link your store application to your user account.</span>
            <Link
              href="/login?redirect=/seller/apply"
              className="font-bold text-[#008ECC] underline"
            >
              Sign In
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Store / Brand Name</label>
              <div className="relative mt-1">
                <FiBriefcase className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Apex Tech Essentials"
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Primary Category</label>
              <select
                value={storeCategory}
                onChange={(e) => setStoreCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 px-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white cursor-pointer"
              >
                <option value="Electronics">Electronics & Gadgets</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Beauty & Health">Beauty & Health</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Groceries">Groceries & Essentials</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Business Phone Number</label>
              <div className="relative mt-1">
                <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Tax / Business Registration ID</label>
              <div className="relative mt-1">
                <FiFileText className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  required
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  placeholder="e.g. TAX-894729-BD"
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Physical Business Address</label>
            <div className="relative mt-1">
              <FiMapPin className="pointer-events-none absolute left-3.5 top-3 text-slate-400 text-sm" />
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, city, state, postal code"
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Store Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about the products and brands you specialize in..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#008ECC] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#0073A8] transition-all active:scale-98 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Submitting Application..." : "Submit Seller Application"}</span>
              <FiArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
