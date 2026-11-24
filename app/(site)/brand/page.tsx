import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Check, Download, X } from "lucide-react";
import { brandAssets, company } from "@/data/siteData";
import { Logo } from "@/components/ui/Logo";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BrandSeal } from "@/components/ui/BrandSeal";

export const metadata: Metadata = {
  title: "Brand standards",
  description:
    "The Altra Build identity system: emblem, lockups, palette, typography and usage rules. Download the vector assets.",
  alternates: { canonical: "/brand" },
};

const downloads = [
  { name: "Primary lockup (SVG)", href: "/brand/altra-logo.svg", meta: "Vector · light surfaces" },
  { name: "Inverse lockup (SVG)", href: "/brand/altra-logo-inverse.svg", meta: "Vector · dark surfaces" },
  { name: "Emblem (SVG)", href: "/brand/altra-mark.svg", meta: "Vector · standalone badge" },
  { name: "Mono ink lockup (SVG)", href: "/brand/altra-logo-mono-ink.svg", meta: "Single colour" },
  { name: "Mono cream lockup (SVG)", href: "/brand/altra-logo-mono-cream.svg", meta: "Single colour · dark" },
  { name: "Wordmark (SVG)", href: "/brand/altra-wordmark.svg", meta: "Lettering only" },
  { name: "Print lockup (JPG)", href: "/brand/altra-lockup.jpg", meta: "2000 × 760 · cream" },
  { name: "Social card (JPG)", href: "/brand/og-image.png", meta: "1200 × 630" },
  { name: "Palette + geometry (JSON)", href: "/brand/manifest.json", meta: "Tokens & proportions" },
];

