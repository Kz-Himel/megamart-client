"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  FiShoppingBag,
  FiMenu,
  FiX,
  FiSearch,
  FiPackage,
  FiGrid,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
];

function initials(name?: string) {
  if (!name) return "?";
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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    // Visual for now — takes you to the products page, where search isn't
    // wired to this input yet. Full query filtering comes in a later pass.
    e.preventDefault();
    router.push("/products");
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-background/90 backdrop-blur transition-shadow duration-300 ${
        isScrolled ? "shadow-[0_1px_0_0_var(--border)]" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <FiShoppingBag />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Ankara
          </span>
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 items-center md:flex"
        >
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-surface-secondary px-4 py-2 focus-within:border-accent">
            <FiSearch className="text-muted" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
        </form>

        <div className="hidden flex-shrink-0 items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium transition-colors"
              >
                <span
                  className={
                    active
                      ? "relative z-10 text-accent"
                      : "relative z-10 text-foreground/80 hover:text-accent"
                  }
                >
                  {link.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-accent/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-accent"
            >
              <FiGrid /> Dashboard
            </Link>
          )}
        </div>

        <div className="hidden flex-shrink-0 items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/orders"
                aria-label="My orders"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-accent hover:text-accent"
              >
                <FiPackage />
              </Link>
              <Link href="/profile" aria-label="Profile">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {initials(user?.name)}
                </span>
              </Link>
              <Button size="sm" variant="ghost" onPress={logout}>
                <FiLogOut />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-accent">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="ml-auto md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </nav>

      <div className="nav-rule" />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="flex w-full items-center gap-2 rounded-full border border-border bg-surface-secondary px-4 py-2 focus-within:border-accent">
                  <FiSearch className="text-muted" />
                  <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                  />
                </div>
              </form>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium ${
                    pathname?.startsWith(link.href)
                      ? "text-accent"
                      : "text-foreground/80 hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-foreground/80 hover:text-accent"
                >
                  Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium text-foreground/80 hover:text-accent"
                  >
                    My orders
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium text-foreground/80 hover:text-accent"
                  >
                    Profile
                  </Link>
                  <Button size="sm" variant="ghost" onPress={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium hover:text-accent"
                  >
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}