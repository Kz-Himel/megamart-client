import type { Metadata } from "next";
import { fraunces, inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Ankara | Product Marketplace",
  description: "A product marketplace built with Next.js, Express & Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" data-theme="light">
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}