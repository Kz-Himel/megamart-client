"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  FiShoppingBag,
  FiMenu,
  FiX,
  FiSearch,
  FiGrid,
  FiLogOut,
  FiShoppingCart,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { useOrders } from "@/hooks/useOrders";

const NAV_LINKS = [
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Products" },
];

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
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: orders } = useOrders({ enabled: isAuthenticated });
  const orderCount = isAuthenticated ? orders?.length ?? 0 : 0;
  const ordersLabel = `My orders${isAuthenticated ? ` (${orderCount})` : ""}`;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        isScrolled ? "border-b border-slate-100 shadow-sm" : "border-b border-slate-50"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <FiShoppingBag className="text-lg" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Ankara
          </span>
        </Link>

        {/* Search Bar - Center Desktop */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 max-w-md items-center mx-4 md:flex"
          role="search"
        >
          <div className="flex w-full items-center overflow-hidden rounded-full border border-slate-200/80 bg-slate-50/50 pl-4 pr-1 transition-all focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10">
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              aria-label="Search products"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="my-1 flex h-7 w-8 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <FiSearch className="text-xs" aria-hidden="true" />
            </button>
          </div>
        </form>

        {/* Navigation Links & Actions - Desktop */}
        <div className="hidden flex-shrink-0 items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1 py-0.5 ${
                  active ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1 py-0.5"
            >
              <FiGrid className="text-sm text-indigo-500" aria-hidden="true" /> Dashboard
            </Link>
          )}

          {/* My Orders */}
          <Link
            href="/orders"
            aria-label={ordersLabel}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1 py-0.5"
          >
            <FiShoppingCart className="text-base" aria-hidden="true" />
            <span>{ordersLabel}</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <Link
                href="/profile"
                aria-label="User Profile"
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 ring-2 ring-indigo-600/20 transition-all group-hover:ring-indigo-600/40">
                  {initials(user?.name)}
                </span>
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
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm" variant="primary" className="rounded-full bg-indigo-600 text-white font-medium text-xs px-4">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="ml-auto text-slate-700 md:hidden p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX className="text-2xl" aria-hidden="true" /> : <FiMenu className="text-2xl" aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-slate-100 bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center mb-2" role="search">
                <div className="flex w-full items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 pl-3 pr-1">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent py-2 text-xs outline-none text-slate-800"
                    aria-label="Search products"
                  />
                  <button type="submit" aria-label="Submit search" className="rounded-full bg-indigo-600 p-1.5 text-white">
                    <FiSearch className="text-xs" aria-hidden="true" />
                  </button>
                </div>
              </form>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xs font-semibold py-1.5 ${
                    pathname?.startsWith(link.href)
                      ? "text-indigo-600"
                      : "text-slate-700 hover:text-indigo-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs font-semibold text-slate-700 py-1.5"
                >
                  Dashboard
                </Link>
              )}

              <Link
                href="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 py-1.5"
              >
                <FiShoppingCart aria-hidden="true" /> {ordersLabel}
              </Link>

              <div className="pt-2 border-t border-slate-100 mt-1">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">
                        {initials(user?.name)}
                      </span>
                      Profile
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
                      <Button size="sm" variant="primary" className="w-full bg-indigo-600 text-white text-xs">
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