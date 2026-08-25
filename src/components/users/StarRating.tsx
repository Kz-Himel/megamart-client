import { FaStar } from "react-icons/fa6";

export function StarRating({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < rounded ? "text-price" : "text-border"}
        />
      ))}
    </div>
  );
}