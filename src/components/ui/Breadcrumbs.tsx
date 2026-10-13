import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-slate-500", className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 transition-colors hover:text-[#008ECC]"
            title="Home"
          >
            <FiHome className="text-sm" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              <FiChevronRight className="text-slate-300 text-xs shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-xs"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[#008ECC] text-slate-500 truncate max-w-[120px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
