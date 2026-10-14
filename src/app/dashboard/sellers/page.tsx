"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEye,
  FiClock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFilter,
} from "react-icons/fi";
import { Button } from "@/components/ui/Button";

interface SellerApplication {
  id: string;
  storeName: string;
  category: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  description: string;
}

const DEFAULT_APPLICATIONS: SellerApplication[] = [
  {
    id: "app-101",
    storeName: "Apex Audio Gear",
    category: "Electronics",
    ownerName: "Marcus Vance",
    email: "marcus@apexaudio.com",
    phone: "+1 (555) 382-9012",
    city: "Austin, TX",
    status: "PENDING",
    submittedAt: "2026-10-12T14:30:00Z",
    description: "Specialized in audiophile-grade studio headphones, wireless DACs, and high-fidelity sound monitors.",
  },
  {
    id: "app-102",
    storeName: "Urban Threads Collective",
    category: "Fashion",
    ownerName: "Elena Rostova",
    email: "elena@urbanthreads.io",
    phone: "+1 (555) 749-1120",
    city: "Seattle, WA",
    status: "APPROVED",
    submittedAt: "2026-10-08T09:15:00Z",
    description: "Sustainable streetwear and organic minimalist apparel made with recycled textiles.",
  },
  {
    id: "app-103",
    storeName: "Zenith Home Essentials",
    category: "Home & Living",
    ownerName: "Devon Clark",
    email: "d.clark@zenithliving.com",
    phone: "+1 (555) 602-8841",
    city: "Denver, CO",
    status: "APPROVED",
    submittedAt: "2026-10-05T18:40:00Z",
    description: "Nordic furniture, ergonomic work-from-home standing desks, and ambient smart lighting.",
  },
  {
    id: "app-104",
    storeName: "BioGlow Skincare Co.",
    category: "Beauty & Health",
    ownerName: "Chloe Nguyen",
    email: "chloe@bioglow.shop",
    phone: "+1 (555) 914-3320",
    city: "San Francisco, CA",
    status: "PENDING",
    submittedAt: "2026-10-14T08:20:00Z",
    description: "Dermatologist-tested, cruelty-free botanical serums and mineral sunscreen.",
  },
  {
    id: "app-105",
    storeName: "TurboGadget Liquidators",
    category: "Electronics",
    ownerName: "Gavin Ross",
    email: "gavin@turbogadget.biz",
    phone: "+1 (555) 123-9999",
    city: "Miami, FL",
    status: "REJECTED",
    submittedAt: "2026-09-28T11:00:00Z",
    description: "Bulk refurbished mobile accessories with inconsistent supplier provenance.",
  },
];

export default function AdminSellersPage() {
  const [applications, setApplications] = useState<SellerApplication[]>(DEFAULT_APPLICATIONS);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(null);

  useEffect(() => {
    // Check if user submitted an application via /seller/apply
    try {
      const stored = localStorage.getItem("megamart_seller_app");
      if (stored) {
        const parsed = JSON.parse(stored);
        setApplications((prev) => {
          if (prev.some((p) => p.email === parsed.email || p.storeName === parsed.storeName)) {
            return prev;
          }
          return [
            {
              id: "app-" + Date.now(),
              storeName: parsed.storeName || "New Merchant Store",
              category: parsed.category || "General",
              ownerName: parsed.ownerName || "Merchant Applicant",
              email: parsed.email || "applicant@example.com",
              phone: parsed.phone || "N/A",
              city: parsed.city || "Online",
              status: "PENDING",
              submittedAt: new Date().toISOString(),
              description: parsed.description || "Vendor registration through onboarding portal.",
            },
            ...prev,
          ];
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const updateStatus = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    if (selectedApp?.id === id) {
      setSelectedApp((curr) => (curr ? { ...curr, status: newStatus } : null));
    }
  };

  const filtered = applications.filter((app) => {
    const matchesFilter = filter === "ALL" || app.status === filter;
    const matchesSearch =
      app.storeName.toLowerCase().includes(search.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#EBF5FC] px-2.5 py-0.5 text-xs font-bold text-[#008ECC]">
              Vendor Management
            </span>
            <span className="text-xs text-slate-400">• Multi-Vendor Verification</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
            Sellers & Store Approvals
          </h1>
          <p className="text-xs text-slate-500">
            Review onboarding applications, verify merchant credentials, and manage active store status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
            <FiClock className="w-3.5 h-3.5" />
            <span>{pendingCount} Pending Reviews</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab === "ALL" ? "All Sellers" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search store, owner or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] transition"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Store & Category</th>
                <th className="px-5 py-3.5">Owner / Contact</th>
                <th className="px-5 py-3.5">City</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No vendor applications found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EBF5FC] text-[#008ECC] font-bold flex items-center justify-center text-xs">
                          {app.storeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{app.storeName}</p>
                          <span className="inline-block mt-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {app.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{app.ownerName}</p>
                      <p className="text-slate-400 text-[11px]">{app.email}</p>
                    </td>

                    <td className="px-5 py-4 text-slate-600 font-medium">
                      {app.city}
                    </td>

                    <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          app.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : app.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                            : "bg-rose-50 text-rose-600 border border-rose-200/50"
                        }`}
                      >
                        {app.status === "APPROVED" && <FiCheckCircle className="w-3 h-3" />}
                        {app.status === "PENDING" && <FiClock className="w-3 h-3" />}
                        {app.status === "REJECTED" && <FiXCircle className="w-3 h-3" />}
                        {app.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                          title="View Application"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </button>
                        {app.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => updateStatus(app.id, "APPROVED")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, "REJECTED")}
                              className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 font-bold text-[11px] hover:bg-rose-50 transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {app.status === "APPROVED" && (
                          <button
                            onClick={() => updateStatus(app.id, "REJECTED")}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-semibold hover:bg-rose-50 hover:text-rose-600 transition"
                          >
                            Suspend
                          </button>
                        )}
                        {app.status === "REJECTED" && (
                          <button
                            onClick={() => updateStatus(app.id, "APPROVED")}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-semibold hover:bg-emerald-50 hover:text-emerald-600 transition"
                          >
                            Re-approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedApp.storeName}</h3>
                <p className="text-xs text-slate-500">Applicant: {selectedApp.ownerName}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-500">Store Category</span>
                <p className="text-slate-900 font-semibold">{selectedApp.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-bold text-slate-500">Email</span>
                  <p className="text-slate-900 font-medium">{selectedApp.email}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Phone</span>
                  <p className="text-slate-900 font-medium">{selectedApp.phone}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500">Business Location</span>
                <p className="text-slate-900 font-medium">{selectedApp.city}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500">Store Pitch & Catalog Description</span>
                <p className="mt-1 rounded-xl bg-slate-50 p-3 text-slate-700 leading-relaxed">
                  {selectedApp.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <Button size="sm" variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
              {selectedApp.status !== "APPROVED" && (
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  onClick={() => updateStatus(selectedApp.id, "APPROVED")}
                >
                  Approve Application
                </Button>
              )}
              {selectedApp.status === "APPROVED" && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => updateStatus(selectedApp.id, "REJECTED")}
                >
                  Suspend Store
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
