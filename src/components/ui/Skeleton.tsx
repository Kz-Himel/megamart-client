import React from "react";
import { cn } from "@/lib/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/70",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonCircle({
  size = 40,
  className,
}: {
  size?: number | string;
  className?: string;
}) {
  return (
    <Skeleton
      style={{ width: size, height: size }}
      className={cn("rounded-full shrink-0", className)}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ["w-full", "w-4/5", "w-3/5", "w-1/2"];

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3.5", widths[index % widths.length])}
        />
      ))}
    </div>
  );
}
