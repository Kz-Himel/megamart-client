"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@heroui/react";
import { useAuth } from "@/lib/auth/useAuth";

export function CtaSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-sm sm:px-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{
            background:
              "linear-gradient(90deg, #4f46e5, #06b6d4, #4f46e5)",
          }}
        />
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {isAuthenticated ? "Pick up where you left off" : "Join the marketplace"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-xs text-slate-500 sm:text-sm">
          {isAuthenticated
            ? "Your orders, reviews, and saved categories are all one tap away."
            : "Create a free account to track orders, leave reviews, and check out faster."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={isAuthenticated ? "/products" : "/register"}>
            <Button size="lg" className="rounded-full bg-indigo-600 font-semibold text-white shadow-md transition-transform hover:bg-indigo-700 active:scale-95">
              {isAuthenticated ? "Browse products" : "Create an account"}{" "}
              <FiArrowRight className="ml-1" />
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link href="/products">
              <Button size="lg" variant="outline" className="rounded-full border-slate-200 font-semibold text-slate-700 hover:bg-slate-50">
                Browse as guest
              </Button>
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  );
}