export default function BrandPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-32 text-paper lg:pb-20 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-20" aria-hidden />
        <div className="shell relative">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Logo variant="lockup" tone="inverse" height={44} />
            <p className="meta text-paper/55">Brand standards · v1.0 · 2026</p>
          </div>
          <SplitHeading as="h1" className="display-xl mt-12 max-w-4xl uppercase">
            One mark. <span className="text-gold">Every surface.</span>
          </SplitHeading>
          <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-paper/55">
            The Altra Build identity is drawn from a single source file — the rhino emblem and the
            “altra build” lettering. Everything else is derived: the palette, the social card, the
            favicon, the site seal, the tender documents you receive.
          </p>
        </div>
      </section>

      {/* Emblem story */}
      <section className="bg-paper py-16 text-ink lg:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <Reveal className="relative flex items-center justify-center border border-ink/15 bg-cream p-10">
            <Logo variant="mark" height={260} />
            <div className="absolute bottom-4 left-4 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink/65">
              Emblem · 82 × 77 units
            </div>
            <div className="absolute right-4 top-4 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink/65">
              REF: AB/MARK
            </div>
          </Reveal>

          <div>
            <p className="eyebrow text-gold-deep">The Kifaru</p>
            <h2 className="display-lg mt-4 uppercase">Armour without aggression.</h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink/60">
              {company.story} The gold disc is the site — the ground we are trusted to build on. The
              rhino is the structure: heavy, precise, and impossible to move. The lettering splits at{" "}
              <span className="text-ink">altra</span> / <span className="text-gold-deep">build</span>,
              balancing the alternative path against the plain English of construction.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink/15 pt-6 sm:grid-cols-3">
              {[
                { k: "Signal gold", v: "Tenacity, safety, visibility" },
                { k: "Obsidian ink", v: "Engineering, permanence" },
                { k: "Alabaster", v: "Daylight, clarity, paper" },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="meta text-ink/65">{item.k}</dt>
                  <dd className="mt-1.5 text-[13px] leading-relaxed text-ink/60">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="bg-cream py-16 text-ink lg:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-ink/15 pt-6">
            <div>
              <p className="meta text-gold-deep">01</p>
              <h2 className="display-lg mt-3 uppercase">Approved lockups</h2>
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-ink/65">
              Six variants cover every surface. Do not recolour or reconstruct the wordmark.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {brandAssets.variants.map((variant, index) => (
              <Reveal
                key={variant.name}
                delay={index * 0.04}
                className={
                  "group relative border p-6 " +
                  (variant.surface === "dark" ? "border-ink/15 bg-ink" : "border-ink/15 bg-cream")
                }
              >
                <div className="flex h-28 items-center justify-center">
                  <Image
                    src={variant.src}
                    alt={`${variant.name} — Altra Build`}
                    width={Math.round(180 * variant.ratio)}
                    height={180}
                    unoptimized
                    className="max-h-16 w-auto max-w-full object-contain"
                  />
                </div>
                <div
                  className={
                    "mt-5 flex items-center justify-between border-t pt-3 " +
                    (variant.surface === "dark" ? "border-paper/15" : "border-ink/10")
                  }
                >
                  <div>
                    <p
                      className={
                        "text-[13px] " + (variant.surface === "dark" ? "text-paper/75" : "text-ink/70")
                      }
                    >
                      {variant.name}
                    </p>
                    <p
                      className={
                        "mt-0.5 font-mono text-[8px] uppercase tracking-[0.08em] " +
                        (variant.surface === "dark" ? "text-paper/55" : "text-ink/65")
                      }
                    >
                      {variant.surface === "dark" ? "Obsidian surface" : "Light surface"}
                    </p>
                  </div>
                  <a
                    href={variant.src}
                    download
                    className={
                      "flex size-7 items-center justify-center border transition-colors " +
                      (variant.surface === "dark"
                        ? "border-paper/20 text-paper/50 hover:border-gold hover:text-gold"
                        : "border-ink/20 text-ink/65 hover:border-ink hover:text-ink")
                    }
                    aria-label={`Download ${variant.name}`}
                  >
                    <Download className="size-3" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clear space, palette, type */}
      <section className="bg-paper py-16 text-ink lg:py-24">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="meta text-gold-deep">02</p>
            <h2 className="display-md mt-3 uppercase">Clear space &amp; minimum size</h2>
            <div className="mt-6 border border-dashed border-ink/25 p-8">
              <div className="border border-dashed border-gold-deep/40 p-6">
                <Logo variant="lockup" height={34} />
              </div>
            </div>
            <p className="mt-3 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.08em] text-ink/65">
              Clear space = 0.5 × emblem diameter · min lockup 96 px / 30 mm · min emblem 28 px / 8 mm
            </p>

            <div className="mt-8 flex items-end gap-8 border-t border-ink/15 pt-6">
              {[32, 22, 16].map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Logo variant="mark" height={size} />
                  <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-ink/65">
                    {size} px
                  </span>
                </div>
              ))}
              <div className="flex-1 text-right">
                <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.08em] text-ink/65">
                  Emblem holds to 16 px
                  <br />
                  (favicon, app tile)
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="meta text-gold-deep">03</p>
            <h2 className="display-md mt-3 uppercase">Palette</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {brandAssets.palette.map((colourItem) => (
                <div key={colourItem.hex} className="border border-ink/15">
                  <div className="h-16 w-full" style={{ background: colourItem.hex }} />
                  <div className="p-2">
                    <p className="text-[11.5px] font-medium text-ink">{colourItem.name}</p>
                    <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.06em] text-ink/65">
                      {colourItem.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="meta mt-10 text-gold-deep">04</p>
            <h2 className="display-md mt-3 uppercase">Typography</h2>
            <div className="mt-6 space-y-4">
              {brandAssets.type.map((font) => (
                <div key={font.name} className="border-t border-ink/15 pt-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[14px] font-medium text-ink">{font.name}</p>
                    <p className="font-mono text-[8px] uppercase tracking-[0.08em] text-ink/65">{font.role}</p>
                  </div>
                  <p className="mt-1.5 truncate text-[19px] tracking-tight text-ink/75">{font.sample}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Do / don't */}
        <div className="shell mt-16">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-ink/15 bg-cream/50 p-6">
              <p className="eyebrow flex items-center gap-2 text-ink/60">
                <Check className="size-3.5 text-gold-deep" /> Do
              </p>
              <ul className="mt-4 space-y-2.5">
                {brandAssets.rules.do.map((rule) => (
                  <li key={rule} className="flex gap-2.5 text-[14px] leading-relaxed text-ink/60">
                    <span className="mt-1.5 size-1 shrink-0 bg-gold-deep" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-ink/15 p-6">
              <p className="eyebrow flex items-center gap-2 text-ink/60">
                <X className="size-3.5 text-hazard" /> Do not
              </p>
              <ul className="mt-4 space-y-2.5">
                {brandAssets.rules.dont.map((rule) => (
                  <li key={rule} className="flex gap-2.5 text-[14px] leading-relaxed text-ink/60">
                    <span className="mt-1.5 size-1 shrink-0 bg-hazard" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads + seal */}
      <section className="bg-ink py-16 text-paper lg:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <div className="border-t border-paper/15 pt-6">
              <p className="meta text-gold">05</p>
              <h2 className="display-md mt-3 uppercase">Asset library</h2>
            </div>
            <ul className="mt-6 divide-y divide-paper/10 border-y border-paper/10">
              {downloads.map((asset) => (
                <li key={asset.name}>
                  <a
                    href={asset.href}
                    download
                    className="group flex items-center justify-between gap-4 py-3.5 transition-colors hover:text-gold"
                  >
                    <span className="flex items-baseline gap-3">
                      <Download className="size-3.5 text-paper/55 transition-colors group-hover:text-gold" />
                      <span className="text-[14.5px] text-paper/80">{asset.name}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-paper/55">
                        {asset.meta}
                      </span>
                      <ArrowUpRight className="size-3 text-paper/55 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-lg text-[12.5px] leading-relaxed text-paper/55">
              All assets are regenerated from the master file with{" "}
              <span className="font-mono text-paper/55">npm run brand</span>. Vector artwork should always
              be used in preference to raster unless the medium requires otherwise.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 border border-paper/15 bg-ink-800 p-7">
            <BrandSeal size={160} />
            <div>
              <p className="eyebrow text-gold">Site seal</p>
              <p className="mt-3 text-[14px] leading-relaxed text-paper/50">
                The rotating seal is used once per page on dark surfaces. It carries the emblem at 42% of
                its diameter, ringed with the Kifaru Standard lettering.
              </p>
            </div>
            <div className="flex items-center gap-4 border-t border-paper/10 pt-5">
              <Image
                src="/brand/icon-512.png"
                alt="Altra Build app icon"
                width={56}
                height={56}
                unoptimized
                className="rounded-[12px]"
              />
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-paper/55">App tile</p>
                <p className="mt-1 text-[12.5px] text-paper/55">512 × 512 · maskable</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
