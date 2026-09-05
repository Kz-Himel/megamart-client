"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  FiX,
  FiSearch,
  FiList,
  FiLogOut,
  FiShoppingCart,
  FiUser,
  FiTruck,
  FiMapPin,
} from "react-icons/fi";
import { PiSealPercentBold, PiTextAlignLeftBold } from "react-icons/pi";
import { useAuth } from "@/lib/auth/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { CategoryNav } from "./CategoryNav";

function initials(name?: string) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: orders } = useOrders({ enabled: isAuthenticated });

  const orderCount = isAuthenticated ? orders?.length ?? 0 : 0;
  const ordersLabel = `My orders${isAuthenticated ? ` (${orderCount})` : ""}`;
  const profileHref = isAdmin ? "/dashboard" : "/account/profile";
  const profileLabel = isAdmin ? "Admin dashboard" : "My profile";

  // Row 1 and Row 3 collapse on scroll down, expand on scroll up.
  // Row 2 (logo/search/account) is separately sticky and never hides.
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setIsHidden(false);
      } else if (currentScrollY > lastScrollY.current) {
        setIsHidden(true); // scrolling down
      } else {
        setIsHidden(false); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = searchValue.trim();
      if (query) {
        router.push(`/products?search=${encodeURIComponent(query)}`);
      } else {
        router.push("/products");
      }
      setIsMenuOpen(false);
    },
    [searchValue, router]
  );

  return (
    <header className="relative z-50 bg-white">
      {/* Row 1 — utility bar. Collapses on scroll down, expands on scroll up —
          Row 2 below stays put and pinned. */}
      <div
        className={`hidden overflow-hidden bg-[#F6F6F6] transition-all duration-300 sm:grid ${
          isHidden ? "sm:grid-rows-[0fr]" : "sm:grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-600 sm:px-6">
            <span>Welcome to Ankara!</span>
            <div className="flex items-center gap-3">
              {/* Static/decorative — no delivery-location feature exists in the backend,
                  so this isn't a real picker, just the reference's visual element. */}
              <span className="flex items-center gap-1.5 text-slate-600">
                <FiMapPin className="text-sm text-accent" aria-hidden="true" />
                Deliver to <strong className="font-semibold text-slate-800">423651</strong>
              </span>
              <span className="h-3.5 w-px bg-slate-300" aria-hidden="true" />
              <Link
                href="/orders"
                className="flex items-center gap-1.5 font-medium text-slate-600 transition-colors hover:text-accent"
              >
                <FiTruck className="text-sm text-accent" aria-hidden="true" />
                Track your order
              </Link>
              <span className="h-3.5 w-px bg-slate-300" aria-hidden="true" />
              {/* Static/decorative — no offers/promotions feature exists yet. */}
              <span className="flex items-center gap-1.5 text-slate-600">
                <PiSealPercentBold className="text-sm text-accent" aria-hidden="true" />
                All Offers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 — logo, search, account. Always pinned — never hides. */}
      <div className="sticky top-0 z-40 border-b border-border bg-white">
        <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              className="p-1 text-accent md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX className="text-2xl" aria-hidden="true" /> : <PiTextAlignLeftBold className="text-2xl" aria-hidden="true" />}
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-0.5"
            >
              <PiTextAlignLeftBold className="hidden text-2xl text-accent md:block" aria-hidden="true" />
              <span className="font-display text-lg font-bold tracking-tight text-accent">
                Ankara
              </span>
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 max-w-xl items-center mx-4 md:flex"
            role="search"
          >
            <div className="flex w-full items-center overflow-hidden rounded-full border border-border bg-[#F6F6F6] px-4 transition-all focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/10">
              <FiSearch className="text-sm text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products and more..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Search products"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="flex flex-shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-accent focus-visible:outline-none"
              >
                <FiList className="text-lg" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="ml-auto flex flex-shrink-0 items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href={profileHref}
                  aria-label={profileLabel}
                  className="group flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent ring-2 ring-accent/20 transition-all group-hover:ring-accent/40">
                    {initials(user?.name)}
                  </span>
                  <span className="hidden lg:inline">{profileLabel}</span>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  onPress={logout}
                  className="text-slate-400 hover:text-rose-600 min-w-8 h-8 rounded-full"
                  aria-label="Log out"
                >
                  <FiLogOut className="text-sm" aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-accent sm:flex"
              >
                <FiUser className="text-base" aria-hidden="true" />
                Sign Up/Sign In
              </Link>
            )}

            <span className="hidden h-4 w-px bg-slate-300 sm:block" aria-hidden="true" />

            <Link
              href="/orders"
              aria-label={ordersLabel}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1 py-0.5"
            >
              <FiShoppingCart className="text-base text-accent" aria-hidden="true" />
              <span className="hidden lg:inline">{ordersLabel}</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Row 3 — category pill nav (real categories). Collapses with Row 1,
          Row 2 above stays pinned regardless. */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          isHidden ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <Suspense fallback={null}>
            <CategoryNav variant="desktop" />
          </Suspense>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center mb-2" role="search">
                <div className="flex w-full items-center overflow-hidden rounded-full border border-border bg-[#F6F6F6] pl-3 pr-1">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent py-2 text-xs outline-none text-slate-800"
                    aria-label="Search products"
                  />
                  <button type="submit" aria-label="Submit search" className="rounded-full bg-accent p-1.5 text-accent-foreground">
                    <FiSearch className="text-xs" aria-hidden="true" />
                  </button>
                </div>
              </form>

              <Suspense fallback={null}>
                <CategoryNav variant="mobile" onNavigate={() => setIsMenuOpen(false)} />
              </Suspense>

              <Link
                href="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 py-1.5 border-t border-border pt-3"
              >
                <FiShoppingCart aria-hidden="true" /> {ordersLabel}
              </Link>

              <div className="pt-2 border-t border-border mt-1">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <Link
                      href={profileHref}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold">
                        {initials(user?.name)}
                      </span>
                      {profileLabel}
                    </Link>
                    <Button
                      size="sm"
                      variant="danger-soft"
                      onPress={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-xs"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-1">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex-1">
                      <Button size="sm" variant="primary" className="w-full bg-accent text-accent-foreground text-xs">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}