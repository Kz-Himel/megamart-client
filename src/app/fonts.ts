// src/app/fonts.ts
import { Poppins, JetBrains_Mono } from "next/font/google";

// Reference design (MegaMart) uses one geometric rounded sans — Poppins is the
// closest Google Font match — for both headings/logo and body/UI text.
// Both variables point at Poppins so every existing `font-display` /
// `font-sans` usage across the app updates without touching each file.
export const fraunces = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

export const inter = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "600"],
});