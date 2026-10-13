import type { Metadata } from "next";
import { fraunces, inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "MegaMart | Product Marketplace",
  description: "A product marketplace built with Next.js, Express & Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}