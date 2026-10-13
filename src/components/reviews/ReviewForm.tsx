"use client";

import { useState } from "react";
import { FiStar } from "react-icons/fi";
import { Form, TextField, Label, Input, FieldError, Button } from "@heroui/react";
import { useCreateReview } from "@/hooks/useReviews";
import { getErrorMessage } from "@/lib/utils/formatters";

export function ReviewForm({ productId }: { productId: string }) {
  const createReview = useCreateReview();
  const [rating, setRating] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const comment = String(formData.get("comment") || "");

    try {
      await createReview.mutateAsync({ rating, comment, productId });
      setSuccess(true);
      e.currentTarget.reset();
      setRating(5);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not submit review"));
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-border bg-surface p-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Your rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="text-xl"
              aria-label={`Rate ${value} stars`}
            >
              <FiStar
                className={value <= rating ? "fill-price text-price-foreground" : "text-muted"}
              />
            </button>
          ))}
        </div>
      </div>

      <TextField name="comment" isRequired minLength={3}>
        <Label className="text-sm font-medium">Comment</Label>
        <Input placeholder="Share your experience with this product" />
        <FieldError className="text-xs text-danger" />
      </TextField>

      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      {success && (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Review submitted!
        </p>
      )}

      <Button type="submit" size="sm" isDisabled={createReview.isPending}>
        {createReview.isPending ? "Submitting..." : "Submit review"}
      </Button>
    </Form>
  );
}