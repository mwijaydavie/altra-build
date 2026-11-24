import type { Metadata } from "next";
import { Intro } from "@/components/sections/Intro";
import { PageHero } from "@/components/marketing/PageHero";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { certifications, company, offices } from "@/data/siteData";

export const metadata: Metadata = {
  title: "About — a Tanzanian contractor since 2009",
  description:
    "Altra Build is a Dar es Salaam general contractor: 1,480 people, four divisions, 17 active sites and CRB Class One registration.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        kicker="The practice"
        title="Engineer-led since 2009."
        deck="Altra Build is a Tanzanian general contractor and civil engineering firm. We plan, engineer and deliver the crossings, towers, plants and ports that carry a growing region."
        meta={[
          { k: "Founded", v: String(company.founded) },
          { k: "People", v: company.headcount },
          { k: "Registration", v: "CRB Class One" },
        ]}
        actions={
          <MagneticButton href="/contact" variant="gold" size="md">
            Meet the tender desk
          </MagneticButton>
        }
      />

      <Intro />

      {/* credentials + offices */}
      <section className="border-t border-ink/12 bg-paper py-16 text-ink lg:py-20">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="meta text-gold-deep">05·A</span>
              <h2 className="eyebrow text-ink/65">Credentials</h2>
            </div>
            <ul className="mt-6 divide-y divide-ink/10 border-t border-ink/15">
              {certifications.map((cert) => (
                <li key={cert.code} className="flex items-baseline justify-between gap-6 py-4">
                  <div>
                    <p className="font-display text-[19px] tracking-tight text-ink">{cert.code}</p>
                    <p className="mt-1 text-[15.5px] text-ink/65">{cert.name}</p>
                  </div>
                  <p className="shrink-0 text-right font-mono text-[12px] uppercase tracking-[0.1em] text-ink/65">
                    {cert.issuer}
                    <br />
                    Since {cert.since}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <span className="meta text-gold-deep">05·B</span>
              <h2 className="eyebrow text-ink/65">Offices &amp; yards</h2>
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {offices.map((office) => (
                <li key={office.id} className="border border-ink/12 bg-cream/60 p-5">
                  <p className="meta text-gold-deep">{office.kind}</p>
                  <p className="mt-2 font-display text-[19px] leading-tight tracking-tight text-ink">
                    {office.city}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{office.address}</p>
                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="mt-3 inline-block font-mono text-[12.5px] tracking-[0.06em] text-ink/70 transition-colors hover:text-ink"
                  >
                    {office.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <RelatedLinks
        title="Continue"
        links={[
          { label: "Projects", href: "/projects", meta: "Built and audited" },
          { label: "Method & Safety", href: "/method", meta: "How we run sites" },
          { label: "Brand", href: "/brand", meta: "Standards and assets" },
          { label: "Contact", href: "/contact", meta: "Tender desk" },
        ]}
      />
    </>
  );
}
