import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <FiShoppingBag className="text-accent" />
          <span className="font-display font-medium text-foreground">
            Ankara
          </span>
        </div>
        <div className="flex gap-6">
          <Link href="/products" className="hover:text-accent">
            Products
          </Link>
          <Link href="/categories" className="hover:text-accent">
            Categories
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Marketplace. Built by Himel.</p>
      </div>
    </footer>
  );
}