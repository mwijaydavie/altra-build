import type { Metadata } from "next";
import { FleetBim } from "@/components/sections/FleetBim";
import { PageHero } from "@/components/marketing/PageHero";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Fleet & BIM — plant, survey and digital delivery",
  description:
    "38 owned plant units, LiDAR survey and ISO 19650 Level 3 BIM coordination on every Altra Build commission.",
  alternates: { canonical: "/fleet" },
};

export default function FleetPage() {
  return (
    <>
      <PageHero
        label="Fleet & BIM"
        kicker="Plant & digital delivery"
        title="Owned plant. Measured models."
        deck="We do not rent the critical path. Thirty-eight owned units, in-house LiDAR survey and federated BIM models keep the programme in our hands."
        meta={[
          { k: "Plant classes", v: "06" },
          { k: "Owned units", v: "38" },
          { k: "BIM", v: "ISO 19650 · Level 3" },
        ]}
        actions={
          <MagneticButton href="/contact" variant="gold" size="md">
            Book a technical briefing
          </MagneticButton>
        }
      />
      <FleetBim />
      <RelatedLinks
        tone="dark"
        title="Continue"
        links={[
          { label: "Capabilities", href: "/capabilities", meta: "Four divisions" },
          { label: "Method & Safety", href: "/method", meta: "Zero LTI" },
          { label: "Projects", href: "/projects", meta: "Models in practice" },
          { label: "About", href: "/about", meta: "The practice" },
        ]}
      />
    </>
  );
}
