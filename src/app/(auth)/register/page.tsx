"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { FiUserPlus, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { AuthShell } from "@/components/auth/AuthShell";
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
    <AuthShell
      title="Create an account"
      subtitle="Join the marketplace to shop and review products"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleButton />
        <AuthDivider label="or continue with email" />

        <Form onSubmit={handleSubmit} className="w-full space-y-4">
          <TextField name="name" isRequired minLength={2}>
            <Label className="text-sm font-medium">Full name</Label>
            <Input placeholder="Your name" />
            <FieldError className="text-xs text-danger" />
          </TextField>
          <TextField name="email" type="email" isRequired>
            <Label className="text-sm font-medium">Email</Label>
            <Input placeholder="you@example.com" />
            <FieldError className="text-xs text-danger" />
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
            <p className="flex items-start gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" isDisabled={isSubmitting}>
            <FiUserPlus className="mr-1" />
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </Form>
      </div>
    </AuthShell>
  );
}