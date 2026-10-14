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
  FiUploadCloud,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { useApplySeller } from "@/hooks/useSeller";
import { uploadApi } from "@/lib/api/upload.api";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function SellerApplyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const applySeller = useApplySeller();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [description, setDescription] = useState("");
  const [taxId, setTaxId] = useState("");
  const [verificationDoc, setVerificationDoc] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Auto-generate slug when name changes if user hasn't typed a custom slug
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingDoc(true);
      const url = await uploadApi.uploadDocument(file);
      setVerificationDoc(url);
      toast({
        title: "Document Uploaded",
        description: "Your business verification file has been uploaded securely.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Upload Failed",
        description: "Please upload a valid document (PDF, JPG, or PNG under 10MB).",
        variant: "error",
      });
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast({
        title: "Policy Agreement Required",
        description: "Please review and accept the MegaMart Seller Terms to proceed.",
        variant: "error",
      });
      return;
    }

    try {
      await applySeller.mutateAsync({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        category,
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        taxId: taxId.trim() || undefined,
        verificationDoc: verificationDoc || undefined,
        termsAccepted: true,
      });

      toast({
        title: "Application Submitted",
        description: "Your merchant application is under compliance review.",
        variant: "success",
      });

      router.push("/seller/dashboard");
    } catch (err: unknown) {
      toast({
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "Could not submit seller application.",
        variant: "error",
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-6 px-4 space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Become a Seller" },
        ]}
      />

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#008ECC] bg-[#F0F8FF] px-2.5 py-1 rounded-md border border-sky-100">
            Merchant Onboarding
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Apply to Sell on MegaMart
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Join our curated multi-vendor marketplace. Manage catalog listings, shipping fulfillment, and automated bank payouts.
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
          {/* Store Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Store / Brand Name *</label>
              <div className="relative mt-1">
                <FiBriefcase className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Apex Audio Gear"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Unique Store Handle / Slug *</label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">@</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="apex-audio"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-8 pr-3 text-xs font-mono text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Category & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Primary Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 bg-white focus:border-[#008ECC] focus:outline-hidden"
              >
                <option value="Electronics">Electronics & Tech</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Beauty & Health">Beauty & Health</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Groceries">Daily Groceries</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Store Profile Summary *</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-fidelity audio monitors and premium studio headphones..."
                className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Business Support Email *</label>
              <div className="relative mt-1">
                <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@brand.com"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Business Phone *</label>
              <div className="relative mt-1">
                <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Physical Address */}
          <div>
            <label className="text-xs font-bold text-slate-700">Physical Business Address *</label>
            <div className="relative mt-1">
              <FiMapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Suite 400, 100 Innovation Way"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Austin"
                className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Country *</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Business Verification & Tax ID */}
          <div className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 sm:p-5 space-y-3">
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FiFileText className="text-[#008ECC]" /> Business Verification & Tax Documents
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Tax ID / Business Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. TX-98745612"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:border-[#008ECC] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Supporting Verification Document</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Document URL or upload"
                    value={verificationDoc}
                    onChange={(e) => setVerificationDoc(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:border-[#008ECC] focus:outline-hidden"
                  />
                  <label className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-white bg-slate-100 cursor-pointer flex items-center gap-1 shrink-0">
                    <FiUploadCloud className="w-4 h-4 text-[#008ECC]" />
                    <span>{isUploadingDoc ? "..." : "Upload"}</span>
                    <input type="file" accept=".pdf,image/*" onChange={handleDocumentUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Sensitive verification documents are stored securely and reviewed exclusively by compliance administrators.
            </p>
          </div>

          {/* Terms Agreement */}
          <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#008ECC] focus:ring-[#008ECC]"
            />
            <span className="text-xs text-slate-600 leading-normal">
              I agree to the MegaMart Marketplace Seller Agreement, standard 10% platform commission policy,
              and confirm that all business registration details provided are accurate.
            </span>
          </label>

          <div className="pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={applySeller.isPending}
              disabled={!isAuthenticated}
              className="w-full rounded-xl font-bold bg-[#008ECC] text-white shadow-md shadow-[#008ECC]/20 text-sm"
            >
              Submit Application for Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
