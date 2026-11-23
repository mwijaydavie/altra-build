import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { divisions } from "@/data/siteData";
import { TextMotion } from "@/components/ui/TextMotion";

/** Four divisions as doors into /capabilities — no paragraph per card. */
export function HomeDivisions() {
  return (
    <section className="border-t border-ink/12 bg-paper py-20 text-ink lg:py-24">
      <div className="shell">
        <div className="flex flex-col gap-6 border-t border-ink/15 pt-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="meta text-gold-deep">01</span>
              <span className="eyebrow text-ink/45">What we build</span>
            </div>
            <TextMotion
              as="h2"
              text="Four divisions. One standard."
              className="display-lg mt-4 max-w-[20ch] uppercase text-ink"
            />
          </div>
          <Link
            href="/capabilities"
            className="group inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.14em] text-ink/65 transition-colors hover:text-ink"
          >
            All capabilities
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* desktop: image cards */}
        <div className="mt-10 hidden gap-5 lg:grid lg:grid-cols-4">
          {divisions.map((division) => (
            <Link key={division.id} href={`/capabilities?division=${division.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <Image
                  src={division.image}
                  alt={division.alt}
                  fill
                  sizes="(min-width: 1024px) 23vw, 46vw"
                  className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                  <p className="meta text-gold">{division.ref}</p>
                  <h3 className="mt-2 font-display text-[24px] uppercase leading-[1.05] tracking-tight">
                    {division.shortName}
                  </h3>
                </div>
                <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-paper/35 text-paper opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <p className="font-mono text-[12.5px] uppercase tracking-[0.1em] text-ink/55">
                  {division.kicker}
                </p>
                <span className="font-mono text-[12px] text-ink/30">{division.index}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* mobile/tablet: compact rows — keeps the page short */}
        <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10 lg:hidden">
          {divisions.map((division) => (
            <li key={division.id}>
              <Link
                href={`/capabilities?division=${division.id}`}
                className="group flex items-center gap-4 py-4"
              >
                <div className="relative size-20 shrink-0 overflow-hidden bg-ink">
                  <Image
                    src={division.image}
                    alt={division.alt}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="meta text-gold-deep">
                    {division.index} · {division.ref}
                  </p>
                  <h3 className="mt-1 font-display text-[21px] uppercase leading-tight tracking-tight text-ink">
                    {division.shortName}
                  </h3>
                  <p className="mt-1 font-mono text-[11.5px] uppercase leading-snug tracking-[0.08em] text-ink/45">
                    {division.kicker}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-ink/30 transition-colors group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
