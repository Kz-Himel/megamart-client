/**
 * Utility function to conditionally combine class names.
 * Zero-dependency, lightweight, and type-safe.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
