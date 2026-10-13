# MegaMart Design System & Architectural Foundation

This document details the architectural foundation and reusable design system established in Phase 2 for MegaMart.

---

## 1. Design Tokens

### Brand & Semantic Colors

| Token Name | Light Value | Dark Value | Purpose |
|---|---|---|---|
| `--primary` | `#008ECC` | `#38B6E8` | Primary brand accent, main CTAs, active indicators |
| `--primary-hover` | `#0073A8` | `#50C5F2` | Interactive hover state for primary elements |
| `--primary-light` | `#EBF6FC` | `#0D2838` | Subtle tint for active tabs, icon backgrounds |
| `--deal` | `#F59E0B` | `#FBBF54` | Promotional banners, discount chips, ratings |
| `--price` | `#008ECC` | `#38B6E8` | E-commerce price highlights |
| `--success` | `#10B981` | `#34D399` | In-stock tags, completed orders, success feedback |
| `--warning` | `#F59E0B` | `#FBBF24` | Low stock, pending states |
| `--danger` | `#F43F5E` | `#FB7185` | Out-of-stock, errors, cancellation alerts |
| `--background` | `#FFFFFF` | `#0B0F19` | Application page background |
| `--surface` | `#FFFFFF` | `#131A29` | Card and modal container background |
| `--surface-secondary` | `#F8FAFC` | `#1E293B` | Subtle panel backdrops |
| `--border` | `#E2E8F0` | `#2A364F` | Standard structural borders |
| `--muted` | `#64748B` | `#94A3B8` | Secondary labels and helper text |
| `--foreground` | `#0F172A` | `#F8FAFC` | High-contrast body typography |
| `--navy` | `#1A2238` | `#111728` | Hero and merchandising dark sections |

### Typography Scale

- **Display & Headings:** `Poppins` / `Inter` (`--font-display` / `--font-sans`)
- **Prices & Numeric Counters:** `JetBrains Mono` (`--font-mono`, tabular numbers)
- **Hierarchy:**
  - `Hero Display`: 32px - 48px (`font-extrabold tracking-tight`)
  - `Section Title`: 20px - 28px (`font-bold text-slate-900`)
  - `Card Title`: 14px - 16px (`font-bold text-slate-800`)
  - `Body`: 13px - 14px (`text-slate-600 leading-relaxed`)
  - `Caption / Micro`: 11px - 12px (`font-medium text-slate-400`)

---

## 2. Reusable UI Components Directory

All core UI components are located in `src/components/ui/` and exported via `src/components/ui/index.ts`.

### 1. `Button` (`src/components/ui/Button.tsx`)
Multi-variant, accessible button supporting loading states and icon slots.
```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" leftIcon={<FiShoppingCart />}>
  Add to Cart
</Button>
<Button variant="outline" size="sm">Quick View</Button>
<Button variant="deal" size="md">Claim Offer</Button>
```
**Variants:** `primary` | `secondary` | `outline` | `ghost` | `deal` | `danger` | `subtle`  
**Sizes:** `xs` | `sm` | `md` | `lg`

### 2. `Badge` (`src/components/ui/Badge.tsx`)
Pill or rounded badge with optional pulse dot.
```tsx
import { Badge } from "@/components/ui";

<Badge variant="success" size="xs" showDot>In stock</Badge>
<Badge variant="deal" size="sm">Up to 40% Off</Badge>
<Badge variant="danger" size="xs">Out of stock</Badge>
```

### 3. `Input` / `FormField` / `Textarea` (`src/components/ui/Input.tsx`)
Unified form fields with built-in validation states, helper text, and icon adornments.
```tsx
import { Input, FormField } from "@/components/ui";

<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  leftIcon={<FiMail />}
  error={errors.email}
  required
/>
```

