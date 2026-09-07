"use client";

import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category.types";


const CATEGORY_IMAGE_MAP: Record<string, string> = {
  mobile: "https://cdn-icons-png.flaticon.com/512/644/644458.png", // Phone
  cosmetics: "https://cdn-icons-png.flaticon.com/512/3058/3058988.png", // Cosmetics
  electronics: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png", // Camera / Electronics
  furniture: "https://cdn-icons-png.flaticon.com/512/2628/2628857.png", // Chair / Furniture
  watches: "https://cdn-icons-png.flaticon.com/512/2972/2972531.png", // Smartwatch
  decor: "https://cdn-icons-png.flaticon.com/512/628/628324.png", // Plant / Decor
  accessories: "https://cdn-icons-png.flaticon.com/512/1198/1198308.png", // Jewellery
};

function getCategoryImage(categoryName: string, categoryImageUrl?: string) {
  if (categoryImageUrl) return categoryImageUrl;

  const name = categoryName.toLowerCase();
  for (const key in CATEGORY_IMAGE_MAP) {
    if (name.includes(key)) {
      return CATEGORY_IMAGE_MAP[key];
    }
  }
  // Fallback image
  return "https://cdn-icons-png.flaticon.com/512/3081/3081559.png";
}

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  const featured = (categories ?? []).filter((c: Category) => c.status === "ACTIVE").slice(0, 7);

  if (!isLoading && featured.length === 0) return null;

  return (
    <section className="w-full py-6">
      {/* MegaMart Header Row */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="relative text-base sm:text-lg font-extrabold text-slate-800">
          Shop From <span className="text-sky-600">Top Categories</span>
          {/* Cyan active border line matching design */}
          <span className="absolute -bottom-[13px] left-0 h-[3px] w-full bg-sky-500 rounded-full" />
        </h2>

        <Link
          href="/categories"
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <span>View All</span>
          <FiChevronRight className="text-sm text-sky-500" aria-hidden="true" />
        </Link>
      </div>

      {/* Categories Circles Container */}
      {isLoading ? (
        <div className="mt-8 grid grid-cols-4 gap-6 sm:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="h-20 w-20 animate-pulse rounded-full bg-slate-100 sm:h-24 sm:w-24" />
              <div className="h-3 w-12 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-4 gap-4 sm:grid-cols-7 sm:gap-6">
          {featured.map((category) => {
            const imgUrl = getCategoryImage(category.name, (category as any).image);

            return (
              <Link
                key={category.id}
                href={`/products?categoryId=${category.id}`}
                className="group flex flex-col items-center gap-3 text-center"
              >
                {/* MegaMart Circular Background Card */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F5F5] transition-all duration-300 group-hover:bg-white group-hover:shadow-lg group-hover:scale-105 sm:h-24 sm:w-24">
                  <img
                    src={imgUrl}
                    alt={category.name}
                    className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
                  />
                </div>

                {/* Category Title */}
                <span className="truncate max-w-[100px] text-xs font-semibold text-slate-700 group-hover:text-sky-600 transition-colors sm:text-sm">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}