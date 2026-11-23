import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/siteData";
import { TextMotion } from "@/components/ui/TextMotion";

const featured = ["mtoni-delta-crossing", "msasani-peninsula-tower", "dodoma-hyperscale-campus"];

/** Three records, not a pinned gallery. The full index lives on /projects. */
export function HomeProjects() {
  const records = featured
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  return (
    <section className="bg-ink py-20 text-paper lg:py-24">
      <div className="shell">
        <div className="flex flex-col gap-6 border-t border-paper/15 pt-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="meta text-gold">02</span>
              <span className="eyebrow text-paper/45">Selected records</span>
            </div>
            <TextMotion
              as="h2"
              text="Built, audited, still standing."
              className="display-lg mt-4 max-w-[22ch] uppercase text-paper"
            />
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.14em] text-paper/65 transition-colors hover:text-gold"
          >
            Project index
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
          {records.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block w-[84%] shrink-0 snap-start md:w-auto"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.cover}
                  alt={project.coverAlt}
                  fill
                  sizes="(min-width: 768px) 31vw, 100vw"
                  className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 border border-paper/25 bg-ink/45 px-2.5 py-1 font-mono text-[11.5px] uppercase tracking-[0.12em] text-paper/80 backdrop-blur">
                  {project.code}
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4 border-t border-paper/15 pt-4">
                <div>
                  <p className="meta text-gold">{project.sector}</p>
                  <h3 className="mt-2 font-display text-[23px] uppercase leading-[1.08] tracking-tight text-paper">
                    {project.name}
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-[22px] leading-none text-paper/85">{project.year}</p>
                  <p className="mt-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] text-paper/40">
                    {project.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
