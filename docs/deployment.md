# KenDji Luxury — Production Deployment Guide & Architecture

> **Maison de Haute Parure & Joaillerie (Algeria)**  
> Production Infrastructure, Database Provisioning, Vercel Hosting & Security Guardrails.

---

## 1. System Architecture Overview

```
                           ┌───────────────────────────────┐
                           │      Vercel Edge Network      │
                           │   (Next.js App Router 16+)    │
                           └───────────────┬───────────────┘
                                           │
                   ┌───────────────────────┴───────────────────────┐
                   ▼                                               ▼
     ┌───────────────────────────┐                   ┌───────────────────────────┐
     │   Public Buyer Surface    │                   │   Operations & Admin CMS  │
     │  - SSG / ISR Catalog      │                   │  - Dynamic SSR Auth       │
     │  - COD Checkout Form      │                   │  - Order Fulfillment      │
     │  - 58 Wilayas Logistics   │                   │  - Cash Reconciliation    │
     └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                   │                                               │
                   └───────────────────────┬───────────────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │      Supabase PostgreSQL      │
                           │  - 13 Relational Tables       │
                           │  - Row-Level Security (RLS)   │
                           │  - 'kendji-media' Bucket      │
                           └───────────────────────────────┘
```

---

## 2. GitHub Repository Configuration

- **Repository:** `dripidin/kendji-luxury`
- **Default Production Branch:** `main`
- **Remote URL:** `https://github.com/dripidin/kendji-luxury.git`
- **CI/CD Hook:** Connected to Vercel for automated production builds on push to `main`.

### Push Workflow
```bash
# Verify working tree status and untracked files
git status

# Add changes and commit
git add .
git commit -m "feat: your descriptive commit message"

# Push to production branch
git push origin main
```

---

## 3. Supabase Cloud Setup & Verification

- **Project Name:** `KenDji`
- **Project Ref:** `ifdkizciatxizzbplqbp`
- **Region:** `eu-central-1` (Frankfurt)
- **Database Engine:** PostgreSQL 15+ with pg_trgm & UUID extensions

### Database Relational Schema (13 Public Tables)
1. `categories` — Jewelry product classifications (Necklaces, Bracelets, Sets, Rings, Earrings)
2. `collections` — Editorial curated groupings (Signature Motifs, Romantic Nature, Urban Iconic, Personalized Cultural)
3. `products` — Core catalog entries (25 approved luxury pieces with price, SKU, metadata)
4. `product_collections` — Many-to-many relationship mapping
5. `variants` — Ring sizes, chain lengths, color finishes, and variant pricing
6. `product_media` — Multi-angle photography and zoom gallery assets
7. `customers` — Customer registry with Algerian phone verification & shipping addresses
8. `orders` — COD order headers with server-authoritative calculations
9. `order_items` — Snapshot line items per order
10. `deliveries` — Tracking and courier assignment (Wilaya, Commune, Domicile vs Stop-Desk)
11. `site_settings` — Dynamic global configuration, shipping fees, notification toggles
12. `order_timeline_events` — Full immutable operational audit trail
13. `cod_reconciliations` — Cash-on-delivery tracking, remittance receipts, courier cash reconciliation

### Storage Buckets
- **Bucket ID:** `kendji-media`
- **Public Access:** Enabled for public image delivery
- **Permissions:** Read-only public SELECT, authenticated INSERT/UPDATE for Admin users.

---

## 4. Vercel Production Configuration

- **Project Name:** `kendji-luxury`
- **Framework Preset:** Next.js
- **Node.js Version:** 20.x / 24.x
- **Build Command:** `npm run build` / `next build`
- **Output Directory:** `.next`

### Production Environment Variables

| Variable Name | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Production & Preview | Canonical base URL (e.g. `https://kendji-luxury.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Production & Preview | Supabase project API endpoint (`https://ifdkizciatxizzbplqbp.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production & Preview | Supabase client anon public API key |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`| Production & Preview | Supabase publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only (Production) | Elevated service-role key for server actions & backend reconciliation |
| `SUPABASE_SECRET_KEY` | Server-Only (Production) | Secret key backup for API routes |
| `COURIER_PROVIDER` | Server-Only (Production) | Active logistics provider adapter (`MOCK_EXPRESS`, `YALIDINE`, `ZR_EXPRESS`) |
| `TELEGRAM_BOT_TOKEN` | Server-Only (Optional) | Telegram bot token for real-time dispatch alerts |
| `TELEGRAM_CHAT_ID` | Server-Only (Optional) | Target Telegram channel/chat ID for order notifications |
| `META_CAPI_ACCESS_TOKEN` | Server-Only (Optional) | Meta Conversions API server-side purchase tracking |

---

## 5. Security & Production Guardrails

1. **Zero Hardcoded Secrets:** All API keys, database credentials, and service tokens are resolved strictly via environment variables. Fallback secrets in code are strictly forbidden.
2. **Server-Side Price Authority:** Cart subtotal, discount logic, and 58-Wilaya delivery fees are calculated and enforced strictly in server actions during checkout.
3. **Database RLS Policies:** PostgreSQL Row-Level Security guarantees customers only access authorized data, and writes to catalog/settings require admin authentication.
4. **Secret Masking:** Back-office APIs (`/api/admin/settings`) mask critical tokens (`telegram.bot_token`, `meta.capi_token`) so secrets are never returned in plain text to client browsers.
5. **SEO & Indexing Control:** Admin back-office (`/admin/*`) and private checkout flows (`/checkout/*`) are blocked in `robots.txt`, while all 25 luxury product canonical URLs and collections are indexed via dynamic `sitemap.xml`.

---

## 6. Verification Runbook & Health Checks

Execute the local and remote verification suites:

```bash
# 1. Supabase Cloud Connection & Catalog Verification
npx tsx scripts/test_supabase_connection.ts

# 2. Storefront Catalog & Category Filter Suites
npx tsx scripts/test_phase14_storefront_catalog.ts

# 3. Editorial Collections Verification Suite
npx tsx scripts/test_phase15_collections_storefront.ts

# 4. Media Storage & CMS Verification Suite
npx tsx scripts/test_phase16_cms_and_media.ts

# 5. Site Settings, Wilaya Rates & i18n Suite
npx tsx scripts/test_phase17_settings_and_i18n.ts

# 6. COD Operations, Inventory, Timeline & Courier Suite
npx tsx scripts/test_operations_and_courier.ts

# 7. Production Build Verification
npm run build
```
