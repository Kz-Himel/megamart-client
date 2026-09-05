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

  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);

        // ছোটখাটো স্ক্রোল ইগনোর করবে যাতে কাঁপাকাঁপি না হয়
        if (scrollDifference < 10) {
          tickingRef.current = false;
          return;
        }

        if (currentScrollY <= 100) {
          setIsHidden(false); // পেজের উপরে থাকলে সবসময় ফুল নেভবার
        } else if (currentScrollY > lastScrollY.current) {
          setIsHidden(true); // নিচে নামলে হাইড হবে
        } else {
          setIsHidden(false); // উপরে উঠলে দেখাবে
        }

        lastScrollY.current = currentScrollY;
        tickingRef.current = false;
      });
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
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Row 1 — Utility bar */}
      <div
        className={`hidden overflow-hidden bg-[#F6F6F6] transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] sm:block ${
          isHidden
            ? "max-h-0 -translate-y-2 opacity-0"
            : "max-h-12 translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-600 sm:px-6">
          <span>Welcome to Ankara!</span>
          <div className="flex items-center gap-3">
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
            <span className="flex items-center gap-1.5 text-slate-600">
              <PiSealPercentBold className="text-sm text-accent" aria-hidden="true" />
              All Offers
            </span>
          </div>
        </div>
      </div>

      {/* Row 2 — MAIN NAVBAR (Always Sticky) */}
      <div className="relative z-10 border-b border-border bg-white">
        <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              className="rounded-md p-1 text-accent hover:bg-slate-100 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FiX className="text-2xl" aria-hidden="true" />
              ) : (
                <PiTextAlignLeftBold className="text-2xl" aria-hidden="true" />
              )}
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <PiTextAlignLeftBold className="hidden text-2xl text-accent md:block" aria-hidden="true" />
              <span className="font-display text-xl font-bold tracking-tight text-accent">
                Ankara
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-4 hidden flex-1 max-w-xl items-center md:flex"
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

          {/* Account & Cart Actions */}
          <div className="ml-auto flex flex-shrink-0 items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href={profileHref}
                  aria-label={profileLabel}
                  className="group flex items-center gap-2 rounded-full text-sm font-semibold text-slate-700 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                  className="h-8 min-w-8 rounded-full text-slate-400 hover:text-rose-600"
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
              className="flex items-center gap-1.5 rounded px-1 py-0.5 text-sm font-semibold text-slate-700 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <FiShoppingCart className="text-base text-accent" aria-hidden="true" />
              <span className="hidden lg:inline">{ordersLabel}</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Row 3 — Category Navigation */}
      <div
        className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isHidden ? "max-h-0 -translate-y-2 opacity-0" : "max-h-16 translate-y-0 opacity-100"
        }`}
      >
        <Suspense fallback={null}>
          <CategoryNav variant="desktop" />
        </Suspense>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-b border-border bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <form onSubmit={handleSearchSubmit} className="mb-2 flex items-center" role="search">
                <div className="flex w-full items-center overflow-hidden rounded-full border border-border bg-[#F6F6F6] pl-3 pr-1">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent py-2 text-xs text-slate-800 outline-none"
                    aria-label="Search products"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="rounded-full bg-accent p-1.5 text-accent-foreground"
                  >
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
                className="flex items-center gap-2 border-t border-border py-1.5 pt-3 text-xs font-semibold text-slate-700"
              >
                <FiShoppingCart aria-hidden="true" /> {ordersLabel}
              </Link>

              <div className="mt-1 border-t border-border pt-2">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <Link
                      href={profileHref}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
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
                      <Button size="sm" variant="primary" className="w-full bg-accent text-xs text-accent-foreground">
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