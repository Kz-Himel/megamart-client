export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3">
      <div className="h-44 w-full animate-pulse rounded-xl bg-slate-100" />
      <div className="flex flex-1 flex-col gap-2 pt-3">
        <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-slate-100" />
        <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-1 h-2.5 w-1/2 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-2 h-4 w-1/4 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-3 h-9 w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}