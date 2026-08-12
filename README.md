# Product Marketplace — Client

A modern, responsive storefront and admin dashboard for the Product Marketplace, built with **Next.js**, **TypeScript**, and **HeroUI**. It consumes the [Product Marketplace Server](../product-marketplace-server) API for authentication, catalog browsing, reviews, and order management.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![HeroUI](https://img.shields.io/badge/HeroUI-v3-8B5CF6)](https://heroui.com)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [Authentication & Authorization](#authentication--authorization)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Author](#author)

---

## Overview

This client is a full-featured storefront paired with a role-gated admin dashboard. Shoppers can browse categories and products, leave reviews, and place and track orders. Admins get dedicated CRUD screens for products, categories, orders, reviews, and users — all backed by real-time cache invalidation so the UI reflects every change instantly.

## Features

- 🔐 **JWT-based auth** with cookie-persisted sessions and route-level protection
- 🛍️ **Public storefront** — category browsing, product catalog with filtering, product detail pages with reviews
- 🧾 **Order flow** — place, cancel (own, while pending), and track orders
- ⭐ **Reviews** — create, edit, and delete your own reviews; product pages show live ratings
- 🛠️ **Admin dashboard** — full CRUD for Products, Categories, Orders, Reviews, and Users
- ♻️ **Soft-delete aware UI** — confirmation dialogs before every destructive action
- ⚡ **Real-time updates** — TanStack Query invalidates and refetches after every mutation
- 🎨 **Distinct visual identity** — custom color tokens, Fraunces/Inter/JetBrains Mono type system
- 📱 **Fully responsive** — adaptive navigation, grids, and tables across breakpoints
- 🎬 **Motion-first UI** — Framer Motion transitions across lists, cards, and modals

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI Library | HeroUI v3 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | react-icons |
| Data fetching | Axios + TanStack Query |
| Auth persistence | js-cookie |

## Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── (auth)/{login,register}/
│   │   ├── products/[[id]]/
│   │   ├── categories/
│   │   ├── orders/{new}/
│   │   ├── profile/
│   │   ├── dashboard/
│   │   │   ├── products/{new,[id]/edit}/
│   │   │   ├── categories/{new,[id]/edit}/
│   │   │   ├── orders/
│   │   │   ├── reviews/
│   │   │   └── users/{new,[id]/edit}/
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/          # Navbar, Footer
│   │   ├── products/        # ProductCard, ProductForm
│   │   ├── categories/      # CategoryCard, CategoryForm
│   │   ├── reviews/         # ReviewForm, ReviewList
│   │   ├── orders/          # OrderTable, OrderForm
│   │   ├── users/           # UserForm
│   │   └── ui/              # LoadingSpinner, EmptyState, ConfirmDialog
│   ├── hooks/                # TanStack Query hooks per resource
│   ├── lib/
│   │   ├── api/               # Typed API client + per-resource functions
│   │   └── auth/               # AuthContext, useAuth
│   ├── types/                  # Shared TypeScript interfaces
│   └── middleware.ts             # Route protection (auth + role)
├── .env.local
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- The [backend server](../product-marketplace-server) running locally or deployed

### Installation

```bash
git clone https://github.com/Kz-Himel/product-marketplace-client.git
cd product-marketplace-client
npm install
```

### Configure the API URL

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL — see below
```

### Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API, including the `/api` prefix |

> In production, point this at your deployed backend URL (e.g. `https://your-api.onrender.com/api`).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Type-check and create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page with featured categories |
| `/products` | Public | Product catalog with category filtering |
| `/products/[id]` | Public | Product detail, reviews, order CTA |
| `/categories` | Public | Category browsing |
| `/login`, `/register` | Public | Authentication |
| `/orders` | Logged-in | Personal order history |
| `/orders/new` | Logged-in | Place a new order |
| `/profile` | Logged-in | View/update own account |
| `/dashboard` | Admin | Overview stats |
| `/dashboard/products` | Admin | Product CRUD |
| `/dashboard/categories` | Admin | Category CRUD |
| `/dashboard/orders` | Admin | Order status management |
| `/dashboard/reviews` | Admin | Review moderation |
| `/dashboard/users` | Admin | User management |

## Authentication & Authorization

- On login/register, the API's JWT and user profile are persisted to cookies (`token`, `user`).
- `lib/api/client.ts` attaches `Authorization: Bearer <token>` to every request automatically.
- `middleware.ts` protects `/dashboard/*` (Admin only), and `/orders/*`, `/profile/*` (any logged-in user), redirecting unauthenticated visitors to `/login`.
- The first admin account must be promoted manually via Prisma Studio on the backend (`role: USER → ADMIN`), since there's no existing admin to create one through the API.

## Design System

- **Accent:** deep plum-violet, used for primary actions and active states
- **Price token:** a dedicated gold/marigold color reserved for pricing, distinct from status colors
- **Status colors:** semantic `success` / `warning` / `danger` tokens map onto `ProductStatus`, `OrderStatus`, and `ReviewStatus`
- **Typography:** Fraunces (display), Inter (body/UI), JetBrains Mono (prices, stock, timestamps)
- **Signature motif:** a thin gradient rule beneath the navbar and gold price-tag styling on product cards

## Deployment

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set `NEXT_PUBLIC_API_URL` in the project's Environment Variables to your deployed backend URL.
4. Deploy — Vercel builds with `next build` automatically on every push to `main`.

**Live URL:** `https://<your-project>.vercel.app`

## Author

Built by **Himel** ([@Kz-Himel](https://github.com/Kz-Himel)) as part of the SCIC-13 program.
