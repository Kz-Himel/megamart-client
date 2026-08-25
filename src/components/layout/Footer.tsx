import Link from "next/link";
import {
  FiShoppingBag,
  FiInstagram,
  FiTwitter,
  FiFacebook,
} from "react-icons/fi";

const SHOP_LINKS = [
  { href: "/products", label: "All products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "My orders" },
];

const ACCOUNT_LINKS = [
  { href: "/register", label: "Create account" },
  { href: "/login", label: "Log in" },
  { href: "/profile", label: "Profile" },
];

const SOCIALS = [
  { href: "#", label: "Instagram", Icon: FiInstagram },
  { href: "#", label: "Twitter", Icon: FiTwitter },
  { href: "#", label: "Facebook", Icon: FiFacebook },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <FiShoppingBag />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                Ankara
              </span>
            </Link>
            <p className="mt-3 max-w-[22ch] text-sm text-muted">
              A marketplace woven around real stock, real reviews, real
              sellers.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Shop</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Account</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Support</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <li>Built by Himel</li>
              <li>Next.js · Express · Prisma</li>
            </ul>
          </div>
        </div>

        <div className="stitch-divider mt-10" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Ankara Marketplace. All rights reserved.</p>
          <p className="font-mono">Built by Himel</p>
        </div>
      </div>
    </footer>
  );
}