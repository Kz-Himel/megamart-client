"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { FiUserPlus } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { AuthShell } from "@/components/auth/AuthShell";

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
        <TextField name="password" isRequired minLength={6}>
          <Label className="text-sm font-medium">Password</Label>
          <Input placeholder="At least 6 characters" type="password" />
          <FieldError className="text-xs text-danger" />
        </TextField>
        <TextField name="confirmPassword" isRequired minLength={6}>
          <Label className="text-sm font-medium">Confirm password</Label>
          <Input placeholder="Repeat password" type="password" />
          <FieldError className="text-xs text-danger" />
        </TextField>

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" isDisabled={isSubmitting}>
          <FiUserPlus className="mr-1" />
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </Form>
    </AuthShell>
  );
}