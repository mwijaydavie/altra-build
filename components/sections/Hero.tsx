import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { company, heroRibbon } from "@/data/siteData";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Logo } from "@/components/ui/Logo";

/** Grouped thousands + fixed decimals, matching the design's tabular figures. */
function metricValue(metric: (typeof heroRibbon)[number]) {
  const decimals = metric.decimals ?? 0;
  return `${metric.prefix ?? ""}${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(metric.value)}${metric.suffix ?? ""}`;
}

/**
 * Server-rendered on purpose. The hero is the LCP surface: no entrance
 * animation, no GSAP, no client hooks — the copy is painted with the HTML.
 */
export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 scale-105">
          <Image
            src="/images/hero-construction.jpg"
            alt="Altra Build high-rise construction site at dusk with tower cranes over Dar es Salaam harbour"
            fill
            priority
            quality={50}
            sizes="100vw"
            className="object-cover object-[58%_45%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/70" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 text-paper blueprint opacity-[0.18]" aria-hidden />

      <div className="shell relative z-10 flex flex-1 flex-col justify-between pb-8 pt-[96px] sm:pt-[104px] lg:pb-7 lg:pt-[104px]">
        {/* top meta row */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo variant="mark" tone="inverse" height={22} className="opacity-90" />
            <span className="live-dot inline-block size-1.5 rounded-full bg-gold" />
            <p className="eyebrow text-paper/60">
              {company.hq}
              <span className="mx-1 hidden text-paper/55 sm:inline">/</span>
              <span className="mt-1 block sm:mt-0 sm:inline">{company.coordinates}</span>
            </p>
          </div>
          <p className="hidden text-right meta text-paper/55 sm:block">
            REF: AB/CIV/2026-047
            <br />
            STATUS: COMMISSIONED
          </p>
        </div>

        {/* headline */}
        <div className="mt-8 max-w-4xl sm:mt-9">
          <p className="eyebrow mb-5 flex items-center gap-3 text-gold">
            <span className="inline-block h-px w-9 bg-gold" />
            Civil · Structures · Industrial
          </p>
          <h1 id="hero-title" className="display-xl">
            {["Engineering", "Tomorrow's", "Horizons."].map((line, index) => (
              <span
                key={line}
                className={
                  index === 0
                    ? "hero-line block text-paper"
                    : index === 1
                      ? "hero-line block text-outline"
                      : "hero-line block text-gold"
                }
                style={{ animationDelay: `${0.1 + index * 0.06}s` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-5 flex max-w-2xl flex-col gap-5">
            <p className="max-w-xl text-[17px] leading-relaxed text-paper/65 sm:text-[17px]">
              {company.proposition} Delivered by Tanzanian engineers, to international standards,
              since {company.founded}.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <MagneticButton href="/contact" size="lg">
                Request project tender
              </MagneticButton>
              <MagneticButton href="/projects" size="lg" variant="outline-light">
                View major projects
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* ribbon */}
        <div className="mt-7 flex items-end justify-between gap-8 sm:mt-8">
          <dl className="grid w-full grid-cols-2 gap-x-5 gap-y-7 border-t border-paper/15 pt-6 sm:gap-x-8 lg:grid-cols-4">
            {heroRibbon.map((metric, index) => (
              <div
                key={metric.id}
                className="flex flex-col"
              >
                <dt className="order-2 mt-2.5 text-[12px] uppercase leading-snug tracking-[0.12em] text-paper/55">
                  {metric.label}
                  {index === 0 && <span className="sr-only"> — signature metric</span>}
                </dt>
                <dd className="order-1 font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-none tracking-tight text-paper">
                  {metricValue(metric)}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/capabilities"
            className="group hidden shrink-0 flex-col items-center gap-3 self-end lg:flex"
            aria-label="Go to capabilities"
          >
            <span className="meta rotate-180 text-paper/55 [writing-mode:vertical-rl]">Scroll to survey</span>
            <span className="flex size-11 items-center justify-center rounded-full border border-paper/25 text-paper/60 transition-colors group-hover:border-gold group-hover:text-gold">
              <ArrowDown className="size-4 motion-safe:animate-bounce" strokeWidth={1.5} />
            </span>
          </Link>
        </div>
      </div>

    </section>
  );
}
