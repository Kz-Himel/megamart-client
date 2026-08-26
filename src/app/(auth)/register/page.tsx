"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { FiUserPlus, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { PasswordField } from "@/components/auth/PasswordField";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthDivider } from "@/components/auth/AuthDivider";

export default function RegisterPage() {
  const { register, login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center overflow-hidden py-4">
      {/* rounded-3xl দিয়ে একদম পারফেক্ট কার্ভ করে দেওয়া হলো */}
      <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-slate-100">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Create an account</h1>
          <p className="mt-0.5 text-xs text-slate-500">Join the marketplace to shop and review products</p>
        </div>

        {/* Content Body */}
        <div className="space-y-3">
          <GoogleButton />
          <AuthDivider label="or continue with email" />

          <Form onSubmit={handleSubmit} className="w-full space-y-2.5">
            <TextField name="name" isRequired minLength={2} fullWidth>
              <Label className="text-xs font-semibold text-slate-700">Full name</Label>
              <Input placeholder="Your name" fullWidth />
              <FieldError className="text-[10px] text-red-500" />
            </TextField>

            <TextField name="email" type="email" isRequired fullWidth>
              <Label className="text-xs font-semibold text-slate-700">Email</Label>
              <Input placeholder="you@example.com" fullWidth />
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
              label="Confirm password"
              placeholder="Repeat password"
              isRequired
              minLength={6}
            />

            {error && (
              <p className="flex items-start gap-1 rounded-xl border border-red-100 bg-red-50 p-2 text-xs text-red-600">
                <FiAlertCircle className="mt-0.5 shrink-0 text-sm" />
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="mt-1 h-10 w-full rounded-full bg-indigo-600 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 active:scale-95"
              isDisabled={isSubmitting}
            >
              <FiUserPlus className="mr-1 text-sm" />
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </Form>

          {/* Footer */}
          <p className="pt-1 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}