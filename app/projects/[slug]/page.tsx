import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, MapPin, Quote } from "lucide-react";
import { adjacentProjects, company, getDivision, getProject, projects } from "@/data/siteData";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Logo } from "@/components/ui/Logo";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — Altra Build`,
      description: project.summary,
      images: [{ url: project.cover, width: 1400, height: 788, alt: project.coverAlt }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const division = getDivision(project.division);
  const { prev, next } = adjacentProjects(project.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pb-12 pt-28 text-paper lg:pb-16 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-20" aria-hidden />
        <div className="shell relative">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/40">
            <Link href="/projects" className="flex items-center gap-1.5 transition-colors hover:text-gold">
              <ArrowLeft className="size-3" />
              Project index
            </Link>
            <span className="text-paper/20">/</span>
            <span className="text-paper/60">{project.code}</span>
            <span className="text-paper/20">/</span>
            <span>{project.sector}</span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    "flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] " +
                    (project.status === "Completed" ? "bg-gold text-ink" : "border border-gold/50 text-gold")
                  }
                >
                  <span className="size-1 rounded-full bg-current" />
                  {project.status}
                </span>
                <span className="border border-paper/20 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-paper/60">
                  {division.name}
                </span>
              </div>
              <SplitHeading as="h1" className="display-xl mt-6 uppercase">
                {project.name}
              </SplitHeading>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-paper/60 sm:text-[15px]">
                {project.summary}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-paper/15 pt-5">
              {[
                { k: "Location", v: project.location },
                { k: "Delivery", v: String(project.year) },
                { k: "Client", v: project.specs.find((s) => s.label === "Client")?.value ?? "Confidential" },
                { k: "Value", v: project.specs.find((s) => s.label === "Contract value")?.value ?? "—" },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="meta text-paper/35">{item.k}</dt>
                  <dd className="mt-1.5 text-[12.5px] leading-snug text-paper/80">{item.v}</dd>
                </div>
              ))}
              <div className="col-span-2 flex items-center gap-2 text-paper/35">
                <MapPin className="size-3" />
                <span className="font-mono text-[9.5px] tracking-[0.1em]">{project.coordinates}</span>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Cover */}
      <div className="relative h-[46svh] min-h-[320px] w-full overflow-hidden bg-ink lg:h-[68svh]">
        <Image
          src={project.cover}
          alt={project.coverAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/30" />
        <div className="absolute bottom-5 left-0 right-0">
          <div className="shell flex items-center justify-between gap-4 font-mono text-[9.5px] uppercase tracking-[0.12em] text-paper/60">
            <span>{division.ref} / {project.code.split("/").slice(-1)[0]}</span>
            <span>Fig. 01 — {project.sector}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <section className="bg-paper py-16 text-ink lg:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <div className="border-t border-ink/15 pt-6">
              <p className="eyebrow text-gold-deep">The commission</p>
              <p className="mt-5 font-display text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.35] tracking-tight text-ink/85">
                {project.intro}
              </p>
            </div>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <p className="meta text-ink/35">Brief</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{project.brief}</p>
              </div>
              <div>
                <p className="meta text-ink/35">Response</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{project.response}</p>
              </div>
            </div>

            <div className="mt-12 border-t border-ink/15 pt-6">
              <p className="meta text-ink/35">Audited outcomes</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/70">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center bg-ink text-paper">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            {/* Phases */}
            <div className="mt-12 border-t border-ink/15 pt-6">
              <div className="flex items-baseline justify-between">
                <p className="meta text-ink/35">Programme</p>
                <p className="meta text-ink/25">{project.progress}% complete</p>
              </div>
              <div className="mt-6 space-y-0">
                {project.phases.map((phase, index) => (
                  <div key={phase.id} className="flex items-start gap-4 border-t border-ink/10 py-4">
                    <span className="mt-0.5 font-mono text-[10px] text-ink/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[13px] text-ink/80">{phase.name}</p>
                        <p className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-ink/35">
                          {phase.window}
                        </p>
                      </div>
                      <div className="mt-2 h-[3px] w-full bg-ink/10">
                        <div
                          className={phase.state === "active" ? "h-full bg-gold-deep" : "h-full bg-ink/60"}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                    </div>
                    <span
                      className={
                        "mt-0.5 shrink-0 font-mono text-[8.5px] uppercase tracking-[0.08em] " +
                        (phase.state === "active" ? "text-gold-deep" : "text-ink/30")
                      }
                    >
                      {phase.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-ink/15 bg-cream/60 p-5">
              <div className="flex items-center justify-between border-b border-ink/15 pb-3">
                <p className="eyebrow text-ink/45">Technical sheet</p>
                <Logo variant="mark" height={22} />
              </div>
              <dl className="mt-2 divide-y divide-ink/10">
                {project.specs.map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-[10.5px] uppercase tracking-[0.06em] text-ink/40">{spec.label}</dt>
                    <dd className="text-right font-display text-[13px] text-ink">
                      {spec.value} {spec.unit && <span className="text-[10px] text-ink/40">{spec.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-ink p-5 text-paper">
              <p className="eyebrow text-gold">Similar scope?</p>
              <p className="mt-3 text-[13px] leading-relaxed text-paper/60">
                We can share redacted method statements, plant lists and client references for this
                class of work.
              </p>
              <div className="mt-5">
                <MagneticButton href="/#rfq" size="md" className="w-full justify-center">
                  Request tender
                </MagneticButton>
              </div>
              <a
                href={`mailto:${company.email}`}
                className="mt-3 flex items-center justify-center gap-1.5 border border-paper/20 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60 transition-colors hover:border-gold hover:text-gold"
              >
                Email tender desk
                <ArrowUpRight className="size-3" />
              </a>
            </div>
          </aside>
        </div>

        {/* Gallery */}
        <div className="shell mt-16">
          <div className="grid gap-6 sm:grid-cols-2">
            {project.gallery.map((image, index) => (
              <Reveal key={image.src} delay={index * 0.06}>
                <figure>
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 640px) 46vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-2.5 flex items-baseline justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">
                    <span>{image.caption}</span>
                    <span>Fig. {String(index + 2).padStart(2, "0")}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="shell mt-16">
          <Reveal className="relative border border-ink/15 bg-cream p-7 sm:p-10">
            <Quote className="size-8 text-gold-deep" strokeWidth={1.3} />
            <blockquote className="mt-5 max-w-3xl font-display text-[clamp(1.3rem,2.6vw,2rem)] leading-[1.3] tracking-tight text-ink/85">
              “{project.quote.text}”
            </blockquote>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-ink/15 pt-4">
              <div>
                <p className="text-[13px] font-medium text-ink">{project.quote.author}</p>
                <p className="mt-1 text-[11px] text-ink/45">{project.quote.role}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.awards.map((award) => (
                  <span
                    key={award}
                    className="border border-ink/15 px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.08em] text-ink/40"
                  >
                    {award}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Next / prev */}
      <section className="bg-ink py-12 text-paper">
        <div className="shell grid gap-8 sm:grid-cols-2">
          <Link href={`/projects/${prev.slug}`} className="group border-t border-paper/15 pt-5">
            <p className="meta text-paper/35">Previous record</p>
            <p className="display-md mt-2 flex items-center gap-3 text-paper/80 uppercase transition-colors group-hover:text-gold">
              {prev.name}
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            </p>
          </Link>
          <Link href={`/projects/${next.slug}`} className="group border-t border-paper/15 pt-5 sm:text-right">
            <p className="meta text-paper/35">Next record</p>
            <p className="display-md mt-2 flex items-center gap-3 text-paper/80 uppercase transition-colors group-hover:text-gold sm:justify-end">
              {next.name}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
