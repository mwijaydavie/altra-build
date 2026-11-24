# Performance & accessibility contract

This note records the Lighthouse audit that followed the top-navigation rebuild,
what was changed, and how to verify the result without the noise of browser
extensions.

## Baseline

Audit: `https://altra-build.vercel.app/`, Lighthouse 13.5.0, mobile, 24 Nov 2026.

| Category | Score |
| --- | --- |
| Performance | 0.54 |
| Accessibility | 0.93 |
| Best Practices | 1.00 |
| SEO | 1.00 |

The build under test predated the navigation work and was still serving the
default `system` theme. The profile also had Ad Blocker and Wappalyzer loaded,
which accounted for a large share of the reported main-thread time. Treat the
numbers as a pessimistic baseline, not a clean measurement.

Key findings:

- **LCP 3.9 s**, with 6.3 s of render delay on the hero paragraph.
- **Speed Index 11.6 s** and **TBT 1.1 s**.
- 98 KiB of oversized responsive images.
- 24 colour-contrast failures around `text-ink/45`, `text-paper/40` and
  `text-gold-deep`.
- A `<dl>` in the hero containing a stray `<span class="sr-only">`.
- No CSP, COOP or frame-ancestors policy.

## What changed

### First paint

The full-screen intro curtain was removed. It was a client component gated on
hydrated JavaScript, so the hero could not paint until the intro had finished.
The hero now renders as a server component:

- no GSAP entrance timeline;
- no count-up animation above the fold (ribbon values are formatted on the
  server);
- the headline uses one short opacity fade that starts on the first frame.

### Semantics and contrast

- Hero and Method & Safety `<dl>`s contain only `dt`/`dd`; visual order is
  preserved with `order-*`.
- `--color-gold-deep` is `#7d5605`; `--color-hazard-deep` (`#b8460f`) is used
  for hazard text on paper.
- Meta text on ink and paper has an AA floor. The smallest labels in the
  dashboard and field app were raised as well.

### Delivery

- CSP, COOP, CORP, HSTS, Referrer-Policy, nosniff and Permissions-Policy are
  set in `next.config.ts`. The CSP allows the E2B/Arena preview hosts as frame
  ancestors and the demo Supabase project as a connect target.
- Zod runs with `jitless: true` so its `Function("")` probe never trips a
  `securitypolicyviolation`.
- Project cards request the srcset width that matches their rendered width on
  phones; hero and card quality is 50–60.
- Lenis is skipped on coarse pointers, leaving touch devices with native
  momentum scrolling.

## Verification

Local clean profile (no extensions), Lighthouse 12.8.2, mobile emulation:

| Metric | Before | After |
| --- | --- | --- |
| Accessibility | 93 | **100** |
| Best Practices | 100 | **100** |
| SEO | 100 | **100** |
| Speed Index | 5.0 s | **2.1 s** |
| FCP | 1.9 s | 1.9 s |
| JS boot-up | 2.0 s | **1.3 s** |
| CLS | 0 | **0** |

Accessibility is 100 on `/`, `/capabilities`, `/projects`, `/method`, `/fleet`,
`/estimator`, `/about`, `/brand`, `/legal/privacy`, `/contact`, `/dashboard` and
`/field`.

The sandbox's headless Chromium emits `NO_LCP` for the home page, so the
performance score and LCP itself must be confirmed in a real browser. Run
PageSpeed Insights against the production URL in a clean profile:

1. Open a guest/incognito window with every extension disabled.
2. Run mobile Lighthouse on `https://altra-build.vercel.app/`.
3. Check LCP, Speed Index and TBT, then re-run on `/capabilities` and
   `/projects` to confirm the shared shell.

## Re-audit checklist

- No intro overlay or hydration-gated hero copy.
- `dt`/`dd` only inside `<dl>` groups.
- Contrast failures at zero.
- CSP present and no `securitypolicyviolation` events in the console.
- `TZS` ribbon values present in the server HTML.
