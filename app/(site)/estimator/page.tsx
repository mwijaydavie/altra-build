import type { Metadata } from "next";
import { Estimator } from "@/components/sections/Estimator";
import { PageHero } from "@/components/marketing/PageHero";
import { RelatedLinks } from "@/components/marketing/RelatedLinks";

export const metadata: Metadata = {
  title: "Estimator — order-of-cost in sixty seconds",
  description:
    "Estimate Tanzanian construction cost from delivered rates on 214 Altra Build commissions. Discipline, area, ground conditions and location.",
  alternates: { canonical: "/estimator" },
};

export default function EstimatorPage() {
  return (
    <>
      <PageHero
        label="Estimator"
        title="Price the shape of your project."
        deck="An order-of-cost model built from delivered rates on 214 Tanzanian commissions. It will not replace a tender — it tells you whether budget and programme are in the same room."
        meta={[
          { k: "Rate base", v: "214 projects" },
          { k: "Coverage", v: "9 regions" },
          { k: "Time", v: "≈60 seconds" },
        ]}
      />
      <Estimator />
      <RelatedLinks
        title="Continue"
        links={[
          { label: "Request a tender", href: "/contact", meta: "2h acknowledgement" },
          { label: "Capabilities", href: "/capabilities", meta: "What we build" },
          { label: "Projects", href: "/projects", meta: "Delivered rates" },
          { label: "Client portal", href: "/portal", meta: "Live cost data" },
        ]}
      />
    </>
  );
}
