"use client";

import { FiTruck, FiShield, FiRotateCcw, FiHeadphones } from "react-icons/fi";

const FEATURES = [
  {
    icon: FiTruck,
    title: "Free & Fast Delivery",
    description: "Free shipping on orders over $50",
  },
  {
    icon: FiShield,
    title: "100% Secure Payment",
    description: "Guaranteed safe & secure checkout",
  },
  {
    icon: FiRotateCcw,
    title: "Easy Return Policy",
    description: "30-day hassle free money back",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Dedicated Support",
    description: "Anytime support via chat or email",
  },
];

export function ValueProposition() {
  return (
    <section className="w-full py-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Icon className="text-2xl" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}