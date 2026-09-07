"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiTag, FiBox, FiShoppingCart, FiStar, FiUsers } from "react-icons/fi";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: FiGrid },
  { href: "/dashboard/products", label: "Products", icon: FiBox },
  { href: "/dashboard/categories", label: "Categories", icon: FiTag },
  { href: "/dashboard/orders", label: "Orders", icon: FiShoppingCart },
  { href: "/dashboard/reviews", label: "Reviews", icon: FiStar },
  { href: "/dashboard/users", label: "Users", icon: FiUsers },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-[#F3F9FB] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <nav className="flex gap-1.5 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:flex-col md:overflow-visible">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(href);
              
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#008ECC] text-white shadow-sm"
                      : "text-gray-600 hover:bg-[#F3F9FB] hover:text-[#008ECC]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        
        <main className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}