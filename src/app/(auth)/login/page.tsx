"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { FiLogIn, FiAlertCircle, FiZap } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthDivider } from "@/components/auth/AuthDivider";

// Update these once a seeded demo/test account exists on the backend.
const DEMO_EMAIL = "demo@ankara.com";
const DEMO_PASSWORD = "demo1234";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const goAfterLogin = (role: string) => {
    const redirect = searchParams.get("redirect");
    router.push(redirect || (role === "ADMIN" ? "/dashboard" : "/"));
  };

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
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to the marketplace"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Register
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleButton />
        <AuthDivider label="or continue with email" />

        <Form onSubmit={handleSubmit} className="w-full space-y-4">
          <TextField name="email" type="email" isRequired fullWidth>
            <Label className="text-sm font-medium">Email</Label>
            <Input placeholder="you@example.com" fullWidth/>
            <FieldError className="text-xs text-danger" />
          </TextField>

          <PasswordField name="password" label="Password" placeholder="••••••••" isRequired minLength={1} />

          {error && (
            <p className="flex items-start gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" isDisabled={isSubmitting}>
            <FiLogIn className="mr-1" />
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </Form>

        <Button
          type="button"
          variant="ghost"
          className="w-full border border-dashed border-border"
          onPress={handleDemoLogin}
          isDisabled={isDemoLoading}
        >
          <FiZap className="mr-1" />
          {isDemoLoading ? "Signing in..." : "Try demo login"}
        </Button>
      </div>
    </AuthShell>
  );
}