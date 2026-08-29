# KenDji Luxury • Maison de Haute Parure & Joaillerie (Algeria)

> A modern, high-conversion, production-ready ecommerce boutique engineered for the Algerian luxury jewelry market with Cash on Delivery (COD), Wilaya-based logistics, and a refined **Modern Monochrome Luxury** design aesthetic.

---

## 💎 Project Overview

- **Brand:** KenDji Luxury
- **Market:** Algeria (58 Wilayas + Communes)
- **Commerce Model:** 100% Cash-on-Delivery (COD) in Algerian Dinar (DZD)
- **Catalog Size:** 25 curated, approved luxury jewelry creations & parures
- **Visual Direction:** Modern Monochrome Luxury (Bodoni Moda, Montserrat, Ivory, Charcoal, Rose Gold accents, minimal geometry)

---

## 🏛️ Architecture & Tech Stack

- **Framework:** Next.js 16+ (App Router, Turbopack, Server Components & Actions)
- **Styling:** Tailwind CSS v4, Vanilla CSS tokens, shadcn/ui components
- **Typography:** Bodoni Moda (Editorial serif) & Montserrat (Geometric sans)
- **Database & Auth:** Supabase (PostgreSQL, Row-Level Security, Server-side SSR Auth)
- **Animations:** Motion (Framer Motion) for subtle luxury interactions
- **Logistics Integration:** Provider-neutral Courier Abstraction (`MockCourierAdapter`, `YalidineCourierAdapter`, `ZrExpressCourierAdapter`)
- **Operations & Admin:** Full Back-office CMS for products, collections, categories, inventory, COD order processing, and cash reconciliation

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ (or Node 24)
- npm, pnpm, or bun

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```ini
# Public Storefront Configuration
NEXT_PUBLIC_SITE_URL=https://kendji-luxury.dz
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-Only Security Secrets (Never exposed to browser)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Courier Integration (MOCK_EXPRESS | YALIDINE | ZR_EXPRESS)
COURIER_PROVIDER=MOCK_EXPRESS
YALIDINE_API_ID=
YALIDINE_API_KEY=
ZR_EXPRESS_API_KEY=
ZR_EXPRESS_API_SECRET=
```

### 3. Install & Run Development Server
```bash
npm install
npm run dev
```

Visit:
- **Public Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin CMS:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🧪 Testing & Validation Suites

Execute the comprehensive automated test suites:

```bash
# Phase 10: Cart & COD Checkout Tests
npx tsx scripts/test_cart_and_checkout.ts

# Phase 11: Order Operations, Inventory & Courier Tests
npx tsx scripts/test_operations_and_courier.ts

# Phase 12: Production Readiness, SEO & Security QA
npx tsx scripts/test_phase12_final_qa.ts

# Code Quality & Production Build
npx eslint src
npm run build
```

---

## 📦 Key Directory Structure

```text
├── docs/                      # Architectural & operational documentation
│   ├── kendji-design-system.md
│   ├── commerce-operations.md
│   └── courier-integration.md
├── public/                    # Approved web images, icons, and backgrounds
│   ├── backgrounds/           # 6 approved luxury ambient backgrounds
│   └── products/              # 25 approved product image folders
├── src/
│   ├── app/
│   │   ├── (storefront)/      # Public buyer experience (Home, PDP, Shop, Cart, Checkout)
│   │   ├── admin/             # Back-office operations (Orders, Inventory, Products, CMS)
│   │   ├── robots.ts          # Search engine crawl control (Blocks /admin & /checkout)
│   │   ├── sitemap.ts         # Dynamic XML Sitemap (All 25 products & collections)
│   │   └── layout.tsx         # Global typography & root SEO OpenGraph metadata
│   ├── components/
│   │   ├── storefront/        # Header, Footer, Hero, Product Galleries, Cart Drawer
│   │   ├── admin/             # Operations panels, Stock adjustment tables, Forms
│   │   └── ui/                # Core accessible UI primitives
│   └── lib/
│       ├── catalog.ts         # 25-product catalog source of truth
│       ├── algeria-cities.ts  # 58 Wilayas & Communes with Domicile/Stop-Desk rates
│       ├── commerce/          # State machine, Inventory, Timeline, COD Reconciliation
│       ├── courier/           # Transport abstraction & provider adapters
│       └── validation/        # Algerian phone & form schemas
└── supabase/
    └── migrations/            # Database schema & RLS policies
```

---

## 🛡️ Security & Privacy Guardrails

1. **Server-Side Price Authority:** Cart totals and delivery rates are recalculated and validated strictly on the server during checkout. Client tampering is impossible.
2. **Credential Isolation:** Supabase Service Role and Courier API secrets are never bundled into client-side code.
3. **Admin Route Protection:** All `/admin/*` routes are protected via server-side session middleware.
4. **Data Privacy:** Customer records and order history are shielded via PostgreSQL Row-Level Security (RLS).
5. **No Fabricated Data:** Authentic descriptions, transparent pricing in DZD, and zero artificial reviews or false claims.

---

## 🚢 Deployment (Vercel)

1. Connect repository to Vercel.
2. Ensure framework preset is set to **Next.js**.
3. Set the production environment variables from `.env.example`.
4. Deploy with `npm run build`.
