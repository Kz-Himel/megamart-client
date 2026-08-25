"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@heroui/react";
import { useAuth } from "@/lib/auth/useAuth";

export function CtaSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-12 text-center sm:px-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--price), var(--accent))",
          }}
        />
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {isAuthenticated ? "Pick up where you left off" : "Join the marketplace"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          {isAuthenticated
            ? "Your orders, reviews, and saved categories are all one tap away."
            : "Create a free account to track orders, leave reviews, and check out faster."}
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href={isAuthenticated ? "/products" : "/register"}>
            <Button size="lg">
              {isAuthenticated ? "Browse products" : "Create an account"}{" "}
              <FiArrowRight className="ml-1" />
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link href="/products">
              <Button size="lg" variant="ghost">
                Browse as guest
              </Button>
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  );
}