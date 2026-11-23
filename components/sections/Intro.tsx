import { ArrowUpRight, Compass, Ruler, ShieldCheck } from "lucide-react";
import { clients, company } from "@/data/siteData";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Logo } from "@/components/ui/Logo";

const principles = [
  {
    icon: Compass,
    title: "Ground truth first",
    body: "We survey and test before we price. The model starts from measured ground, not tender assumptions.",
  },
  {
    icon: Ruler,
    title: "Tolerance as culture",
    body: "Millimetres on rails, days on programme. Precision is the baseline, not a premium service.",
  },
  {
    icon: ShieldCheck,
    title: "The Kifaru Standard",
    body: "Heavy engineering, quietly executed. Zero tolerance for unsafe work.",
  },
];

export function Intro() {
  return (
    <section className="relative overflow-hidden bg-paper text-ink" aria-labelledby="intro-title">
      {/* client strip */}
      <div className="border-b border-ink/10 bg-gold">
        <div className="flex items-center gap-6 overflow-hidden py-3.5">
          <p className="ml-5 shrink-0 font-mono text-[14px] uppercase tracking-[0.18em] text-ink/70 sm:ml-8">
            Trusted by
          </p>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
            <div className="marquee-track flex w-max items-center gap-10 pr-10">
              {[...clients, ...clients].map((client, index) => (
                <span
                  key={`${client}-${index}`}
                  className="flex items-center gap-10 whitespace-nowrap font-display text-[17px] font-medium uppercase tracking-[0.08em] text-ink/80"
                >
                  {client}
                  <span className="size-1 rounded-full bg-ink/30" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="meta text-gold-deep">00 — Practice</span>
              <span className="h-px w-10 bg-ink/20" />
            </div>
            <SplitHeading as="h2" className="display-lg mt-6 max-w-[20ch] text-ink">
              A Tanzanian contractor built for the long horizon.
            </SplitHeading>

            <p className="mt-7 max-w-[60ch] text-[19px] leading-[1.7] text-ink/70">
              {company.shortBio}
            </p>
            <p className="mt-4 max-w-[60ch] text-[18px] leading-[1.7] text-ink/55">
              Engineer-led, not broker-led. The people who price your project are the people who
              will run it.
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-ink/15 pt-8 sm:grid-cols-4">
              {[
                { k: "Founded", v: String(company.founded) },
                { k: "People", v: company.headcount },
                { k: "Divisions", v: "04" },
                { k: "Active sites", v: "17" },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="meta text-ink/45">{item.k}</dt>
                  <dd className="mt-2 font-display text-[26px] tracking-tight text-ink">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-8">
            <div className="relative border border-ink/12 bg-cream p-6">
              <Logo variant="lockup" height={32} />
              <p className="mt-6 font-display text-[22px] leading-snug tracking-tight text-ink/85">
                “{company.trademark}”
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-ink/12 pt-4">
                <span className="meta text-ink/40">Brand mark · original artwork</span>
                <a
                  href="/brand"
                  className="group inline-flex items-center gap-1 font-mono text-[14px] uppercase tracking-[0.12em] text-ink/60 transition-colors hover:text-ink"
                >
                  Standards
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.05} className="flex gap-4">
                <principle.icon className="mt-0.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-[17px] font-medium uppercase tracking-[0.04em] text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink/60">{principle.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
