"use client";

import { useState } from "react";
import { FiUser, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "@/lib/auth/useAuth";
import { useUpdateUser } from "@/hooks/useUsers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/utils/formatters";

export default function AccountProfilePage() {
  const { user, isLoading: authLoading, updateUserSession } = useAuth();
  const updateUser = useUpdateUser(user?.id ?? "");
  const { toast } = useToast();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (authLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Loading profile..." />
      </div>
    );
  }
  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password && password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await updateUser.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        ...(password ? { password } : {}),
      });

      updateUserSession({
        name: name.trim(),
        email: email.trim(),
      });

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      toast({
        title: "Profile Updated",
        description: "Your account profile information has been saved.",
        variant: "success",
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not update profile"));
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#008ECC]/10 text-xl text-[#008ECC]">
          <FiUser />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">My Profile</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500">{user.email}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-600">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <FeedbackAlert variant="error" onDismiss={() => setError(null)}>
          {error}
        </FeedbackAlert>
      )}

      {success && (
        <FeedbackAlert variant="success" onDismiss={() => setSuccess(false)}>
          <span className="flex items-center gap-1.5 font-bold">
            <FiCheckCircle /> Changes saved successfully!
          </span>
        </FeedbackAlert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
          />
        </div>

        {/* Change Password Group */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <p className="text-xs font-bold text-slate-700">Change Password (Optional)</p>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
            />
          </div>

          {password && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-[#008ECC] focus:bg-white transition-colors"
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={updateUser.isPending}
            className="w-full justify-center rounded-xl bg-[#008ECC] text-white font-bold shadow-xs hover:bg-[#0073A8] transition-colors"
          >
            {updateUser.isPending ? "Saving changes..." : "Save Profile Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}