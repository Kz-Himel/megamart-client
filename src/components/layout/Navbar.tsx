"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  FiBox,
  FiTag,
  FiGrid,
  FiHeart,
} from "react-icons/fi";
import { PiTextAlignLeftBold } from "react-icons/pi";
import { useAuth } from "@/lib/auth/useAuth";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";

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
  const { totalItems: cartCount } = useCart();
  const { totalWishlist: wishlistCount } = useWishlist();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const profileHref = isAdmin ? "/dashboard" : "/account";
  const profileLabel = isAdmin ? "Dashboard" : "My Account";

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
        className={`hidden overflow-hidden bg-[#F3F9FB] transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:block ${
          isHidden
            ? "max-h-0 -translate-y-2 opacity-0"
            : "max-h-12 translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-gray-500 sm:px-6">
          <span>Welcome to worldwide MegaMart!</span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-gray-600">
              <FiMapPin className="text-sm text-[#008ECC]" aria-hidden="true" />
              Deliver to <strong className="ml-0.5 font-semibold text-gray-800">423651</strong>
            </span>
            <span className="h-3 w-px bg-gray-200" aria-hidden="true" />
            <Link
              href="/orders"
              className="flex items-center gap-1.5 font-medium text-gray-600 transition-colors hover:text-[#008ECC]"
            >
              <FiTruck className="text-sm text-[#008ECC]" aria-hidden="true" />
              Track your order
            </Link>
            <span className="h-3 w-px bg-gray-200" aria-hidden="true" />
            <span className="flex items-center gap-1.5 text-gray-600">
              <FiPercent className="text-sm text-[#008ECC]" aria-hidden="true" />
              All Offers
            </span>
          </div>
        </div>
      </div>

      {/* Row 2 — Main Navbar */}
      <div className="relative z-10 border-b border-gray-100 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <button
              className="rounded-lg p-2 text-[#008ECC] hover:bg-[#F3F9FB] lg:hidden focus-visible:outline-none"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <PiTextAlignLeftBold className="text-2xl" />
              )}
            </button>

            {/* Logo with 3D-styled shopping bag icon */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008ECC] text-white shadow-xs transition-transform group-hover:scale-105">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zm-9-1a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Mega<span className="text-[#008ECC]">Mart</span>
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar (Pill shape with category selector as in reference image) */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-4 hidden flex-1 max-w-xl items-center lg:flex xl:max-w-2xl"
            role="search"
          >
            <div className="flex w-full items-center rounded-full border border-slate-200 bg-[#F3F9FB] px-4 py-2 transition-all focus-within:border-[#008ECC] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#008ECC]/10 shadow-xs">
              <FiSearch className="text-lg text-slate-400 shrink-0" aria-hidden="true" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Search products"
              />
              <div className="flex items-center gap-1 border-l border-slate-200 pl-3 shrink-0">
                <Link
                  href="/categories"
                  className="text-xs font-semibold text-slate-600 hover:text-[#008ECC] transition-colors whitespace-nowrap"
                >
                  All Categories ▾
                </Link>
              </div>
            </div>
          </form>

          {/* Desktop Right Navigation (Wishlist, Cart, Profile) */}
          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-700 transition-colors hover:bg-sky-50 hover:text-[#008ECC] border border-slate-100"
              title="Wishlist"
            >
              <FiHeart className="text-lg" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-700 transition-colors hover:bg-sky-50 hover:text-[#008ECC] border border-slate-100"
              title="Cart"
            >
              <FiShoppingCart className="text-lg" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#008ECC] text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            <span className="h-5 w-px bg-slate-200" aria-hidden="true" />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href={profileHref}
                  aria-label={profileLabel}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 shadow-xs hover:border-[#008ECC] transition-all"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#008ECC] text-xs font-bold text-white">
                    {initials(user?.name)}
                  </span>
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                  aria-label="Log out"
                  title="Log out"
                >
                  <FiLogOut className="text-base" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full bg-[#008ECC] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0073A8] transition-all"
              >
                <FiUser className="text-sm" aria-hidden="true" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Small / Medium Device: Icons Only (Text Hidden) */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {isAuthenticated ? (
              <>
                <Link
                  href={profileHref}
                  aria-label={profileLabel}
                  title={profileLabel}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F9FB] text-gray-700 transition-colors hover:text-[#008ECC]"
                >
                  {isAdmin ? (
                    <FiGrid className="text-lg text-[#008ECC]" />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#008ECC] text-[11px] font-bold text-white">
                      {initials(user?.name)}
                    </span>
                  )}
                </Link>

                <button
                  onClick={logout}
                  aria-label="Log out"
                  title="Log out"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-600"
                >
                  <FiLogOut className="text-lg" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                aria-label="Login"
                title="Login"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F9FB] text-gray-700 transition-colors hover:text-[#008ECC]"
              >
                <FiUser className="text-lg text-[#008ECC]" />
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile / Tablet Drawer Menu (Exact as your original code) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-b border-gray-200 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
              {/* Mobile Search Input */}
              <form onSubmit={handleSearchSubmit} className="flex items-center" role="search">
                <div className="flex w-full items-center overflow-hidden rounded-xl border border-gray-200 bg-[#F3F9FB] px-3 py-2">
                  <FiSearch className="mr-2 text-gray-400" />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search essentials, groceries..."
                    className="w-full bg-transparent text-xs text-gray-800 outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#008ECC] px-2.5 py-1 text-xs font-medium text-white"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Mobile Route List */}
              <div className="flex flex-col gap-1.5 pt-2">
                <Link
                  href="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F3F9FB] hover:text-[#008ECC]"
                >
                  <FiBox className="text-lg text-[#008ECC]" />
                  Products
                </Link>

                <Link
                  href="/categories"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F3F9FB] hover:text-[#008ECC]"
                >
                  <FiTag className="text-lg text-[#008ECC]" />
                  Categories
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F3F9FB] hover:text-[#008ECC]"
                >
                  <div className="flex items-center gap-3">
                    <FiHeart className="text-lg text-[#008ECC]" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F3F9FB] hover:text-[#008ECC]"
                >
                  <div className="flex items-center gap-3">
                    <FiShoppingCart className="text-lg text-[#008ECC]" />
                    <span>Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="rounded-full bg-[#008ECC] px-2 py-0.5 text-xs text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F3F9FB] hover:text-[#008ECC]"
                    >
                      <FiTruck className="text-lg text-[#008ECC]" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      href={profileHref}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F3F9FB] hover:text-[#008ECC]"
                    >
                      {isAdmin ? <FiGrid className="text-lg text-[#008ECC]" /> : <FiUser className="text-lg text-[#008ECC]" />}
                      <span>{profileLabel}</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <FiLogOut className="text-lg" />
                      <span>Log out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex-1">
                      <Button size="sm" className="w-full bg-[#008ECC] text-xs font-semibold text-white">
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