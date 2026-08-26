"use client";

import { FcGoogle } from "react-icons/fc";

export function GoogleButton() {
  return (
    <button
      type="button"
      disabled
      title="Google sign-in is coming soon"
      className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground/60"
    >
      <FcGoogle className="text-lg" />
      Continue with Google
      <span className="ml-1 rounded-full bg-border px-2 py-0.5 text-[10px] font-medium text-muted">
        Soon
      </span>
    </button>
  );
}