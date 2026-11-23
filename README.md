# Altra Build — Engineering tomorrow's horizons

A production-grade marketing site, client portal and **construction operations platform** for
**Altra Build Limited**, a Tanzanian general contractor and civil engineering firm. Built with
Next.js 15 (App Router), React 19, strict TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis,
Framer Motion, TanStack Query, Recharts and a Supabase/Postgres schema with row-level security.

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

### Marketing site — multi-page, not a scroll

The single long landing page was split into real routes. Home is now five blocks (hero, practice,
divisions, three selected records, closing CTA); everything deeper has its own URL, nav entry,
metadata and sitemap entry.

| Route | Contents |
| --- | --- |
| `/` | Hero + short practice manifesto + four division doors + three project records + CTA |
| `/capabilities` | Deep-linked division switcher (`?division=civil`) + related routes |
| `/projects` | Full project index; `/projects/[slug]` case studies |
| `/method` | Method, safety accordion, HSE HUD, certifications, client verdicts |
| `/fleet` | Plant register, telemetry, ISO 19650 / LOD 400 capability |
| `/about` | Practice story, four stats, brand card, credentials, offices |
| `/estimator` | Order-of-cost tool; hands off to the RFQ form |
| `/contact` | RFQ form, acknowledgement/tender SLA, tender-desk contacts |
| `/portal`, `/brand`, `/legal/*` | Demo client portal, brand standards, legal |

Navigation is page-based (`data/siteData.ts` → `navigation`, `primaryNavigation`,
`utilityNavigation`) with no anchor-only items. Header links point at routes; the old
`/#capabilities` style links are gone.

**Typography / copy rules**

- Base body copy is 17 px with 1.6 line-height; marketing prose is 17–18 px, `meta`/`eyebrow`
  labels are 12 px, and no prose sits below 13.5 px.
- Home is ~4,500 px tall on a 1440×900 desktop (it was a ten-section page); mobile uses compact
  division rows and a snap-scrolling project rail instead of stacking every card.
- The screenshot-era Intro block was cut from two long paragraphs to one short statement plus three
  one-line principles; section decks no longer repeat the page hero deck.

**Interaction layer**

- `components/ui/TextMotion.tsx` — word-masked reveal in the spirit of the supplied Framer
  `TextMotion` module. Framer's `.js` modules cannot be installed into a Next build, so the
  behaviour (staggered word rise, brand easing, reduced-motion fallback) is reimplemented natively
  on `framer-motion`.
- `components/layout/HingeMenu.tsx` — full-screen navigation where two leaves swing open around a
  centre hinge (`rotateY` + perspective), replacing the old mobile-only drawer. Opens from the
  header at every breakpoint; includes search, tender desk, offices, CTA and credits.
- `components/layout/SiteSearch.tsx` — the VengeanceUI `search-modal` pattern (filter chips,
  live-filtered rows, quick actions, keyboard hints) ported natively with lucide icons and the
  Altra palette, replacing its `@phosphor-icons/react` dependency. Opens from the header, the hinge
  menu, or `⌘K` / `Ctrl+K`; arrow keys + Enter navigate; results are indexed from
  `lib/siteSearch.ts` (pages, divisions, projects).

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

## ALTRA COMMAND — operations portal (`/dashboard`)

A Procore-class operations HUD for four roles, plus an offline-first field app. All data is served
from `lib/ops/store.ts`, a seeded repository that mirrors `supabase/schema.sql`; the same read models
are returned when Supabase is connected, so the UI never talks to the database directly.

### Demo roles

Switch roles from the account menu in the sidebar (or `POST /api/ops/session` with `{ "role": … }`).
The session cookie stores a profile id and is validated on every request.

| Role | Person | Scope |
| --- | --- | --- |
| `executive` | Neema Mwakalinga — CEO | All nine sites, full finance, approvals, audit |
| `pm` | Baraka Mwakyusa — Project Director | Assigned sites only, approvals, audit |
| `engineer` | Halima Juma — Site Engineer | Assigned sites, field logs, observations, no approvals |
| `client` | Zahara Kimaro — Tumaini Estates | Read-only single-project view; no procurement, HSE register or cost breakdowns |

`lib/ops/permissions.ts` is the capability matrix; each entry has a matching RLS policy in
`supabase/schema.sql` (`executive`, `pm`, `engineer`, `client`).

### Surfaces

- **`/dashboard`** — capital deployed vs budget, active sites and live workforce, critical-path
  variance, safe man-hours without LTI. Recharts burn chart (outflow vs milestone billing, 6M/12M),
  offline-safe vector map of Tanzania with green/amber/red site status, live alerts with
  acknowledgement, project register with filters, one-click change-order approvals, audit trail.
- **`/dashboard/projects`** — scope-filtered project register: capital deployed, workforce and
  completion KPIs, status filters with counts, and one row per site into the workspace.
- **`/dashboard/projects/[id]`** — Overview, Programme (Gantt phase timeline + drag-and-drop Kanban),
  Daily logs, Financials (invoices, cost structure, burn), Documents. Phase completion across
  Foundation → Superstructure → MEP → Envelope → Fit-out.
- **`/dashboard/procurement`** — stock table for steel, cement, aggregate and ready-mix with
  cover-vs-reorder meters, low-stock exceptions, requisition approvals and delivery confirmation.
  **Generate PO** opens a live document preview (letterhead, VAT, terms, signatures) with
  `Print / save PDF`; print CSS hides the app chrome and prints only the order.
