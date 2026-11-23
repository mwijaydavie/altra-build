import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TextMotion } from "@/components/ui/TextMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";

const onward = [
  { label: "Method & Safety", href: "/method", meta: "How we run sites" },
  { label: "Fleet & BIM", href: "/fleet", meta: "Plant and models" },
  { label: "Estimator", href: "/estimator", meta: "Budget in 60s" },
  { label: "Client Portal", href: "/portal", meta: "Live project data" },
];

export function HomeCta() {
  return (
    <section className="border-t border-ink/12 bg-cream py-14 text-ink lg:py-20">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="meta text-gold-deep">03 — Next step</span>
              <span className="h-px w-10 bg-ink/20" />
            </div>
            <TextMotion
              as="h2"
              text="Bring us the hard site."
              className="display-lg mt-5 max-w-[16ch] uppercase text-ink"
            />
            <p className="mt-5 max-w-[52ch] text-[18px] leading-[1.7] text-ink/65">
              Tidal ground, occupied buildings, fixed energisation dates. If the programme looks
              impossible on the tender drawings, that is usually where we do our best work.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end lg:flex-col lg:items-stretch [&>div]:w-full">
            <MagneticButton href="/contact" size="lg" className="w-full justify-center">
              Request project tender
            </MagneticButton>
            <MagneticButton href="/estimator" size="lg" variant="outline" className="w-full justify-center">
              Get an estimate
            </MagneticButton>
          </div>
        </div>

        <div className="mt-12 grid gap-px border-t border-ink/15 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          {onward.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border-b border-ink/10 py-4 pr-4 transition-colors hover:text-ink sm:last:border-b-0 lg:border-b-0"
            >
              <span className="flex items-center gap-2">
                <span className="font-display text-[18px] uppercase tracking-tight text-ink">
                  {item.label}
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
              </span>
              <span className="mt-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-ink/40">
                {item.meta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
