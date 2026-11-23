import Link from "next/link";
import { ArrowUpRight, Compass, Ruler, ShieldCheck } from "lucide-react";
import { company } from "@/data/siteData";
import { TextMotion } from "@/components/ui/TextMotion";
import { Logo } from "@/components/ui/Logo";

const principles = [
  {
    icon: Compass,
    title: "Ground truth first",
    body: "We test before we price, so the model starts from measured ground.",
  },
  {
    icon: Ruler,
    title: "Tolerance as culture",
    body: "Millimetres on rails, days on programme. Precision is the baseline.",
  },
  {
    icon: ShieldCheck,
    title: "The Kifaru Standard",
    body: "Heavy engineering, quietly executed. Zero tolerance for unsafe work.",
  },
];

/** Short home manifesto — the full story lives on /about. */
export function HomeManifesto() {
  return (
    <section id="practice" className="bg-paper py-20 text-ink lg:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="meta text-gold-deep">00 — Practice</span>
            <span className="h-px w-10 bg-ink/20" />
          </div>

          <TextMotion
            as="h2"
            text="Built for the long horizon."
            className="display-lg mt-5 max-w-[16ch] uppercase text-ink"
          />

          <p className="mt-6 max-w-[56ch] text-[18px] leading-[1.7] text-ink/70">
            Altra Build is a Tanzanian contractor working across heavy civil, commercial and
            industrial construction. Engineer-led from tender to handover — the people who price
            your project are the people who run it.
          </p>

          <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-ink/15 pt-6 sm:gap-6">
            {[
              { k: "Founded", v: String(company.founded) },
              { k: "People", v: company.headcount },
              { k: "Active sites", v: "17" },
            ].map((item) => (
              <div key={item.k}>
                <dt className="meta text-ink/45">{item.k}</dt>
                <dd className="mt-2 font-display text-[24px] tracking-tight text-ink sm:text-[28px]">{item.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1 font-mono text-[13px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
            >
              Read the practice
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/capabilities"
              className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink/50 transition-colors hover:text-ink"
            >
              Four divisions
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="border border-ink/12 bg-cream p-6 sm:p-7">
            <Logo variant="lockup" height={32} />
            <p className="mt-6 font-display text-[22px] leading-[1.25] tracking-tight text-ink">
              “{company.trademark}”
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
              Armour without aggression. Weight with precision.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-ink/12 pt-4">
              <span className="meta text-ink/40">Est. {company.founded}</span>
              <Link
                href="/brand"
                className="group inline-flex shrink-0 items-center gap-1 font-mono text-[12px] uppercase tracking-[0.12em] text-ink/60 transition-colors hover:text-ink"
              >
                Standards
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <ul className="space-y-5">
            {principles.map((principle) => (
              <li key={principle.title} className="flex gap-4">
                <principle.icon className="mt-0.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-[16px] font-medium uppercase tracking-[0.03em] text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink/60">{principle.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
