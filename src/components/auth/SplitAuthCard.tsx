"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

interface SplitAuthCardProps {
  title: string;
  subtitle: string;
  mode: "login" | "register";
  redirectParam?: string | null;
  children: React.ReactNode;
}

export function SplitAuthCard({
  title,
  subtitle,
  mode,
  redirectParam,
  children,
}: SplitAuthCardProps) {
  const pathname = usePathname();
  const isLogin = mode === "login";

  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";
  const registerHref = redirectParam
    ? `/register?redirect=${encodeURIComponent(redirectParam)}`
    : "/register";

  return (
    <div className="mx-auto my-6 flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl md:flex-row">
      {/* Left Column: 3D Illustration & Welcome Showcase */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#008ECC] via-[#0284C7] to-[#38BDF8] p-8 text-white md:w-1/2">
        {/* Soft Background Accents */}
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#008ECC] shadow-xs">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zm-9-1a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            MegaMart
          </span>
        </div>

        {/* 3D Visual in Center */}
        <div className="relative z-10 my-6 flex items-center justify-center">
          <div className="relative h-56 w-56 sm:h-64 sm:w-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/auth_illustration.jpg"
              alt="Welcome to MegaMart"
              className="h-full w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.2)] rounded-2xl"
            />
          </div>
        </div>

        {/* Bottom Headline Copy */}
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-black text-white">
            {isLogin ? "Welcome Back!" : "Start Your Journey!"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-sky-100 leading-relaxed">
            {isLogin
              ? "Sign in to your account and continue shopping with MegaMart."
              : "Create an account to browse top brands, track orders, and get exclusive deals."}
          </p>
        </div>
      </div>

      {/* Right Column: Clean White Form Container */}
      <div className="flex flex-col justify-between p-6 sm:p-10 md:w-1/2">
        {/* Top Segmented Tabs: Login | Sign Up */}
        <div>
          <div className="mb-6 flex rounded-full bg-[#F3F9FB] p-1 border border-slate-200/80">
            <Link
              href={loginHref}
              className={`flex-1 rounded-full py-2 text-center text-xs font-bold transition-all ${
                isLogin
                  ? "bg-[#008ECC] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Login
            </Link>
            <Link
              href={registerHref}
              className={`flex-1 rounded-full py-2 text-center text-xs font-bold transition-all ${
                !isLogin
                  ? "bg-[#008ECC] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
            </Link>
          </div>

          <div className="mb-4">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}

          {/* Social Logins */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-[11px] font-semibold text-slate-400">
                or continue with
              </span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:border-[#008ECC] hover:bg-slate-50 transition-all active:scale-95"
                title="Continue with Google"
              >
                <FaGoogle className="text-sm text-[#EA4335]" />
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:border-[#008ECC] hover:bg-slate-50 transition-all active:scale-95"
                title="Continue with Facebook"
              >
                <FaFacebookF className="text-sm text-[#1877F2]" />
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:border-[#008ECC] hover:bg-slate-50 transition-all active:scale-95"
                title="Continue with Apple"
              >
                <FaApple className="text-base text-slate-900" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-6 pt-2 text-center text-xs text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isLogin ? registerHref : loginHref}
            className="font-bold text-[#008ECC] hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
