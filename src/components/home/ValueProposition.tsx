"use client";

import { FiTruck, FiShield, FiRotateCcw, FiHeadphones } from "react-icons/fi";

const FEATURES = [
  {
    icon: FiTruck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: FiShield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Support",
    description: "We're here to help",
  },
  {
    icon: FiRotateCcw,
    title: "Easy Returns",
    description: "Hassle-free returns",
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