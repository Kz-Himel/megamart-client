"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { FiLogIn, FiAlertCircle, FiZap } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PasswordField } from "@/components/auth/PasswordField";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthDivider } from "@/components/auth/AuthDivider";

const DEMO_EMAIL = "demo@ankara.com";
const DEMO_PASSWORD = "demo1234";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const goAfterLogin = (role: string) => {
    const redirect = searchParams.get("redirect");
    router.push(redirect || (role === "ADMIN" ? "/dashboard" : "/"));
  };

  // Already signed in — no reason to show the login form.
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(searchParams.get("redirect") || "/");
    }
  }, [isAuthLoading, isAuthenticated, router, searchParams]);

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
    } catch (err: any) {
      setError(err.message || "Login failed");
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
    } catch (err: any) {
      setError(err.message || "Demo account isn't set up yet — try registering instead.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] w-full items-center justify-center overflow-hidden">
      {isAuthLoading || isAuthenticated ? (
        <LoadingSpinner label="Redirecting..." />
      ) : (
        <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-0.5 text-xs text-slate-500">Log in to continue to the marketplace</p>
        </div>

        {/* Content Body */}
        <div className="space-y-3">
          <GoogleButton />
          <AuthDivider label="or continue with email" />

          <Form onSubmit={handleSubmit} className="w-full space-y-2.5">
            <TextField name="email" type="email" isRequired fullWidth>
              <Label className="text-xs font-semibold text-slate-700">Email</Label>
              <Input placeholder="you@example.com" fullWidth />
              <FieldError className="text-[10px] text-red-500" />
            </TextField>

            <PasswordField name="password" label="Password" placeholder="••••••••" isRequired minLength={1} />

            {error && (
              <p className="flex items-start gap-1 rounded-md border border-red-100 bg-red-50 p-2 text-xs text-red-600">
                <FiAlertCircle className="mt-0.5 shrink-0 text-sm" />
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              className="mt-1 h-9 w-full rounded-full bg-indigo-600 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 active:scale-95" 
              isDisabled={isSubmitting}
            >
              <FiLogIn className="mr-1 text-sm" />
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </Form>

          <Button
            type="button"
            variant="outline"
            className="h-8 w-full rounded-full border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onPress={handleDemoLogin}
            isDisabled={isDemoLoading}
          >
            <FiZap className="mr-1 text-amber-500" />
            {isDemoLoading ? "Signing in..." : "Try demo login"}
          </Button>

          {/* Footer */}
          <p className="pt-1 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
        </div>
      )}
    </div>
  );
}