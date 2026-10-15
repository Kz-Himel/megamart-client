import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { Button } from "@heroui/react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
      <FiSearch className="text-2xl text-muted" />
      <h2 className="font-display text-xl font-medium">Not found</h2>
      <p className="text-sm text-muted">This record doesn&apos;t exist or was deleted.</p>
      <Link href="/dashboard">
        <Button size="sm" variant="ghost">Back to Home</Button>
      </Link>
    </div>
  );
}