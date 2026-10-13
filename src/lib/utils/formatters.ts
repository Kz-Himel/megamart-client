/**
 * Standardized formatting helpers for the MegaMart application.
 */

/**
 * Format a number as USD currency string (e.g., "$24.99").
 */
export function formatCurrency(amount: number, currency: string = "$"): string {
  if (isNaN(amount)) return `${currency}0.00`;
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * Format date string into human-readable format (e.g. "Oct 12, 2026").
 */
export function formatDate(dateString: string | Date): string {
  try {
    const d = typeof dateString === "string" ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return String(dateString);
  }
}

/**
 * Safely extract an error message string from an unknown catch error.
 */
export function getErrorMessage(err: unknown, fallback: string = "An unexpected error occurred"): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  return fallback;
}

/**
 * Calculate discount percentage from original/compare price and current price.
 */
export function calculateSavingsPercent(price: number, comparePrice?: number | null): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  const savings = ((comparePrice - price) / comparePrice) * 100;
  return Math.round(savings);
}
