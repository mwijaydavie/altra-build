"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { projects } from "@/data/siteData";
import { gsap, useGSAP } from "@/lib/gsap";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Logo } from "@/components/ui/Logo";

export function ProjectsShowcase() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const trackEl = track.current;
        if (!trackEl) return;
        const distance = () => Math.max(trackEl.scrollWidth - window.innerWidth + 24, 0);

        const tween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress.current) {
                gsap.set(progress.current, { scaleX: self.progress });
              }
            },
          },
        });

        return () => tween.kill();
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      id="projects"
      ref={section}
      className="relative overflow-hidden bg-ink text-paper lg:flex lg:h-svh lg:flex-col"
      aria-labelledby="projects-title"
    >
      <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-[0.25]" aria-hidden />

      {/* header */}
      <div className="shell flex items-end justify-between gap-6 pb-6 pt-20 lg:pt-24">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="meta text-gold">02</span>
            <span className="eyebrow text-paper/45">Flagship projects</span>
          </div>
          <h2 id="projects-title" className="display-lg mt-4 max-w-3xl uppercase">
            Work that carries <span className="text-gold">weight.</span>
          </h2>
        </div>
        <p className="hidden max-w-[220px] text-right text-[11px] leading-relaxed text-paper/40 lg:block">
          Scroll vertically — the gallery advances horizontally. Each record is an audited case study.
        </p>
      </div>

      {/* desktop horizontal rail */}
      <div className="hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <div
          ref={track}
          className="flex min-h-0 flex-1 items-stretch gap-6 pl-[max(3rem,calc((100vw-92rem)/2+3rem))] pr-16"
        >
          <article className="flex w-[26vw] max-w-[380px] shrink-0 flex-col justify-center pr-2">
            <Logo variant="mark" tone="inverse" height={46} />
            <p className="mt-8 font-display text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.05] tracking-tight text-paper">
              Six commissions. <span className="text-paper/40">1.4 million square metres of proof.</span>
            </p>
            <p className="mt-6 text-[13px] leading-relaxed text-paper/50">
              Bridges, towers, ports, plants and buildings that had to keep working while we rebuilt
              them. Open a record to see the brief, the method and the audited outcomes.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.16em] text-paper/35">
                {String(1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <span className="h-px w-12 bg-paper/20" />
              <ArrowRight className="size-3.5 text-paper/40" />
            </div>
          </article>

          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative h-full w-[min(64vw,860px)] shrink-0 overflow-hidden bg-ink-800"
            >
              <Image
                src={project.cover}
                alt={project.coverAlt}
                fill
                sizes="64vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

              <div className="relative flex h-full flex-col justify-between p-7 text-paper">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="border border-paper/25 bg-ink/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/75 backdrop-blur">
                      {project.code}
                    </span>
                    <span
                      className={
                        "flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] " +
                        (project.status === "Completed"
                          ? "bg-gold text-ink"
                          : "border border-gold/50 text-gold")
                      }
                    >
                      <span className="size-1 rounded-full bg-current" />
                      {project.status}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-paper/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="max-w-[30rem]">
                  <p className="meta flex items-center gap-2 text-gold">
                    <MapPin className="size-3" strokeWidth={1.8} />
                    {project.location}
                  </p>
                  <h3 className="display-md mt-3 text-[clamp(1.7rem,3vw,2.9rem)] uppercase text-paper">
                    {project.name}
                  </h3>
                  <p className="mt-3 max-w-md text-[13px] leading-relaxed text-paper/60">
                    {project.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-paper/20 pt-4">
                    {project.specs.slice(0, 3).map((spec) => (
                      <div key={spec.label}>
                        <p className="font-display text-base leading-none text-paper">
                          {spec.value} <span className="text-[11px] text-paper/45">{spec.unit}</span>
                        </p>
                        <p className="mt-1.5 text-[9.5px] uppercase tracking-[0.1em] text-paper/40">
                          {spec.label}
                        </p>
                      </div>
                    ))}
                    <span className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/60 transition-colors group-hover:text-gold">
                      Case study
                      <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <div className="flex w-[24vw] max-w-[340px] shrink-0 flex-col justify-center border border-paper/15 bg-gold p-8 text-ink">
            <p className="meta text-ink/55">Archive</p>
            <p className="display-md mt-4 uppercase">214 commissions since 2009.</p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
              Selected work is published in full. The rest is available to clients under NDA on request.
            </p>
            <div className="mt-8">
              <MagneticButton href="/projects" size="md" variant="ink">
                Open project index
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="shell flex shrink-0 items-center gap-5 py-5">
          <span className="meta text-paper/30">Scroll</span>
          <div className="h-px flex-1 bg-paper/15">
            <span
              ref={progress}
              className="block h-px origin-left scale-x-0 bg-gold"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span className="meta text-paper/30">06 records</span>
        </div>
      </div>

      {/* mobile stack */}
      <div className="shell space-y-6 pb-16 pt-4 lg:hidden">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block overflow-hidden border border-paper/10 bg-ink-800"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={project.cover}
                alt={project.coverAlt}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div>
                  <p className="meta text-gold">{project.location}</p>
                  <h3 className="display-md mt-1.5 text-[1.35rem] text-paper">{project.name}</h3>
                </div>
                <span className="flex size-9 items-center justify-center rounded-full border border-paper/30 text-paper">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <span className="absolute left-4 top-4 border border-paper/25 bg-ink/40 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-paper/70 backdrop-blur">
                {project.code}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <p className="text-[11.5px] text-paper/50">
                {project.sector} · {project.year}
              </p>
              <span className="font-mono text-[10px] text-paper/30">
                {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
            </div>
          </Link>
        ))}
        <MagneticButton href="/projects" variant="gold" size="lg" className="w-full justify-center">
          Open project index
        </MagneticButton>
      </div>
    </section>
  );
}
