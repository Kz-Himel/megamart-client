"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  FiShoppingBag,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";

const PUBLIC_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
];

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    ...PUBLIC_LINKS,
    ...(isAuthenticated ? [{ href: "/orders", label: "My Orders" }] : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-background/90 backdrop-blur transition-shadow duration-300 ${
        isScrolled ? "shadow-[0_1px_0_0_var(--border)]" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <FiShoppingBag />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Ankara
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
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

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-accent"
              >
                <FiUser /> {user?.name.split(" ")[0]}
              </Link>
              <Button size="sm" variant="ghost" onPress={logout}>
                <FiLogOut className="mr-1" /> Logout
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
          className="md:hidden"
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
              {navLinks.map((link) => (
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