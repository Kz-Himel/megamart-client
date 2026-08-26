"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShoppingBag, FiCheckCircle, FiTruck } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";

const TRUST_POINTS = [
  "Secure, JWT-based authentication",
  "Real-time stock across the catalog",
  "Genuine reviews from real buyers",
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-5xl items-center py-10">
      <div className="relative grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-border bg-surface shadow-xl md:grid-cols-2">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{
            background: "linear-gradient(90deg, var(--accent), var(--price), var(--accent))",
          }}
        />

        <div className="hero-glow dot-grid relative hidden flex-col justify-between overflow-hidden p-10 md:flex">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <FiShoppingBag />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Ankara
            </span>
          </Link>

          <div className="relative flex flex-1 items-center justify-center">
            <div className="absolute h-52 w-52 rounded-full bg-accent/20 blur-3xl" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-accent text-accent-foreground shadow-xl"
            >
              <FiShoppingBag className="text-5xl" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute -left-2 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-lg text-price-foreground shadow-md"
            >
              <FaStar className="text-price" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -right-1 bottom-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-lg text-accent shadow-md"
            >
              <FiTruck />
            </motion.div>
          </div>

          <div>
            <p className="font-display text-xl font-semibold leading-snug">
              A marketplace woven around real stock, real reviews, real
              sellers.
            </p>
            <div className="stitch-divider my-5" />
            <ul className="flex flex-col gap-2.5 text-sm text-foreground/80">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <FiCheckCircle className="mt-0.5 flex-shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-center p-6 sm:p-10 md:p-12"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <FiShoppingBag />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Ankara
            </span>
          </Link>

          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

          <div className="mt-7">{children}</div>

          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </motion.div>
      </div>
    </div>
  );
}