"use client";

import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { useAuth } from "@/lib/auth/useAuth";
import { useUpdateUser } from "@/hooks/useUsers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AccountProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const updateUser = useUpdateUser(user?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (authLoading) return <LoadingSpinner />;
  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      await updateUser.mutateAsync({
        name,
        email,
        ...(password ? { password } : {}),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Could not update profile");
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl text-accent">
          <FiUser />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900">My profile</h1>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {user.role}
          </span>
        </div>
      </div>

      <Form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <TextField name="name" isRequired defaultValue={user.name}>
          <Label className="text-sm font-medium text-slate-700">Name</Label>
          <Input />
          <FieldError className="text-xs text-red-500" />
        </TextField>

        <TextField name="email" type="email" isRequired defaultValue={user.email}>
          <Label className="text-sm font-medium text-slate-700">Email</Label>
          <Input />
          <FieldError className="text-xs text-red-500" />
        </TextField>

        <TextField name="password" minLength={0}>
          <Label className="text-sm font-medium text-slate-700">
            New password <span className="text-slate-400">(leave blank to keep current)</span>
          </Label>
          <Input type="password" placeholder="At least 6 characters" />
        </TextField>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
            Profile updated successfully
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full bg-accent text-accent-foreground hover:opacity-90"
          isDisabled={updateUser.isPending}
        >
          {updateUser.isPending ? "Saving..." : "Save changes"}
        </Button>
      </Form>
    </div>
  );
}