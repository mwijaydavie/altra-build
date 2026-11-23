# Altra Build — Engineering tomorrow's horizons

A production-grade marketing site and client portal for **Altra Build Limited**, a Tanzanian
general contractor and civil engineering firm. Built with Next.js 15 (App Router), React 19,
strict TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis and Framer Motion.

The identity is derived directly from the supplied logo: the rhino emblem (*kifaru*), the
obsidian/gold palette and the “altra build” lockup are used as real interface material — navigation,
preloader, favicons, app icons, social card, site seal, estimator exports, portal chrome and the
brand standards page — not just pasted in a corner.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # strict TS, no emit
```

Optional environment variable used for canonical URLs, sitemap and Open Graph:

```bash
NEXT_PUBLIC_SITE_URL=https://altrabuild.co.tz
```

---

## Brand asset pipeline

The only source of truth is `brand/altra-build-source.png`. Every vector and raster asset is
generated from it:

```bash
npm run brand
# 1. scripts/build-brand-assets.py  → traces the bitmap into clean SVG paths
# 2. scripts/render-brand.mjs       → favicons, app tiles, print lockup, OG card
```

Generated assets:

| Asset | Path |
| --- | --- |
| Primary / inverse lockups | `public/brand/altra-logo.svg`, `altra-logo-inverse.svg` |
| Emblem (badge) | `public/brand/altra-mark.svg` (+ inverse, mono) |
| Wordmark only | `public/brand/altra-wordmark.svg` |
| Favicon / app icon | `app/icon.png`, `app/apple-icon.png` |
| PWA icons | `public/brand/icon-192.png`, `icon-512.png` |
| Social card | `public/brand/og-image.png` |
| Palette + geometry | `public/brand/palette.json`, `geometry.json`, `manifest.json` |

Brand surfaces inside the product:

- **Preloader** — emblem + lockup, masked progress line (once per session).
- **Navigation** — lockup flips between the primary and inverse SVG depending on surface.
- **Hero** — rotating Kifaru seal built from the emblem.
- **Case studies / footer / portal** — emblem watermarks and stamps.
- **Estimator** — the exported “Scope of Work” document is branded with the vector lockup.
- **Brand standards** — `/brand` documents variants, clear space, palette, type and downloads.

The traced SVGs are faithful reconstructions; re-run `npm run brand` after any logo change.

---

## What is implemented

### Marketing site (`/`)

- **Hero** — layered parallax photography, line-masked headline, KPI counters, technical metadata,
  rotating brand seal.
- **Capabilities** — four divisions with hover-synced imagery, specs and capability lists
  (stacked cards on touch).
- **Projects** — GSAP horizontal pin/scrub gallery with progress rail, mobile fallback stack.
- **Method & safety** — accessible accordion process, live-style safety HUD, ESG benchmarks.
- **Fleet & BIM** — asset register, telemetry, ISO 19650 / LOD 400 capability grid.
- **Tender estimator** — live order-of-cost model (discipline, area, location, ground, finish),
  downloadable branded scope of work, hand-off into the RFQ form.
- **Portal teaser, testimonials, RFQ form** — forms validated with Zod + React Hook Form and posted
  to an API route that returns an issued reference.

### Client portal (`/portal`)

Demo credentials are shown on screen (`projects@tumaini.co.tz` / `kifaru2026`). The portal covers
portfolio switching, progress, milestones, documents, invoices, RFIs, activity and JSON export.
Session state is stored in `sessionStorage`; no real auth is implied.

### Case studies (`/projects`, `/projects/[slug]`)

Six statically generated records with brief, response, audited outcomes, phased programme, technical
sheet, gallery, client quote and awards.

### Brand standards (`/brand`)

Approved lockups, clear space, minimum sizes, palette, typography, do/don't rules and the asset
library — all downloadable.

### Engineering notes

- Lenis is driven by GSAP's ticker; `lenis.on("scroll", ScrollTrigger.update)` keeps triggers in sync.
- All scroll animation uses `useGSAP` with cleanup contexts; `gsap.matchMedia` gates the pinned
  horizontal gallery to desktop and reduced-motion users get static layouts.
- Static rendering is used for every marketing route; only the RFQ endpoint and the portal's demo
  session are dynamic. No hydration-dependent locale or clock formatting (`LocalClock` and
  `Counter` are hydration-safe).
- Fonts are self-hosted via Fontsource (Space Grotesk, Inter, JetBrains Mono) — no runtime Google
  Fonts requests.
- Accessibility: skip link, labelled fields, `aria-pressed`/`aria-expanded` states, keyboard-friendly
  controls, focus-visible styling and `prefers-reduced-motion` handling.

---

## Structure

```
app/                 routes, metadata, sitemap/robots/manifest, API, icons
components/
  layout/            Navbar, Footer, Preloader
  sections/          Hero, Intro, Capabilities, ProjectsShowcase, MethodSafety,
                     FleetBim, Estimator, PortalTeaser, Testimonials, ContactRFQ
  portal/            PortalClient (demo auth + dashboard)
  providers/         SmoothScrollProvider (Lenis ↔ GSAP)
  ui/                Logo, BrandSeal, MagneticButton, SplitHeading, Counter, Reveal,
                     SectionHeading, LocalClock
data/siteData.ts     all copy, projects, fleet, safety, estimator rates, brand system
lib/                 gsap registration, estimator model, Zod schemas, utilities
public/brand/        generated identity assets
public/images/       photography
scripts/             brand tracing + raster pipeline
```

---

## Content note

The company, projects, clients, awards, certifications, individuals and figures are illustrative
demo content created for this build. Replace `data/siteData.ts` with verified project records before
publishing commercially, and connect `app/api/rfq/route.ts` to the real CRM / tender mailbox.
