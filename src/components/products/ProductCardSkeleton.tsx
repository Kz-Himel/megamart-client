import { Skeleton } from "@/components/ui/Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
      {/* Image Skeleton */}
      <Skeleton className="h-44 w-full rounded-xl" />

      {/* Info Skeleton */}
      <div className="flex flex-1 flex-col gap-2 pt-3">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <div className="mt-1 flex items-center justify-between">
          <Skeleton className="h-3 w-1/4 rounded-md" />
          <Skeleton className="h-3 w-1/5 rounded-md" />
        </div>
        <Skeleton className="mt-2 h-5 w-1/3 rounded-md" />
        <Skeleton className="mt-2 h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}