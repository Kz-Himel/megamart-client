"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiHelpCircle,
} from "react-icons/fi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

const FAQS = [
  {
    q: "How do I track my shipment?",
    a: "Once an order is confirmed, go to 'My Orders' in your account menu to see live courier tracking updates from dispatch to delivery.",
  },
  {
    q: "What is your refund and return policy?",
    a: "MegaMart offers a 30-day hassle-free return window for all unopened and verified items. Returns are processed within 48 hours of receipt.",
  },
  {
    q: "How can I register as a seller on MegaMart?",
    a: "Simply click 'Become a Seller' in the navigation bar or footer, complete the verification form with your business details, and our merchant team reviews applications within 24 hours.",
  },
  {
    q: "Are my credit card and personal details secure?",
    a: "Yes. All transactions are protected by bank-level 256-bit SSL encryption and tokenized payment gateways. We never store raw credit card numbers.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Order Inquiry",
    orderId: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "Order Inquiry", orderId: "", message: "" });
    }, 800);
  };

  return (
    <div className="py-2 space-y-10">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="inline-flex items-center rounded-full bg-[#EBF5FC] px-2.5 py-0.5 text-xs font-bold text-[#008ECC]">
          24/7 Customer Care
        </span>
        <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          We&apos;re Here to Help You
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
          Have an inquiry regarding an order, seller registration, or technical feedback? Send us a message or reach our direct telephone hotline.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F0F8FF] text-[#008ECC] flex items-center justify-center text-lg mb-3">
            <FiPhone />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Telephone Hotline</h3>
          <p className="text-xs text-[#008ECC] font-semibold mt-1">+1 (800) 555-MEGA</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Toll-free customer line</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F0F8FF] text-[#008ECC] flex items-center justify-center text-lg mb-3">
            <FiMail />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Email Support</h3>
          <p className="text-xs text-[#008ECC] font-semibold mt-1">support@megamart.com</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Response within 2 hours</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F0F8FF] text-[#008ECC] flex items-center justify-center text-lg mb-3">
            <FiClock />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Live Support Hours</h3>
          <p className="text-xs text-slate-700 font-semibold mt-1">Monday – Sunday</p>
          <p className="text-[11px] text-slate-400 mt-0.5">24 Hours / 7 Days a week</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F0F8FF] text-[#008ECC] flex items-center justify-center text-lg mb-3">
            <FiMapPin />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Global Headquarters</h3>
          <p className="text-xs text-slate-700 font-semibold mt-1">100 Innovation Blvd</p>
          <p className="text-[11px] text-slate-400 mt-0.5">San Francisco, CA 94105</p>
        </div>
      </div>

      {/* Contact Form and FAQ split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Send an Inquiry</h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill out the details below and an account specialist will follow up shortly.
          </p>

          {submitted && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs flex items-center gap-2">
              <FiCheckCircle className="text-emerald-600 text-base flex-shrink-0" />
              <span>Thank you! Your message has been received. Our team will contact you within 2 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition"
                >
                  <option>Order Inquiry</option>
                  <option>Seller & Merchant Support</option>
                  <option>Returns & Exchanges</option>
                  <option>Billing & Payment</option>
                  <option>Platform Bug or Feedback</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. #ORD-8491"
                  value={form.orderId}
                  onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your question or issue in detail..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#008ECC] text-white font-bold text-xs px-6 py-2.5 hover:bg-[#007BB5] transition shadow-sm"
            >
              <FiSend className="mr-1.5" />
              <span>{loading ? "Sending Message..." : "Submit Inquiry"}</span>
            </Button>
          </form>
        </div>

        {/* FAQs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#008ECC]/10 text-[#008ECC] flex items-center justify-center">
                <FiHelpCircle />
              </div>
              <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-4 text-xs">
              {FAQS.map((faq, i) => (
                <div key={i} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <p className="font-bold text-slate-800">{faq.q}</p>
                  <p className="mt-1 text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
