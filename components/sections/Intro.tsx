import { ArrowUpRight, Compass, Ruler, ShieldCheck } from "lucide-react";
import { clients, company } from "@/data/siteData";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Logo } from "@/components/ui/Logo";

const principles = [
  {
    icon: Compass,
    title: "Ground truth first",
    body: "We survey and test before we price. The model is built from measured reality, not tender assumptions.",
  },
  {
    icon: Ruler,
    title: "Tolerance as culture",
    body: "Millimetres on rails, days on programme. Precision is not a premium service — it is the baseline.",
  },
  {
    icon: ShieldCheck,
    title: "The Kifaru Standard",
    body: "Armour without aggression: heavy engineering, quietly executed, and zero tolerance for unsafe work.",
  },
];

export function Intro() {
  return (
    <section className="relative overflow-hidden bg-paper text-ink" aria-labelledby="intro-title">
      {/* client strip */}
      <div className="border-b border-ink/10 bg-gold">
        <div className="flex items-center gap-6 overflow-hidden py-3.5">
          <p className="ml-5 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/70 sm:ml-8">
            Trusted by
          </p>
          <div className="relative flex-1 overflow-hidden">
            <div className="marquee-track flex w-max items-center gap-10 pr-10">
              {[...clients, ...clients].map((client, index) => (
                <span
                  key={`${client}-${index}`}
                  className="flex items-center gap-10 whitespace-nowrap font-display text-sm font-medium uppercase tracking-[0.08em] text-ink/80"
                >
                  {client}
                  <span className="size-1 rounded-full bg-ink/30" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.85fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="meta text-gold-deep">00 — Practice</span>
              <span className="h-px w-10 bg-ink/20" />
            </div>
            <SplitHeading
              as="h2"
              className="display-lg mt-6 max-w-[22ch] text-ink"
            >
              A Tanzanian contractor built for the decade the region actually needs.
            </SplitHeading>
            <div className="mt-8 grid gap-6 text-[15px] leading-relaxed text-ink/65 sm:grid-cols-2">
              <p>
                {company.shortBio} Our work sits where the money is committed for fifty years:
                crossings, towers, plants, terminals and the retrofit of the buildings we already have.
              </p>
              <p>
                We are engineer-led, not broker-led. The people who price your project are the people
                who will run it — and the rhino on our badge is a reminder that strength should be
                visible in the structure, not in the marketing.
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-ink/10 pt-8 sm:grid-cols-4">
              {[
                { k: "Founded", v: String(company.founded) },
                { k: "People", v: company.headcount },
                { k: "Divisions", v: "04" },
                { k: "Active sites", v: "17" },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="meta text-ink/40">{item.k}</dt>
                  <dd className="mt-2 font-display text-2xl tracking-tight text-ink">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-8">
            <div className="relative border border-ink/10 bg-cream p-6">
              <Logo variant="lockup" height={30} />
              <p className="mt-5 font-display text-lg leading-snug tracking-tight text-ink/80">
                “{company.trademark}”
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink/50">{company.story}</p>
              <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
                <span className="meta text-ink/35">Brand mark · original artwork</span>
                <a
                  href="/brand"
                  className="group inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60 transition-colors hover:text-ink"
                >
                  Standards
                  <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.05} className="flex gap-4">
                <principle.icon className="mt-0.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-sm font-medium uppercase tracking-[0.04em] text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">{principle.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