- **`/dashboard/safety`** — ISO 45001 / OSHA Tanzania checklist, compliance score, severity × status
  matrix, incident register with signed sign-off, audit trail and a printable incident report.
- **`/field`** — mobile-first PWA (installable, field-scoped service worker): 48 px+ targets, 3-tap
  daily log (weather → crew +/− → submit), delay chips, camera capture with geolocation and
  timestamp watermark burned into the image, offline IndexedDB queue with automatic replay, safety
  observations and a hold-to-broadcast SOS safety stop.

### API

| Route | Methods | Notes |
| --- | --- | --- |
| `/api/ops/snapshot` | `GET` | One scoped read model for every dashboard surface |
| `/api/ops/session` | `GET` `POST` `DELETE` | Demo session / role switch |
| `/api/ops/logs` | `GET` `POST` | Daily site logs |
| `/api/ops/incidents` | `GET` `POST` `PATCH` | Observations; sign-off restricted to PM/exec |
| `/api/ops/requisitions` | `GET` `POST` `PATCH` | Approve, reject, confirm delivery |
| `/api/ops/rfis` | `GET` `POST` | Raise RFIs |
| `/api/ops/rfis/[id]/decision` | `POST` | One-click change-order approval |
| `/api/ops/tasks` | `GET` `PATCH` | Kanban / Gantt status moves |
| `/api/ops/alerts` | `PATCH` | Acknowledge an exception |
| `/api/ops/sos` | `POST` | Safety-stop broadcast with coordinates |
| `/api/ops/sync` | `POST` | Idempotent offline queue replay (`clientUuid`) |

All mutations validate with Zod (`lib/ops/validation.ts`), check the role capability **and** the
project scope, and write an audit entry.

### Supabase

```bash
# 1. create a project, then apply the schema (Supabase CLI)
supabase db push          # or paste supabase/schema.sql into the SQL editor

# 2. configure the browser client
NEXT_PUBLIC_SUPABASE_URL=…
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
```

`schema.sql` creates enums, 15 tables (profiles, projects, members, phases, tasks, daily logs,
incidents, checklist, alerts, inventory, requisitions, RFIs/change orders, invoices, monthly
financials, documents, audit), indexes, triggers (updated-at, manpower totals, safe man-hours
roll-up, phase status, audit), RLS helpers (`app_role`, `is_executive`, `is_project_member`,
`can_see_project`), per-role policies, reporting views and seed checklist/inventory rows. Profile
rows are created automatically from `auth.users` via the `handle_new_user` trigger.

The demo repository is deliberately in-memory: mutations reset when the server restarts.

---

## Structure

```
app/                 routes, metadata, sitemap/robots/manifest, API, icons
app/(site)/          marketing routes + client portal (Lenis / brand chrome)
app/dashboard/       ALTRA COMMAND layout, executive HUD, project, procurement, safety
app/field/           field PWA shell + /field/manifest.webmanifest
app/api/ops/         scoped operational API
components/
  layout/            Navbar, Footer, Preloader
  home/              HomeManifesto, HomeDivisions, HomeProjects, HomeCta
  marketing/         PageHero, RelatedLinks
  sections/          Hero, Intro, Capabilities, MethodSafety, FleetBim, Estimator,
                     Testimonials, ContactRFQ
  portal/            PortalClient (demo auth + dashboard)
  dashboard/         Shell, KPIs, burn chart, map, Gantt, Kanban, approvals, PO generator,
                     safety matrix, incident report
  field/             FieldApp, quick log/incident forms, photo capture, sync badge, SOS
  providers/         SmoothScrollProvider (Lenis ↔ GSAP)
  ui/                Logo, BrandSeal, MagneticButton, SplitHeading, TextMotion, Counter,
                     Reveal, SectionHeading, LocalClock
data/siteData.ts     all marketing copy, projects, fleet, safety, estimator, brand system
data/opsData.ts      seeded operational dataset (programme, logs, incidents, POs, finance)
lib/ops/             repository, permissions, session, validation, formatters, hooks
lib/siteSearch.ts    marketing search index (pages, divisions, projects)
lib/field/queue.ts   IndexedDB offline queue + idempotent replay
supabase/schema.sql  Postgres schema, triggers, RLS, seed
public/brand/        generated identity assets
public/images/       photography
public/sw.js         field-scoped service worker
scripts/             brand tracing + raster pipeline
```

---

## QA notes

- TypeScript strict, `npx tsc --noEmit` and `npm run build` are clean.
- Desktop (1440) and mobile (390) layouts are verified headlessly for every marketing route plus
  the hinge menu and search overlay; the field app's bottom navigation targets are 68 px tall,
  above the 48 px minimum.
- Marketing type scale is checked at both breakpoints: body ≥17 px, labels 12 px, measure ≤65ch;
  home desktop height ≈4,500 px and mobile ≈6,500 px including the footer.
- Offline flow verified by toggling the browser offline: the daily log persists to IndexedDB, the
  badge shows the queue depth, and it syncs to zero on reconnect.
- No third-party network requests: fonts, images and the Tanzania map are local/inline, so the
  dashboard and field app render inside an isolated iframe preview.
- Printing the PO or incident report hides the app chrome via `:has()` print rules and prints only
  the document (use the browser dialog's “Save as PDF”).

## Content note

The company, projects, clients, awards, certifications, individuals and figures are illustrative
demo content created for this build. Replace `data/siteData.ts` with verified project records before
publishing commercially, and connect `app/api/rfq/route.ts` to the real CRM / tender mailbox.
