"use client";

import { useRef, useState } from "react";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { Product, ProductPayload, ProductStatus } from "../../types/products.types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { uploadApi } from "@/lib/api/upload.api";

interface ProductFormProps {
  initialValues?: Product;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save product",
}: ProductFormProps) {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ProductStatus>(initialValues?.status ?? "ACTIVE");
  const [categoryId, setCategoryId] = useState(
    initialValues?.categoryId ?? ""
  );
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loadingCategories) return <LoadingSpinner label="Loading categories..." />;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadApi.uploadProductImage(file);
      setImageUrl(url);
    } catch (err: any) {
      setUploadError(err.message || "Image upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "");
    const description = String(formData.get("description") || "");
    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);

    const finalCategoryId = categoryId || categories?.[0]?.id || "";
    if (!finalCategoryId) {
      setError("Please select a category");
      return;
    }

    try {
      await onSubmit({
        name,
        description,
        price,
        stock,
        image: imageUrl || undefined,
        status,
        categoryId: finalCategoryId,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-6">
      <TextField name="name" isRequired defaultValue={initialValues?.name}>
        <Label className="text-sm font-medium">Name</Label>
        <Input placeholder="e.g. Wireless Headphones" />
        <FieldError className="text-xs text-danger" />
      </TextField>

      <TextField name="description" defaultValue={initialValues?.description ?? ""}>
        <Label className="text-sm font-medium">Description</Label>
        <Input placeholder="Short description" />
      </TextField>

      <div className="grid grid-cols-2 gap-4">
        <TextField name="price" type="number" isRequired defaultValue={String(initialValues?.price ?? "")}>
          <Label className="text-sm font-medium">Price ($)</Label>
          <Input type="number" step="0.01" min={0} />
          <FieldError className="text-xs text-danger" />
        </TextField>

        <TextField name="stock" type="number" isRequired defaultValue={String(initialValues?.stock ?? "")}>
          <Label className="text-sm font-medium">Stock</Label>
          <Input type="number" min={0} />
          <FieldError className="text-xs text-danger" />
        </TextField>
      </div>

      {/* Product image — upload from desktop, sent to the backend upload route */}
      <div>
        <label className="mb-1 block text-sm font-medium">Product image</label>

        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Product preview" className="h-full w-full object-cover" />
            ) : (
              <FiImage className="text-2xl text-slate-300" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="product-image-upload"
            />
            <div className="flex items-center gap-2">
              <label
                htmlFor="product-image-upload"
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-accent hover:text-accent"
              >
                <FiUploadCloud />
                {isUploading ? "Uploading..." : imageUrl ? "Replace image" : "Upload image"}
              </label>

              {imageUrl && !isUploading && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  aria-label="Remove image"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                >
                  <FiX />
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">PNG or JPG, up to 5MB.</p>

            {uploadError && <p className="text-xs text-danger">{uploadError}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={categoryId || categories?.[0]?.id || ""}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
          </select>
        </div>
      </div>

      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

      <Button type="submit" className="w-full" isDisabled={isSubmitting || isUploading}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </Form>
  );
}