"use client";

import { FiFolder } from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const visible = categories?.filter((c) => c.status === "ACTIVE") ?? [];

  return (
    <div className="mx-auto max-w-6xl py-4 space-y-6">
      {/* Header Section */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Explore Categories</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Browse our wide range of products organized by category
        </p>
      </div>

      {isLoading && <LoadingSpinner label="Loading categories..." />}

      {isError && (
        <EmptyState
          icon={<FiFolder className="text-rose-500" />}
          title="Couldn't load categories"
          description="Something went wrong while fetching categories. Please try again."
        />
      )}

      {!isLoading && !isError && visible.length === 0 && (
        <EmptyState
          icon={<FiFolder className="text-indigo-500" />}
          title="No categories yet"
          description="Categories will show up here once an admin creates them."
        />
      )}

      {visible.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}