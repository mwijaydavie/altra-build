import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { company, projects } from "@/data/siteData";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Project index",
  description:
    "Selected Altra Build commissions across Tanzania: bridges, towers, ports, data campuses, logistics hubs and structural retrofits.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsIndexPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-32 text-paper lg:pb-20 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-25" aria-hidden />
        <div className="shell relative">
          <div className="flex items-baseline gap-3">
            <span className="meta text-gold">Index</span>
            <span className="eyebrow text-paper/55">214 commissions · 2009—2026</span>
          </div>
          <SplitHeading as="h1" className="display-xl mt-6 max-w-4xl uppercase">
            Built, audited, still standing.
          </SplitHeading>
          <div className="mt-8 flex flex-col justify-between gap-6 border-t border-paper/15 pt-6 sm:flex-row sm:items-end">
            <p className="max-w-md text-[15.5px] leading-relaxed text-paper/55">
              Every published record carries its contract value, structural quantities, programme and
              audited outcomes. Anonymous references are available on request under NDA.
            </p>
            <div className="flex flex-col gap-3 [&>div]:w-full sm:flex-row sm:flex-wrap sm:[&>div]:w-auto">
              <MagneticButton href="/contact" variant="gold" size="md" className="w-full justify-center sm:w-auto">
                Discuss a project
              </MagneticButton>
              <MagneticButton href="/" variant="outline-light" size="md" className="w-full justify-center sm:w-auto">
                Back to overview
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 text-ink lg:py-24">
        <div className="shell">
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={(index % 2) * 0.06} as="article">
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                    <Image
                      src={project.cover}
                      alt={project.coverAlt}
                      fill
                      sizes="(min-width: 768px) 46vw, 100vw"
                      className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-paper">
                      <span className="border border-paper/25 bg-ink/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/75 backdrop-blur">
                        {project.code}
                      </span>
                      <span className="flex size-10 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-6 border-t border-ink/15 pt-4">
                    <div>
                      <p className="meta text-gold-deep">
                        {project.sector} · {project.location}
                      </p>
                      <h2 className="display-md mt-2 uppercase">{project.name}</h2>
                      <p className="mt-2 max-w-md text-[15.5px] leading-relaxed text-ink/65">
                        {project.summary}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-2xl leading-none text-ink">{project.year}</p>
                      <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink/65">
                        {project.status}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-ink/15 pt-8 sm:flex-row sm:items-center">
            <p className="max-w-md text-[15.5px] leading-relaxed text-ink/65">
              Want the full record for a project similar to yours? The tender desk can share redacted
              method statements and references.
            </p>
            <MagneticButton href={`mailto:${company.email}`} external variant="ink" size="md">
              Request references
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}
