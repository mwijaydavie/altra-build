import type { Metadata } from "next";
import { MethodSafety } from "@/components/sections/MethodSafety";
import { Testimonials } from "@/components/sections/Testimonials";
import { PageHero } from "@/components/marketing/PageHero";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Method & safety — how Altra Build runs a site",
  description:
    "Survey-first method statements, digital hold points and an ISO 45001 safety regime with zero lost-time injuries across active sites.",
  alternates: { canonical: "/method" },
};

export default function MethodPage() {
  return (
    <>
      <PageHero
        label="Method & Safety"
        title="Method before machinery."
        deck="Every site starts with measured ground and a written sequence. Safety is a hold point, not a poster: ISO 45001, daily briefings, and a stop-work authority that anyone can use."
        meta={[
          { k: "Safe man-hours", v: "4.26M" },
          { k: "Lost-time injuries", v: "Zero" },
          { k: "Safety standard", v: "ISO 45001" },
        ]}
        actions={
          <MagneticButton href="/contact" variant="gold" size="md">
            Request our method statement
          </MagneticButton>
        }
      />
      <MethodSafety />
      <Testimonials />
      <RelatedLinks
        title="Continue"
        links={[
          { label: "Fleet & BIM", href: "/fleet", meta: "Plant and models" },
          { label: "Projects", href: "/projects", meta: "Audited records" },
          { label: "Capabilities", href: "/capabilities", meta: "Four divisions" },
          { label: "Contact", href: "/contact", meta: "Tender desk · 2h SLA" },
        ]}
      />
    </>
  );
}
