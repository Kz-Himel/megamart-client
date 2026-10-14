"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { FiLogIn, FiAlertCircle, FiZap } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PasswordField } from "@/components/auth/PasswordField";
import { SplitAuthCard } from "@/components/auth/SplitAuthCard";
import { getErrorMessage } from "@/lib/utils/formatters";

const DEMO_EMAIL = "demo@ankara.com";
const DEMO_PASSWORD = "demo1234";

function LoginContent() {
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const redirectParam = searchParams.get("redirect");

  const goAfterLogin = (role: string) => {
    router.push(redirectParam || (role === "ADMIN" ? "/dashboard" : "/"));
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(redirectParam || "/");
    }
  }, [isAuthLoading, isAuthenticated, router, redirectParam]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const user = await login({ email, password });
      goAfterLogin(user.role);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Login failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsDemoLoading(true);
    try {
      const user = await login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
      goAfterLogin(user.role);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Demo account isn't set up yet — try registering instead."));
    } finally {
      setIsDemoLoading(false);
    }
  };

  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner label="Redirecting to your account..." />
      </div>
    );
  }

  return (
    <SplitAuthCard
      mode="login"
      title="Sign In to MegaMart"
      subtitle="Enter your details below to continue"
      redirectParam={redirectParam}
    >
      <Form onSubmit={handleSubmit} className="w-full space-y-3.5">
        <TextField name="email" type="email" isRequired fullWidth>
          <Label className="text-xs font-bold text-slate-700">Email or Phone</Label>
          <Input
            placeholder="Enter your email or phone"
            className="rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 px-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
            fullWidth
          />
          <FieldError className="text-[10px] text-red-500" />
        </TextField>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs font-bold text-slate-700">Password</Label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#008ECC] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordField
            name="password"
            label=""
            placeholder="Enter your password"
            isRequired
            minLength={1}
          />
        </div>

        {error && (
          <p className="flex items-start gap-1.5 rounded-xl border border-red-100 bg-red-50 p-2.5 text-xs text-red-600">
            <FiAlertCircle className="mt-0.5 shrink-0 text-sm" />
            <span>{error}</span>
          </p>
        )}

        <Button
          type="submit"
          className="mt-2 h-10 w-full rounded-full bg-[#008ECC] text-xs font-bold text-white shadow-xs hover:bg-[#0073A8] transition-all active:scale-98"
          isDisabled={isSubmitting}
        >
          <FiLogIn className="mr-1.5 text-sm" />
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-9 w-full rounded-full border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          onPress={handleDemoLogin}
          isDisabled={isDemoLoading}
        >
          <FiZap className="mr-1.5 text-amber-500" />
          {isDemoLoading ? "Signing in..." : "Try demo account"}
        </Button>
      </Form>
    </SplitAuthCard>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center py-4">
      <Suspense fallback={<LoadingSpinner label="Loading..." />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}