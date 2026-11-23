"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { company, heroRibbon } from "@/data/siteData";
import { Counter } from "@/components/ui/Counter";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Logo } from "@/components/ui/Logo";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(lines, {
        yPercent: 118,
        duration: 1.35,
        stagger: 0.11,
        delay: 0.15,
      })
        .from(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08 },
          0.55,
        )
        .from("[data-hero-meta]", { autoAlpha: 0, duration: 1.1, stagger: 0.06 }, 0.3);

      gsap.to("[data-hero-image]", {
        yPercent: 12,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-content]", {
        yPercent: -8,
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div data-hero-image className="absolute inset-0 scale-105">
          <Image
            src="/images/hero-construction.jpg"
            alt="Altra Build high-rise construction site at dusk with tower cranes over Dar es Salaam harbour"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[58%_45%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/70" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 text-paper blueprint opacity-[0.18]" aria-hidden />

      <div className="shell relative flex flex-1 flex-col justify-between pb-8 pt-[104px] sm:pt-[112px] lg:pb-7 lg:pt-[112px]">
        {/* top meta row */}
        <div className="flex items-start justify-between gap-6">
          <div data-hero-meta className="flex items-center gap-3">
            <Logo variant="mark" tone="inverse" height={22} className="opacity-90" />
            <span className="live-dot inline-block size-1.5 rounded-full bg-gold" />
            <p className="eyebrow text-paper/60">
              {company.hq} <span className="mx-1 text-paper/25">/</span> {company.coordinates}
            </p>
          </div>
          <p data-hero-meta className="hidden text-right meta text-paper/35 sm:block">
            REF: AB/CIV/2026-047
            <br />
            STATUS: COMMISSIONED
          </p>
        </div>

        {/* headline */}
        <div data-hero-content className="mt-10 max-w-4xl sm:mt-12">
          <p data-hero-fade className="eyebrow mb-5 flex items-center gap-3 text-gold">
            <span className="inline-block h-px w-9 bg-gold" />
            Civil · Structures · Industrial
          </p>
          <h1 id="hero-title" className="display-xl">
            {["Engineering", "Tomorrow's", "Horizons."].map((line, index) => (
              <span
                key={line}
                className="reveal-line"
                style={{ paddingBottom: "0.04em", marginBottom: "-0.02em" }}
              >
                <span
                  data-hero-line
                  className={
                    index === 0
                      ? "block text-paper"
                      : index === 1
                        ? "block text-outline"
                        : "block text-gold"
                  }
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-6 flex max-w-2xl flex-col gap-6">
            <p data-hero-fade className="max-w-xl text-[15px] leading-relaxed text-paper/65 sm:text-base">
              {company.proposition} Delivered by Tanzanian engineers, to international standards,
              since {company.founded}.
            </p>
            <div data-hero-fade className="flex flex-wrap items-center gap-3">
              <MagneticButton href="/#rfq" size="lg">
                Request project tender
              </MagneticButton>
              <MagneticButton href="/#projects" size="lg" variant="outline-light">
                View major projects
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* ribbon */}
        <div className="mt-9 flex items-end justify-between gap-8 sm:mt-10">
          <dl className="grid w-full grid-cols-2 gap-x-5 gap-y-7 border-t border-paper/15 pt-6 sm:gap-x-8 lg:grid-cols-4">
            {heroRibbon.map((metric, index) => (
              <div key={metric.id} data-hero-meta>
                <dd className="font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-none tracking-tight text-paper">
                  <Counter
                    value={metric.value}
                    decimals={metric.decimals ?? 0}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                  />
                </dd>
                <dt className="mt-2.5 text-[10.5px] uppercase leading-snug tracking-[0.12em] text-paper/45">
                  {metric.label}
                </dt>
                {index === 0 && <span className="sr-only">Signature metric</span>}
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={() => scrollTo("#capabilities", -70)}
            className="group hidden shrink-0 flex-col items-center gap-3 self-end lg:flex"
            aria-label="Scroll to capabilities"
          >
            <span className="meta rotate-180 text-paper/35 [writing-mode:vertical-rl]">Scroll to survey</span>
            <span className="flex size-11 items-center justify-center rounded-full border border-paper/25 text-paper/60 transition-colors group-hover:border-gold group-hover:text-gold">
              <ArrowDown className="size-4 motion-safe:animate-bounce" strokeWidth={1.5} />
            </span>
          </button>
        </div>
      </div>

    </section>
  );
}
