# FLAYA Redesign — Project & Ownership Guide

Companion to `README.md`. This file documents **what the project is**, **the complete
tech stack**, **how to buy it**, and **where it can be sold / deployed** — aimed at
whoever owns the commercial conversation with FLAYA.

---

## 1 · Project snapshot

**What shipped:** a fully interactive, mobile-first redesign prototype of flaya.store —
White Premium by default, Light Black on toggle, ~104 styles across the real live
collections (Velvet Abaya, Armani Silk, Aura, Emirati Satin, Capsule + Atelier line),
instant filters, 8-way sort, live UAE order-cut-off countdown, geo-gated free-delivery
progress, Google-Pay express checkout, real policy pages, and all 14 analytics events.

| Metric | Value |
| --- | --- |
| Products modelled | 104 unique IDs (no collisions — audited) |
| Colour families | 11 (Black → Terracotta matrix) |
| Pages | 8 (Home, PLP, PDP, Cart, Checkout, About, Delivery & Exchanges, Contact) |
| Build output | single `dist/index.html` · ~165 KB gzipped |
| TypeScript errors | 0 (`tsc --noEmit`) |
| Image URL audit | 200+ checks, all `200 OK` |

**Price range modelled (AED):** 399 – 1,690 · on-sale Emirati Satin 749–799 (was 999).

---

## 2 · Complete tech stack (who uses what & why it matters)

| Layer | Choice | Why it matters for production |
| --- | --- | --- |
| UI framework | **React 19** + **Vite 7** + **TypeScript (strict, 0 errors)** | Component parity with a Shopify-headless build; type safety de-risks the hand-to-Liquid port |
| Styling | **Tailwind CSS v4** design tokens (`@theme`) | The entire light/dark pair is variable-driven — brand recolors are one file |
| Animation | **Framer Motion 12** | Physics-based drawers, slideshows, layout FLIP — directly portable to production |
| Icons | **Lucide** + bespoke brand/payment SVGs | No heavy 3rd-party icon libs; brand marks are inline (a11y-labelled, theme-aware) |
| Type | **Fraunces** + **Manrope** (Google Fonts) | ≤2 families per premium audit |
| State | **React Context** (`StoreContext`) | cart · wishlist · region · theme · toasts — no Redux overhead |
| Routing | **Hash router** | Zero server config; runs as a single static file anywhere |
| Imagery | **Pexels CDN** with responsive crop params | Placeholder only. **FLAYA must supply final photography** with web+ad rights; swap-in is one constant per pool |
| Analytics | `window.dataLayer` event bus | Event names lifted straight from the audit — maps 1-to-1 to a GTM import |
| Build | `vite-plugin-singlefile` | Portable artifact for staging review |

**Not in scope (by design):** no backend, database, auth, or payments — prototype checkout
simulates only. All commerce must run through FLAYA's Shopify account at go-live.

---

## 3 · How to buy this prototype (rights & licensing)

Work is licensed, not transferred outright. Three clean paths:

### Option A — FLAYA internal use (recommended)
1. Work-for-hire: **full exclusive rights** for the official FLAYA store go to FLAYA FZ-LLC.
2. Before final payment, hand-off checklist:
   - Swap Pexels placeholders → FLAYA-owned photography (web + advertising rights).
   - Swap dummy reviews/UGC → genuine, permission-cleared content.
   - Replace WhatsApp placeholder number with the live line.
   - Connect `dataLayer` events to the real GTM container.
   - Port to Shopify (Liquid sections + Theme Settings) or headless via Storefront API.
   - Legal review of Delivery & Exchange copy for the host jurisdiction.
3. Terms: **50% on sign-off · 50% on delivery** · repo + build pipeline + docs transfer on
   final payment · 30-day bug-fix window post-delivery.

### Option B — SaaS / partnership
Developer retains codebase ownership; FLAYA licenses hosting, support & update packs.
No resale, no white-label.

### Option C — Template resale (restricted)
If resold as a generic theme:
- FLAYA identity (name, wordmark, founders' story, brand copy) is **not transferable**;
  buyers must re-brand entirely.
- All stock photography must be replaced or re-licensed per Pexels terms.
- Listed separately from any FLAYA-exclusive agreement.

---

## 4 · Where it can be sold / deployed

Region logic is data-driven (`src/lib/shop.ts`) — new markets are registry entries,
not code. Currency modelled: AED · SAR · GBP · USD · EUR.

| Region | Status | Conditions to enable |
| --- | --- | --- |
| **UAE & Dubai (home)** | ✅ Ready now | Primary commercial zone — next-day logic, AED, WhatsApp commerce all modelled |
| **GCC (KSA, Kuwait, Qatar, Bahrain, Oman)** | ✅ Ready | Add SAR/KWD/QAR currencies + AR locale |
| **UK / EU** | ✅ Ready (with policy swap) | GBP/EUR built; exchange-only policy must be reconciled with 14-day withdrawal right before marketing |
| **USA / Canada** | ⚠️ With review | USD built; SDS copy for 5–7-day transit; final-sale copy needs state-level review |
| **Pakistan / South Asia** | ⚠️ With review | Confirm payment gateways / COD rules before enabling |
| **Rest of world** | ⚠️ Case-by-case | Shipping tables, duties, returns law must be mapped per destination |

### May NOT be deployed
- Under the FLAYA name, brand assets, or founders' story without written licence (all paths).
- In any jurisdiction where an **exchange-only** policy breaches mandatory refund law
  without the policy module being swapped first.
- As an "abaya theme" on marketplaces without the Option C marketplace licence.

---

## 5 · Acceptance criteria snapshot (staging review list)

- Free-delivery progress bar visible **only** for UAE region (verify via header selector).
- Colour swatches switch the correct variant & gallery on PLP and PDP; sold-out states
  struck-through everywhere.
- Order countdown counts to the 8:00 PM GST cut-off and updates the "receive by" date.
- Size Guide opens from every PDP across all sizes incl. One size.
- Sticky Add-to-Bag on mobile appears after the main CTA scrolls out (no product image).
- WhatsApp deep link carries product name, URL, colour, size.
- Exact one floating WhatsApp button; social row shows IG · Pinterest · TikTok · Facebook · WhatsApp.
- Filters apply instantly; "2XL" shows as coming soon; every sort option works.
- All 14 analytics events reach `window.dataLayer`.
- Theme toggle flips the full palette and persists across reloads.

---

## 6 · Handover package (ships on purchase)

1. Full source (React/Vite repo) + build instructions (`README.md`).
2. Design tokens & component inventory (`src/index.css`, `/components`, `/pages`).
3. GTM import map for all 14 events (`src/lib/shop.ts`).
4. Deployment options: static single-file build, or Shopify port (Liquid/headless).
5. 14-day staging review + punch-list completion before production go-live.