### 4. `PriceDisplay` (`src/components/ui/PriceDisplay.tsx`)
Commercial price display supporting compare prices, discount percentage pills, and tabular alignment.
```tsx
import { PriceDisplay } from "@/components/ui";

<PriceDisplay price={49.99} comparePrice={79.99} size="lg" showSavingsBadge />
```

### 5. `Skeleton` (`src/components/ui/Skeleton.tsx`)
Animated shimmer loaders for cards, avatars, and text blocks.
```tsx
import { Skeleton, SkeletonText, SkeletonCircle } from "@/components/ui";

<Skeleton className="h-48 w-full rounded-2xl" />
<SkeletonText lines={3} />
```

### 6. `Modal` (`src/components/ui/Modal.tsx`)
Accessible dialog with backdrop blur, smooth exit animations, ESC key handling, and focus lock.
```tsx
import { Modal } from "@/components/ui";

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Product Quick View" size="lg">
  {content}
</Modal>
```

### 7. `Drawer` (`src/components/ui/Drawer.tsx`)
Sliding side drawer from right or left for slide-out mini-cart, mobile navigation, and filter sheets.
```tsx
import { Drawer } from "@/components/ui";

<Drawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} side="right" title="Your Cart">
  {cartItems}
</Drawer>
```

### 8. `Toast` (`src/components/ui/Toast.tsx`)
Global notification system with `ToastProvider` and reactive `useToast()` hook.
```tsx
import { useToast } from "@/components/ui";

const { success, error } = useToast();
success("Added to Cart!", "Item was placed in your shopping cart.");
```

### 9. `FeedbackAlert` (`src/components/ui/FeedbackAlert.tsx`)
Inline contextual alert banners for pages and forms.
```tsx
import { FeedbackAlert } from "@/components/ui";

<FeedbackAlert variant="warning" title="Limited Stock">
  Only 2 units remain for this model.
</FeedbackAlert>
```

### 10. `ProductCard` (`src/components/products/ProductCard.tsx`)
Production-grade e-commerce product card featuring:
- High-contrast product imagery with fallback icons.
- Real-time stock status badge (`In stock`, `Only X left`, `Out of stock`).
- Wishlist heart toggle button.
- Rating summary and review counter.
- `PriceDisplay` component.
- Quick add-to-cart or view-details action.

---

## 3. Architecture & Folder Structure

```
megamart-client/
├── src/
│   ├── app/                      # Next.js App Router pages, layouts, and route groups
│   │   ├── (auth)/               # Login & Register
│   │   ├── account/              # Customer activity, orders, profile
│   │   ├── categories/           # Category catalog
│   │   ├── dashboard/            # Admin console (products, categories, orders, users, reviews)
│   │   ├── orders/               # Customer orders list & placement
│   │   ├── products/             # Product discovery catalog & product detail [id]
│   │   ├── globals.css           # Design tokens, theme variables, and Tailwind imports
│   │   ├── layout.tsx            # Root layout with fonts, navbar, footer, providers
│   │   └── providers.tsx         # React Query, AuthProvider, ToastProvider
│   ├── components/
│   │   ├── layout/               # Navbar, Footer, CategoryNav
│   │   ├── home/                 # HeroSection, FeaturedProducts, CategoriesSection, Testimonials
│   │   ├── products/             # ProductCard, ProductGrid, ProductCardSkeleton, ProductForm
│   │   ├── ui/                   # Design System: Button, Badge, Input, Modal, Drawer, Toast...
│   │   ├── orders/               # OrderTable, OrderForm
│   │   └── reviews/              # ReviewForm, ReviewList
│   ├── hooks/                    # TanStack React Query hooks per domain entity
│   ├── lib/
│   │   ├── api/                  # Axios HTTP client and typed resource APIs
│   │   ├── auth/                 # AuthContext and useAuth
│   │   └── utils/                # cn helper, formatters (formatCurrency, formatDate, getErrorMessage)
│   ├── types/                    # Shared TypeScript interfaces
│   └── middleware.ts             # Edge route protection for authenticated and admin routes
```
