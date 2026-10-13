"use client";

import { useState } from "react";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { User, UserRole } from "@/types/auth.types";
import { getErrorMessage } from "@/lib/utils/formatters";

interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

interface UserFormProps {
  initialValues?: User;
  onSubmit: (values: UserFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  requirePassword?: boolean;
}

export function UserForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save user",
  requirePassword = true,
}: UserFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(initialValues?.role ?? "USER");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      await onSubmit({
        name,
        email,
        role,
        ...(password ? { password } : {}),
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Something went wrong"));
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-2xl border border-border bg-surface p-6">
      <TextField name="name" isRequired defaultValue={initialValues?.name}>
        <Label className="text-sm font-medium">Name</Label>
        <Input placeholder="Full name" />
        <FieldError className="text-xs text-danger" />
      </TextField>

      <TextField name="email" type="email" isRequired defaultValue={initialValues?.email}>
        <Label className="text-sm font-medium">Email</Label>
        <Input placeholder="you@example.com" />
        <FieldError className="text-xs text-danger" />
      </TextField>

      <TextField name="password" isRequired={requirePassword} minLength={requirePassword ? 6 : 0}>
        <Label className="text-sm font-medium">
          Password {initialValues && <span className="text-muted">(leave blank to keep current)</span>}
        </Label>
        <Input placeholder="At least 6 characters" type="password" />
        <FieldError className="text-xs text-danger" />
      </TextField>

      <div>
        <label className="mb-1 block text-sm font-medium">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

      <Button type="submit" className="w-full" isDisabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </Form>
  );
}