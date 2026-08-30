"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Profile now lives inside the personal account dashboard — this keeps the
// old URL (bookmarks, links) working by forwarding to the new location.
export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/profile");
  }, [router]);

  return <LoadingSpinner label="Redirecting..." />;
}