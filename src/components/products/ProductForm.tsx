"use client";

import { useRef, useState } from "react";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { 
  FiUploadCloud, 
  FiX, 
  FiImage, 
  FiPackage, 
  FiDollarSign, 
  FiLayers, 
  FiCheckCircle, 
  FiFileText 
} from "react-icons/fi";
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
    <Form 
      onSubmit={handleSubmit} 
      className="w-full max-w-xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* Product Name */}
      <TextField name="name" isRequired defaultValue={initialValues?.name}>
        <Label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <FiPackage className="text-sky-600" /> Name
        </Label>
        <Input 
          placeholder="e.g. Wireless Noise-Canceling Headphones" 
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
        <FieldError className="mt-1 text-xs font-medium text-rose-500" />
      </TextField>

      {/* Description */}
      <TextField name="description" defaultValue={initialValues?.description ?? ""}>
        <Label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <FiFileText className="text-sky-600" /> Description
        </Label>
        <Input 
          placeholder="Short product overview and specifications" 
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </TextField>

      {/* Price & Stock Grid */}
      <div className="grid grid-cols-2 gap-4">
        <TextField name="price" type="number" isRequired defaultValue={String(initialValues?.price ?? "")}>
          <Label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <FiDollarSign className="text-sky-600" /> Price ($)
          </Label>
          <Input 
            type="number" 
            step="0.01" 
            min={0} 
            placeholder="0.00"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
          <FieldError className="mt-1 text-xs font-medium text-rose-500" />
        </TextField>

        <TextField name="stock" type="number" isRequired defaultValue={String(initialValues?.stock ?? "")}>
          <Label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <FiLayers className="text-sky-600" /> Stock Quantity
          </Label>
          <Input 
            type="number" 
            min={0} 
            placeholder="10"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
          <FieldError className="mt-1 text-xs font-medium text-rose-500" />
        </TextField>
      </div>

      {/* Product Image Section */}
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <FiImage className="text-sky-600" /> Product Image
        </label>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {/* Image Box - Fitted without cropping */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Product preview" className="h-full w-full object-contain" />
            ) : (
              <FiImage className="text-2xl text-slate-300" />
            )}
          </div>

          <div className="flex-1 space-y-1.5">
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
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600 transition-colors hover:bg-sky-500 hover:text-white"
              >
                <FiUploadCloud className="text-sm" />
                {isUploading ? "Uploading..." : imageUrl ? "Change Image" : "Upload Image"}
              </label>

              {imageUrl && !isUploading && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  aria-label="Remove image"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <FiX />
                </button>
              )}
            </div>

            <p className="text-[11px] font-medium text-slate-400">PNG or JPG, up to 5MB.</p>

            {uploadError && <p className="text-xs font-semibold text-rose-500">{uploadError}</p>}
          </div>
        </div>
      </div>

      {/* Category & Status Select */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <FiLayers className="text-sky-600" /> Category
          </label>
          <select
            value={categoryId || categories?.[0]?.id || ""}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <FiCheckCircle className="text-sky-600" /> Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
          </select>
        </div>
      </div>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600">{error}</p>}

      {/* Submit CTA */}
      <Button 
        type="submit" 
        isDisabled={isSubmitting || isUploading}
        className="w-full rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-sky-600 active:scale-[0.99] disabled:opacity-50"
      >
        {isSubmitting ? "Saving Product..." : submitLabel}
      </Button>
    </Form>
  );
}