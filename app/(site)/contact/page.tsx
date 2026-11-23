import type { Metadata } from "next";
import { ContactRFQ } from "@/components/sections/ContactRFQ";
import { PageHero } from "@/components/marketing/PageHero";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";
import { company } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Contact — tender desk, Dar es Salaam",
  description:
    "Send a project brief to the Altra Build tender desk. Two-hour acknowledgement, ten-day tender window, 24-hour site line.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        kicker="Tender desk"
        title="Bring us the hard site."
        deck="Tidal ground, occupied buildings, fixed energisation dates. Send the brief and the tender desk will acknowledge within two working hours."
        meta={[
          { k: "Tender desk", v: company.email },
          { k: "Office", v: company.phone },
          { k: "24h site line", v: company.emergency },
        ]}
      />
      <ContactRFQ />
      <RelatedLinks
        title="Continue"
        links={[
          { label: "Estimator", href: "/estimator", meta: "Indicative budget" },
          { label: "Portfolio", href: "/projects", meta: "214 commissions" },
          { label: "Client portal", href: "/portal", meta: "Project sign-in" },
          { label: "Field app", href: "/field", meta: "Offline site log" },
        ]}
      />
    </>
  );
}
