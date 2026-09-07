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
  FiPercent,
} from "react-icons/fi";
import { PiTextAlignLeftBold } from "react-icons/pi";
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

        if (scrollDifference < 10) {
          tickingRef.current = false;
          return;
        }

        if (currentScrollY <= 100) {
          setIsHidden(false);
        } else if (currentScrollY > lastScrollY.current) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
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
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm font-sans">
      {/* Row 1 — Top Utility Bar */}
      <div
        className={`hidden overflow-hidden bg-[#F3F9FB] transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] sm:block ${
          isHidden
            ? "max-h-0 -translate-y-2 opacity-0"
            : "max-h-12 translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-500 sm:px-6">
          <span>Welcome to worldwide MegaMart!</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600">
              <FiMapPin className="text-sm text-sky-500" aria-hidden="true" />
              Deliver to <strong className="ml-1 font-semibold text-slate-800">423651</strong>
            </span>
            <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
            <Link
              href="/orders"
              className="flex items-center gap-1 font-medium text-slate-600 transition-colors hover:text-sky-600"
            >
              <FiTruck className="text-sm text-sky-500" aria-hidden="true" />
              Track your order
            </Link>
            <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
            <span className="flex items-center gap-1 text-slate-600">
              <FiPercent className="text-sm text-sky-500" aria-hidden="true" />
              All Offers
            </span>
          </div>
        </div>
      </div>

      {/* Row 2 — MAIN NAVBAR */}
      <div className="relative z-10 border-b border-slate-100 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex flex-shrink-0 items-center gap-3">
            <button
              className="rounded-md p-1 text-sky-600 hover:bg-slate-100 md:hidden focus-visible:outline-none"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <PiTextAlignLeftBold className="text-2xl" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600 md:hidden">
                <PiTextAlignLeftBold className="text-xl" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-sky-600">
                MegaMart
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-4 hidden flex-1 max-w-2xl items-center md:flex"
            role="search"
          >
            <div className="flex w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-[#F3F9FB] px-3.5 py-1.5 transition-all focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/10">
              <FiSearch className="text-base text-sky-500" aria-hidden="true" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search essentials, groceries and more..."
                className="w-full bg-transparent px-3 py-1 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Search products"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="flex flex-shrink-0 items-center justify-center text-sky-600 hover:text-sky-700"
              >
                <FiList className="text-lg" aria-hidden="true" />
              </button>
            </div>
          </form>

          {/* User Account & Cart Actions */}
          <div className="flex flex-shrink-0 items-center gap-5">
            {isAuthenticated ? (
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href={profileHref}
                  aria-label={profileLabel}
                  className="group flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-sky-600"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                    {initials(user?.name)}
                  </span>
                  <span className="hidden lg:inline">{profileLabel}</span>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  onPress={logout}
                  className="h-8 w-8 rounded-full text-slate-400 hover:text-rose-600"
                  aria-label="Log out"
                >
                  <FiLogOut className="text-sm" />
                </Button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-2 text-sm font-semibold text-slate-700 hover:text-sky-600 sm:flex"
              >
                <FiUser className="text-lg text-sky-500" aria-hidden="true" />
                <span>Sign Up/Sign In</span>
              </Link>
            )}

            <span className="hidden h-5 w-px bg-slate-200 sm:block" aria-hidden="true" />

            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-md text-sm font-semibold text-slate-700 hover:text-sky-600"
            >
              <div className="relative flex items-center">
                <FiShoppingCart className="text-xl text-sky-500" aria-hidden="true" />
                {orderCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                    {orderCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Cart</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Row 3 — Category Navigation Bar */}
      <div
        className={`border-b border-slate-100 bg-white overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
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
            className="overflow-hidden border-b border-slate-200 bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <form onSubmit={handleSearchSubmit} className="mb-2 flex items-center" role="search">
                <div className="flex w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-[#F3F9FB] px-3">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search essentials..."
                    className="w-full bg-transparent py-2 text-xs text-slate-800 outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-sky-500 p-1.5 text-white"
                  >
                    <FiSearch className="text-xs" />
                  </button>
                </div>
              </form>

              <Suspense fallback={null}>
                <CategoryNav variant="mobile" onNavigate={() => setIsMenuOpen(false)} />
              </Suspense>

              <div className="mt-2 border-t border-slate-100 pt-3">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <Link
                      href={profileHref}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
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
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex-1">
                      <Button size="sm" className="w-full bg-sky-500 text-xs text-white">
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