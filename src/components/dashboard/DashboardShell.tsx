"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiShoppingBag,
  FiBox,
  FiTag,
  FiUsers,
  FiStar,
  FiBriefcase,
  FiDollarSign,
  FiArrowLeft,
  FiUser,
  FiHeart,
  FiMapPin,
  FiSettings,
  FiMenu,
  FiX,
  FiBell,
  FiLogOut,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export type DashboardRole = "CUSTOMER" | "SELLER" | "ADMIN";

interface DashboardShellProps {
  role: DashboardRole;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();
  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;

  // Navigation Items per Role
  const customerNav = [
    { href: "/account", label: "Overview", icon: FiGrid },
    { href: "/orders", label: "My Orders", icon: FiShoppingBag },
    { href: "/account/addresses", label: "Saved Addresses", icon: FiMapPin },
    { href: "/account/wishlist", label: "My Wishlist", icon: FiHeart },
    { href: "/account/reviews", label: "My Reviews", icon: FiStar },
    { href: "/account/profile", label: "Profile & Security", icon: FiUser },
  ];

  const sellerNav = [
    { href: "/seller/dashboard", label: "Overview", icon: FiGrid },
    { href: "/seller/dashboard?tab=products", label: "Products & Stock", icon: FiBox },
    { href: "/seller/dashboard?tab=orders", label: "Store Orders", icon: FiShoppingBag },
    { href: "/seller/dashboard?tab=payouts", label: "Earnings & Payouts", icon: FiDollarSign },
    { href: "/seller/dashboard?tab=settings", label: "Store Settings", icon: FiSettings },
  ];

  const adminNav = [
    { href: "/dashboard", label: "Platform Overview", icon: FiGrid },
    { href: "/dashboard/sellers", label: "Sellers & Compliance", icon: FiBriefcase },
    { href: "/dashboard/products", label: "Products Moderation", icon: FiBox },
    { href: "/dashboard/categories", label: "Categories", icon: FiTag },
    { href: "/dashboard/orders", label: "Platform Orders", icon: FiShoppingBag },
    { href: "/dashboard/payouts", label: "Payout Approvals", icon: FiDollarSign },
    { href: "/dashboard/reviews", label: "Reviews", icon: FiStar },
    { href: "/dashboard/users", label: "Users & Roles", icon: FiUsers },
  ];

  const navItems = role === "ADMIN" ? adminNav : role === "SELLER" ? sellerNav : customerNav;

  const roleBadge =
    role === "ADMIN"
      ? { label: "Admin Console", bg: "bg-purple-50 text-purple-700 border-purple-200" }
      : role === "SELLER"
      ? { label: "Seller Workspace", bg: "bg-sky-50 text-[#008ECC] border-sky-200" }
      : { label: "Customer Portal", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Navbar Row */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[#008ECC] flex items-center justify-center text-white font-black text-lg shadow-xs">
                M
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-black tracking-tight text-slate-900">Mega<span className="text-[#008ECC]">Mart</span></span>
                <span className="ml-2 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleBadge.bg}">
                  {roleBadge.label}
                </span>
              </div>
            </Link>
          </div>

          {/* Right Header Actions: Storefront link, Notifications, Profile pill */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#008ECC] transition-colors px-3 py-1.5 rounded-lg hover:bg-sky-50/50"
            >
              <FiArrowLeft className="h-3.5 w-3.5" />
              <span>Visit Storefront</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="View notifications"
              >
                <FiBell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[11px] font-semibold text-[#008ECC]">{unreadCount} unread</span>
                  </div>
                  <div className="mt-2 max-h-72 overflow-y-auto space-y-1.5">
                    {(notifications ?? []).length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">No notifications yet.</p>
                    ) : (
                      notifications?.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.isRead) markRead.mutate(n.id);
                          }}
                          className={`rounded-xl p-2.5 text-xs transition-colors cursor-pointer ${
                            n.isRead ? "bg-white hover:bg-slate-50 text-slate-600" : "bg-[#F0F8FF] text-slate-900 font-semibold"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[11px] font-bold text-slate-800">{n.title}</span>
                            {!n.isRead && <span className="h-2 w-2 rounded-full bg-[#008ECC]" />}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-[#008ECC]/10 flex items-center justify-center font-bold text-xs text-[#008ECC]">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name ?? "User"}</p>
                <p className="text-[10px] font-semibold text-slate-400 capitalize">{user?.role?.toLowerCase() ?? "customer"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar + Workspace */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <aside
            className={`md:block md:sticky md:top-6 md:self-start space-y-4 ${
              mobileOpen ? "block" : "hidden"
            }`}
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-3">
              {/* Role Context Indicator */}
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Active Workspace
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleBadge.bg}`}>
                    {role}
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    href === "/dashboard"
                      ? pathname === "/dashboard"
                      : href === "/account"
                      ? pathname === "/account"
                      : href === "/seller/dashboard"
                      ? pathname === "/seller/dashboard" && !pathname.includes("?")
                      : pathname?.startsWith(href.split("?")[0]);

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#008ECC] text-white shadow-xs shadow-[#008ECC]/30"
                          : "text-slate-600 hover:bg-[#F0F8FF] hover:text-[#008ECC]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Role Switcher Links (for users with multiple permissions) */}
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Quick Switch
                </p>

                {role !== "CUSTOMER" && (
                  <Link
                    href="/account"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FiUser className="h-3.5 w-3.5 text-slate-400" />
                      Customer Account
                    </span>
                    <FiExternalLink className="h-3 w-3 text-slate-400" />
                  </Link>
                )}

                {(user?.role === "SELLER" || user?.role === "ADMIN") && role !== "SELLER" && (
                  <Link
                    href="/seller/dashboard"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FiBox className="h-3.5 w-3.5 text-slate-400" />
                      Seller Console
                    </span>
                    <FiExternalLink className="h-3 w-3 text-slate-400" />
                  </Link>
                )}

                {user?.role === "ADMIN" && role !== "ADMIN" && (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50/50 hover:bg-purple-50 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <FiBriefcase className="h-3.5 w-3.5 text-purple-600" />
                      Admin Console
                    </span>
                    <FiExternalLink className="h-3 w-3 text-purple-400" />
                  </Link>
                )}

                {/* If regular user, invite to seller program */}
                {user?.role === "USER" && (
                  <Link
                    href="/seller/apply"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#008ECC] bg-sky-50/50 hover:bg-sky-50 transition-colors"
                  >
                    <span>Become a MegaMart Seller</span>
                    <span>→</span>
                  </Link>
                )}
              </div>

              {/* Log Out Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogoutOpen(true)}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <FiLogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-xs min-h-[75vh]">
            {children}
          </main>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isLogoutOpen}
        title="Confirm Sign Out"
        description="Are you sure you want to end your current session?"
        confirmLabel="Sign Out"
        onConfirm={() => {
          logout();
          setIsLogoutOpen(false);
        }}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </div>
  );
}
