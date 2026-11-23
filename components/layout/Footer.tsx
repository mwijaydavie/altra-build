import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { certifications, company, divisions, navigation, offices, projects } from "@/data/siteData";
import { Logo } from "@/components/ui/Logo";
import { LocalClock } from "@/components/ui/LocalClock";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 text-paper blueprint opacity-[0.35]" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 hidden size-[460px] opacity-[0.05] lg:block"
        style={{
          backgroundImage: "url(/brand/altra-mark-mono-cream.svg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="shell relative">
        {/* CTA band */}
        <div className="grid gap-10 border-b border-paper/10 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:py-20">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="inline-block h-px w-8 bg-gold" />
              Next tender cycle — Q1 2027
            </p>
            <h2 className="display-lg mt-6 max-w-2xl uppercase">
              Bring us the <span className="text-gold">hard site.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper/55">
              Tidal ground, occupied buildings, fixed energisation dates. If the programme looks
              impossible on the tender drawings, that is usually where we do our best work.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-wrap gap-3 lg:justify-end">
            <MagneticButton href="/#rfq" size="lg">
              Request project tender
            </MagneticButton>
            <MagneticButton href="/portal" size="lg" variant="outline-light">
              Client portal
            </MagneticButton>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.15fr_0.7fr_1.1fr_0.9fr] lg:gap-10">
          <div>
            <Logo variant="lockup" tone="inverse" height={38} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/55">{company.trademark}</p>
            <p className="mt-6 text-sm leading-relaxed text-paper/70">
              {offices[0]?.address}
              <br />
              {company.hq}
            </p>
            <div className="mt-6 space-y-2.5">
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-paper/60 transition-colors hover:text-gold"
              >
                <Phone className="size-3.5" strokeWidth={1.6} />
                {company.phone}
              </a>
              <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-paper/40">
                <MapPin className="size-3.5" strokeWidth={1.6} />
                {company.coordinates}
              </p>
            </div>
          </div>

          <nav aria-label="Sitemap" className="space-y-8">
            <div>
              <p className="eyebrow text-paper/35">Navigate</p>
              <ul className="mt-4 space-y-2.5">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-paper/70 transition-colors hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/brand" className="text-sm text-paper/70 transition-colors hover:text-gold">
                    Brand standards
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-paper/35">Divisions</p>
              <ul className="mt-4 space-y-2.5">
                {divisions.map((division) => (
                  <li key={division.id}>
                    <Link
                      href={`/#capabilities`}
                      className="text-sm text-paper/70 transition-colors hover:text-gold"
                    >
                      {division.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div>
            <p className="eyebrow text-paper/35">Offices &amp; yards</p>
            <ul className="mt-4 divide-y divide-paper/10">
              {offices.map((office) => (
                <li key={office.id} className="py-3.5 first:pt-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm text-paper/85">{office.city}</p>
                    <span className="meta text-paper/35">{office.kind}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-paper/45">{office.address}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <p className="eyebrow text-paper/35">Certified</p>
              <ul className="mt-4 space-y-2">
                {certifications.map((cert) => (
                  <li key={cert.code} className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-gold">{cert.code}</span>
                    <span className="text-[11px] text-paper/40">{cert.since}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gold/30 bg-gold/5 p-4">
              <p className="eyebrow text-gold">24h emergency site line</p>
              <a
                href={`tel:${company.emergency.replace(/\s/g, "")}`}
                className="mt-2 block font-display text-lg tracking-tight text-paper"
              >
                {company.emergency}
              </a>
              <p className="mt-1 text-[11px] text-paper/40">Incidents, utilities strikes, site security</p>
            </div>

            <div>
              <p className="eyebrow text-paper/35">Local time · Dar es Salaam</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="live-dot inline-block size-1.5 rounded-full bg-gold" />
                <LocalClock />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-paper/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="meta text-paper/35">
            © {new Date().getFullYear()} {company.legalName} · {company.registration} · {company.crb}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/legal/privacy" className="meta text-paper/35 transition-colors hover:text-gold">
              Privacy
            </Link>
            <Link href="/legal/terms" className="meta text-paper/35 transition-colors hover:text-gold">
              Terms
            </Link>
            <Link
              href="/projects"
              className="group meta flex items-center gap-1 text-paper/35 transition-colors hover:text-gold"
            >
              Project index
              <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
