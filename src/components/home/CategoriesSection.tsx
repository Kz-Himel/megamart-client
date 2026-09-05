"use client";

import Link from "next/link";
import {
  FiFolder,
  FiTv,
  FiShoppingBag,
  FiHome,
  FiBookOpen,
  FiSmile,
  FiCpu,
  FiWatch,
  FiGift,
  FiChevronRight,
} from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category.types";

// Category has no image field in the schema, so a real product/category photo
// isn't available here — an icon mapped from the real category name is the
// honest fallback (per the "missing image → proper fallback" rule) rather
// than showing a placeholder photo that isn't actually that category.
function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  const cls = "text-2xl text-accent";
  if (name.includes("electronic") || name.includes("device") || name.includes("gadget"))
    return <FiTv className={cls} aria-hidden="true" />;
  if (name.includes("fashion") || name.includes("cloth") || name.includes("wear"))
    return <FiShoppingBag className={cls} aria-hidden="true" />;
  if (name.includes("home") || name.includes("living") || name.includes("furniture"))
    return <FiHome className={cls} aria-hidden="true" />;
  if (name.includes("book") || name.includes("study") || name.includes("education"))
    return <FiBookOpen className={cls} aria-hidden="true" />;
  if (name.includes("beauty") || name.includes("health") || name.includes("care"))
    return <FiSmile className={cls} aria-hidden="true" />;
  if (name.includes("tech") || name.includes("computer") || name.includes("mobile"))
    return <FiCpu className={cls} aria-hidden="true" />;
  if (name.includes("watch") || name.includes("accessory") || name.includes("jewel"))
    return <FiWatch className={cls} aria-hidden="true" />;
  if (name.includes("toy") || name.includes("gift")) return <FiGift className={cls} aria-hidden="true" />;
  return <FiFolder className={cls} aria-hidden="true" />;
}

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  const featured = (categories ?? []).filter((c: Category) => c.status === "ACTIVE").slice(0, 7);

  if (!isLoading && featured.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
          <span className="inline-block border-b-2 border-accent pb-2">
            Shop From <span className="text-accent">Top Categories</span>
          </span>
        </h2>
        <Link
          href="/categories"
          className="flex flex-shrink-0 items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-accent"
        >
          View All <FiChevronRight aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-4 gap-4 sm:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 animate-pulse rounded-full bg-slate-100 sm:h-20 sm:w-20" />
              <div className="h-2.5 w-10 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-4 gap-4 sm:grid-cols-7">
          {featured.map((category) => (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F6F6F6] ring-1 ring-transparent transition-all group-hover:ring-accent sm:h-20 sm:w-20">
                {getCategoryIcon(category.name)}
              </span>
              <span className="truncate text-xs font-medium text-slate-700 sm:text-sm">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}