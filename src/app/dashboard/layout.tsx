"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiTag, FiBox, FiShoppingCart, FiStar, FiUsers, FiBriefcase, FiArrowLeft } from "react-icons/fi";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: FiGrid },
  { href: "/dashboard/products", label: "Products", icon: FiBox },
  { href: "/dashboard/categories", label: "Categories", icon: FiTag },
  { href: "/dashboard/orders", label: "Orders", icon: FiShoppingCart },
  { href: "/dashboard/sellers", label: "Sellers", icon: FiBriefcase },
  { href: "/dashboard/reviews", label: "Reviews", icon: FiStar },
  { href: "/dashboard/users", label: "Users", icon: FiUsers },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5 px-3 py-2 mb-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#008ECC] flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">MegaMart Admin</p>
                <p className="text-[11px] font-medium text-slate-400">Store Management</p>
              </div>
            </div>

            <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(href);
                
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                      active
                        ? "bg-[#008ECC] text-white shadow-sm shadow-[#008ECC]/20"
                        : "text-slate-600 hover:bg-[#F0F8FF] hover:text-[#008ECC]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-[#008ECC] rounded-lg hover:bg-slate-50 transition"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </Link>
            </div>
          </div>
        </aside>
        
        <main className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}