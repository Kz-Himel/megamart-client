"use client";

import { useState } from "react";
import { Form, TextField, Label, Input, TextArea, FieldError, Button } from "@heroui/react";
import { Category, CategoryPayload, CategoryStatus } from "@/types/category.types";
import { FiFolder, FiImage, FiFileText, FiCheckCircle } from "react-icons/fi";

interface CategoryFormProps {
  initialData?: Category;
  isSubmitting?: boolean;
  onSubmit: (payload: CategoryPayload) => void;
}

export function CategoryForm({ initialData, isSubmitting, onSubmit }: CategoryFormProps) {
  const [status, setStatus] = useState<CategoryStatus>(initialData?.status ?? "ACTIVE");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || "") || undefined,
      image: String(formData.get("image") || "") || undefined,
      status,
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Name */}
      <TextField name="name" isRequired minLength={2} defaultValue={initialData?.name}>
        <Label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <FiFolder className="text-sky-600" /> Name
        </Label>
        <Input 
          placeholder="e.g. Consumer Electronics" 
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
        <FieldError className="mt-1 text-xs font-medium text-rose-500" />
      </TextField>

      {/* Image URL Field */}
      <TextField name="image" defaultValue={initialData?.image ?? ""}>
        <Label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <FiImage className="text-sky-600" /> Image URL (Optional)
        </Label>
        <Input 
          placeholder="https://example.com/category-image.png" 
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </TextField>

      {/* Description */}
      <TextField name="description" defaultValue={initialData?.description ?? ""}>
        <Label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <FiFileText className="text-sky-600" /> Description
        </Label>
        <TextArea 
          placeholder="Brief description about the category..." 
          rows={3} 
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </TextField>

      {/* Status Select */}
      <div>
        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <FiCheckCircle className="text-sky-600" /> Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CategoryStatus)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Action Button */}
      <Button 
        type="submit" 
        isDisabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-sky-600 active:scale-[0.99] disabled:opacity-50"
      >
        {isSubmitting ? "Saving Category..." : initialData ? "Update Category" : "Create Category"}
      </Button>
    </Form>
  );
}