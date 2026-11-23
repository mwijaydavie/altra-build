import type { Metadata } from "next";
import { Capabilities } from "@/components/sections/Capabilities";
import { PageHero } from "@/components/marketing/PageHero";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Capabilities — four engineering divisions",
  description:
    "Heavy civil, commercial, industrial and retrofit divisions, each with its own plant, engineering leads and quality regime.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        label="Capabilities"
        title="Four divisions. One standard of execution."
        deck="Bridges, towers, plants and occupied-building retrofits — each division runs its own plant and engineering leads, coordinated by one project director who owns your programme."
        meta={[
          { k: "Divisions", v: "04" },
          { k: "Built area", v: "1.42M m²" },
          { k: "Certification", v: "ISO 9001 · 45001" },
        ]}
        actions={
          <MagneticButton href="/contact" variant="gold" size="md">
            Discuss a scope
          </MagneticButton>
        }
      />
      <Capabilities />
      <RelatedLinks
        title="Continue"
        links={[
          { label: "Fleet & BIM", href: "/fleet", meta: "Plant, survey, models" },
          { label: "Method & Safety", href: "/method", meta: "How sites run" },
          { label: "Projects", href: "/projects", meta: "214 commissions" },
          { label: "Estimator", href: "/estimator", meta: "Order-of-cost in 60s" },
        ]}
      />
    </>
  );
}
