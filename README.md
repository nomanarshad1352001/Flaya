# FLAYA — Website Redesign (Staging Preview)

> **STAGING ONLY.** Interactive prototype of the approved FLAYA redesign concept.
> Nothing in this build touches the live flaya.store — deployment to production
> happens only after full staging QA and written client approval.

---

## What's inside

A complete, interactive front-end prototype of the **FLAYA premium modest fashion**
store redesign, built from the approved UX/CRO audit and every follow-up decision.

### Experience highlights

- **White Premium** design system + **Light Black** alternate theme (moon toggle in header, persisted)
- **Mobile First** — every flow designed at 360px first, desktop as a light adaptation
- **Auto-rotating 16-frame editorial hero** (6s per frame, Ken Burns zoom, tappable progress segments, product-tagged)
- **Sliding marquee** announcement bar + centered FLAYA wordmark
- **104+ styles** across the real live catalogue families:
  Velvet Abaya · Armani Silk · Aura · Emirati Satin · Capsule · Atelier line —
  each colour shown in **family-matched, colour-appropriate photography** (unique angle per variety)
- **Infinite auto-sliding New Collection & Best Sellers rails** (opposite directions, pause on hover)
- **PLP filters that apply instantly** — Category · Size (incl. One size, 2XL "coming soon") · Colour (11 families with swatches) — plus **8-option Sort By**
- **PDP**: colour swatches with sold-out strike-through, live "order within X to receive [date]" UAE cut-off countdown, Size Guide modal, one-size handling, WhatsApp deep-link with product context, Complete the Look quick-add, sticky mobile Add-to-Bag
- **Cart** — geo-aware free-delivery progress bar (UAE only, AED 500), weight-based international note
- **Checkout** — express **Google Pay**, region-aware shipping (Dubai next-day / Other Emirates 2–3d / Intl 5–7d), discount code `FLAYA10`, cancellations policy
- **Pages**: About (Maria & Anastasia story), Delivery & Exchanges (real policy), Contact (WhatsApp · Instagram DM · email), cookie banner
- **Wishlist, Search overlay, Region/Currency selector** (AED · SAR · GBP · USD · EUR)
- **Real brand marks** — Instagram, Pinterest, TikTok, Facebook, WhatsApp + Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay
- **Single WhatsApp green floating chat button**
- **Analytics** — all 14 audit events pushed to `window.dataLayer`

No backend, no database. The whole catalogue is deterministic dummy data.

---

## Tech stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | **React 19 + Vite 7 + TypeScript** (`tsc --noEmit` = 0 errors) | Single-file production build |
| Styling | **Tailwind CSS v4** (`@theme` tokens) | Entire palette is CSS variables → instant theme switch |
| Motion | **Framer Motion 12** | Spring drawers, layout transitions, slideshows |
| Icons | **Lucide React** + hand-built **brand SVG marks** | Lucide no longer ships brand logos |
| Type | **Fraunces** (display) + **Manrope** (UI), Google Fonts | ≤2 families per audit |
| State | React Context (`StoreContext`) | cart · wishlist · region · theme · toasts |
| Routing | Hash router (`useHashRoute`) | Works from `dist/index.html` with no server |
| Imagery | **Pexels CDN** (`?auto=compress&fit=crop&w=&h=`) | Free stock. **Final shoot photography must be supplied by FLAYA.** Replacement codec (WebP/AVIF + srcset) per image-optimisation spec |
| Build | `vite-plugin-singlefile` | One portable `dist/index.html` artifact |

---

## Run it

```bash
npm install        # one-time
npm run dev        # local dev
npm run build      # production → dist/index.html
npm run preview    # serve the production build
npm run tsc        # type-check (currently 0 errors)
```

No env vars, no API keys, no database. Discount code for checkout: **FLAYA10**.

---

## Repo layout

```
src/
├─ data/store.ts            # 104 products · collections · filters · hero · reviews
├─ lib/shop.ts              # currencies · regions · analytics · WhatsApp · FIXED_LIGHT
├─ store/StoreContext.tsx   # cart / wishlist / region / theme / toasts
├─ hooks/useHashRoute.ts    # home · shop · product · cart · checkout · about · delivery · contact
├─ components/
│  ├─ Header.tsx            # marquee, sticky header, centered FLAYA, region picker, theme toggle
│  ├─ MobileMenu.tsx        # sidebar: real site structure (Home, About, 5 collections, account)
│  ├─ FilterDrawer.tsx      # Category/Size/Colour — instant apply
│  ├─ ProductCard.tsx       # swatches, hover angle swap, sale strike-through, wishlist
│  ├─ ProductRail.tsx / AutoProductRail.tsx
│  ├─ CartDrawer.tsx  SearchOverlay.tsx  SizeGuide.tsx  WhatsAppFab.tsx
│  ├─ home-sections.tsx     # hero slideshow, categories, capsule, 3-row reviews, community
│  ├─ icons.tsx  payments.tsx             # brand marks + payment logos
│  └─ Footer.tsx            # newsletter, links, real socials, payment logos, legal
└─ pages/
   ├─ HomePage.tsx   ListingPage.tsx   ProductPage.tsx
   ├─ CartPage.tsx   CheckoutPage.tsx
   └─ AboutPage.tsx  DeliveryPage.tsx  ContactPage.tsx
```

## Analytics events (audit list — all emitting)

`view_item_list` · `select_item` · `view_item` · `select_variant` · `size_guide_open` ·
`whatsapp_click` · `add_to_cart` · `view_cart` · `begin_checkout` · `purchase` ·
`complete_the_look_click` · `cross_sell_add_to_cart` · `review_interaction` ·
`delivery_progress_reached`

---

## Before going live (must-do)

1. Replace Pexels imagery with FLAYA-owned photography (web + ad usage rights).
2. Replace dummy review content with genuine, permission-cleared testimonials.
3. Replace the placeholder WhatsApp number with the live line.
4. Wire `window.dataLayer` events into the real GTM container.
5. Port to Shopify Liquid (or connect via Storefront API) — catalogue, checkout
   and payments must run through FLAYA's own account per Option A in `PROJECT.md`.
6. Legal review of Delivery & Exchange copy for the hosting jurisdiction.
