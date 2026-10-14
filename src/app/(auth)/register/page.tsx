"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { FiUserPlus, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PasswordField } from "@/components/auth/PasswordField";
import { SplitAuthCard } from "@/components/auth/SplitAuthCard";
import { getErrorMessage } from "@/lib/utils/formatters";

function RegisterContent() {
  const { register, login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectUrl = searchParams.get("redirect");

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(redirectUrl || "/");
    }
  }, [isAuthLoading, isAuthenticated, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      await login({ email, password });
      router.push(redirectUrl || "/");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Registration failed"));
    } finally {
      setIsSubmitting(false);
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
      mode="register"
      title="Create an Account"
      subtitle="Join MegaMart to shop and track orders"
      redirectParam={redirectUrl}
    >
      <Form onSubmit={handleSubmit} className="w-full space-y-3">
        <TextField name="name" isRequired minLength={2} fullWidth>
          <Label className="text-xs font-bold text-slate-700">Full Name</Label>
          <Input
            placeholder="Enter your full name"
            className="rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 px-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
            fullWidth
          />
          <FieldError className="text-[10px] text-red-500" />
        </TextField>

        <TextField name="email" type="email" isRequired fullWidth>
          <Label className="text-xs font-bold text-slate-700">Email Address</Label>
          <Input
            placeholder="Enter your email address"
            className="rounded-xl border border-slate-200 bg-[#F8FAFC] py-2 px-3 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
            fullWidth
          />
          <FieldError className="text-[10px] text-red-500" />
        </TextField>

        <PasswordField
          name="password"
          label="Password"
          placeholder="At least 6 characters"
          isRequired
          minLength={6}
        />

        <PasswordField
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Repeat password"
          isRequired
          minLength={6}
        />

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
          <FiUserPlus className="mr-1.5 text-sm" />
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </Form>
    </SplitAuthCard>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center py-4">
      <Suspense fallback={<LoadingSpinner label="Loading..." />}>
        <RegisterContent />
      </Suspense>
    </div>
  );
}