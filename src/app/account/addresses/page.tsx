"use client";

import { useState, useEffect } from "react";
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiHome, FiBriefcase } from "react-icons/fi";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const STORAGE_KEY = "megamart_saved_addresses";

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    type: "home",
    fullName: "John Customer",
    phone: "+1 (555) 019-2834",
    streetAddress: "742 Evergreen Terrace, Apt 4B",
    city: "Austin",
    postalCode: "78701",
    country: "United States",
    isDefault: true,
  },
];

export default function CustomerAddressesPage() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formType, setFormType] = useState<"home" | "work" | "other">("home");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formStreet, setFormStreet] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formPostal, setFormPostal] = useState("");
  const [formCountry, setFormCountry] = useState("United States");
  const [formDefault, setFormDefault] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAddresses(JSON.parse(stored));
      } else {
        setAddresses(DEFAULT_ADDRESSES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADDRESSES));
      }
    } catch {
      setAddresses(DEFAULT_ADDRESSES);
    }
  }, []);

  const saveToStorage = (updated: Address[]) => {
    setAddresses(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist addresses:", e);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormType("home");
    setFormName("");
    setFormPhone("");
    setFormStreet("");
    setFormCity("");
    setFormPostal("");
    setFormCountry("United States");
    setFormDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormType(addr.type);
    setFormName(addr.fullName);
    setFormPhone(addr.phone);
    setFormStreet(addr.streetAddress);
    setFormCity(addr.city);
    setFormPostal(addr.postalCode);
    setFormCountry(addr.country);
    setFormDefault(addr.isDefault);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    saveToStorage(updated);
    toast({
      title: "Address Removed",
      description: "Saved delivery address has been deleted.",
      variant: "info",
    });
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    saveToStorage(updated);
    toast({
      title: "Default Address Updated",
      description: "This address will be selected automatically during checkout.",
      variant: "success",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formStreet || !formCity) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in recipient name, phone, street, and city.",
        variant: "error",
      });
      return;
    }

    let updated: Address[];
    if (editingId) {
      updated = addresses.map((a) => {
        if (a.id === editingId) {
          return {
            ...a,
            type: formType,
            fullName: formName,
            phone: formPhone,
            streetAddress: formStreet,
            city: formCity,
            postalCode: formPostal,
            country: formCountry,
            isDefault: formDefault,
          };
        }
        return formDefault ? { ...a, isDefault: false } : a;
      });
      toast({
        title: "Address Updated",
        description: "Delivery address details saved.",
        variant: "success",
      });
    } else {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        type: formType,
        fullName: formName,
        phone: formPhone,
        streetAddress: formStreet,
        city: formCity,
        postalCode: formPostal,
        country: formCountry,
        isDefault: formDefault || addresses.length === 0,
      };
      updated = formDefault ? addresses.map((a) => ({ ...a, isDefault: false })) : [...addresses];
      updated.push(newAddr);
      toast({
        title: "Address Added",
        description: "New shipping address has been saved.",
        variant: "success",
      });
    }

    saveToStorage(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        badge="Address Book"
        title="Saved Addresses"
        subtitle="Manage shipping locations for fast, one-click checkout across MegaMart."
        breadcrumbs={[{ label: "Account", href: "/account" }, { label: "Addresses" }]}
        actions={
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            className="rounded-xl font-bold bg-[#008ECC] text-white"
          >
            <FiPlus className="mr-1.5 h-4 w-4" /> Add New Address
          </Button>
        }
      />

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-[#008ECC] text-2xl mb-3">
            <FiMapPin />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Saved Addresses</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Save your home or office address to speed up order checkouts.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            className="mt-4 rounded-xl font-bold bg-[#008ECC] text-white"
          >
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative rounded-2xl border p-5 transition-all shadow-xs ${
                addr.isDefault
                  ? "border-sky-300 bg-[#F0F8FF]/30 shadow-sky-100/50"
                  : "border-slate-200/80 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-[#008ECC] text-xs">
                    {addr.type === "work" ? <FiBriefcase /> : <FiHome />}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
                      <FiCheck className="w-2.5 h-2.5" /> Default Shipping
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#008ECC] hover:bg-sky-50 transition-colors"
                    title="Edit Address"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Address"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p className="font-bold text-slate-900 text-sm">{addr.fullName}</p>
                <p>{addr.streetAddress}</p>
                <p>
                  {addr.city}, {addr.postalCode} • {addr.country}
                </p>
                <p className="text-[11px] text-slate-500 pt-1">Phone: {addr.phone}</p>
              </div>

              {!addr.isDefault && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-[#008ECC] hover:underline"
                  >
                    Set as Default Shipping Address
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? "Edit Address" : "Add New Delivery Address"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Type selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Address Type</label>
                <div className="flex gap-2">
                  {(["home", "work", "other"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormType(t)}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold capitalize border transition-all ${
                        formType === t
                          ? "bg-[#008ECC] text-white border-[#008ECC]"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Full recipient name"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  placeholder="Street name, apartment, suite, unit"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="City"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formPostal}
                    onChange={(e) => setFormPostal(e.target.value)}
                    placeholder="ZIP / Postal"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Country</label>
                  <input
                    type="text"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#008ECC] focus:ring-1 focus:ring-[#008ECC] focus:outline-hidden"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formDefault}
                  onChange={(e) => setFormDefault(e.target.checked)}
                  className="rounded border-slate-300 text-[#008ECC] focus:ring-[#008ECC]"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Set as default shipping address for future orders
                </span>
              </label>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
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
                  {editingId ? "Save Changes" : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
