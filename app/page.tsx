import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Capabilities } from "@/components/sections/Capabilities";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { MethodSafety } from "@/components/sections/MethodSafety";
import { FleetBim } from "@/components/sections/FleetBim";
import { Estimator } from "@/components/sections/Estimator";
import { PortalTeaser } from "@/components/sections/PortalTeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactRFQ } from "@/components/sections/ContactRFQ";
import { company, metrics, projects } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Civil engineering, high-rise & industrial construction — Tanzania",
  description:
    "Altra Build delivers bridges, towers, ports, plants and structural retrofits across Tanzania. 1.42M m² built, 99.8% on-time, zero lost-time injuries.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: company.legalName,
  alternateName: company.name,
  url: "https://altrabuild.co.tz",
  logo: "https://altrabuild.co.tz/brand/altra-logo.png",
  image: "https://altrabuild.co.tz/images/hero-construction.jpg",
  description: company.shortBio,
  foundingDate: String(company.founded),
  telephone: company.phone,
  email: company.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 1482, Msasani Peninsula",
    addressLocality: "Dar es Salaam",
    addressCountry: "TZ",
  },
  geo: { "@type": "GeoCoordinates", latitude: -6.7827, longitude: 39.2781 },
  areaServed: ["Tanzania", "Kenya", "Rwanda", "Uganda", "Zambia"],
  knowsAbout: [
    "Civil engineering",
    "Bridge construction",
    "High-rise construction",
    "Industrial facilities",
    "Structural retrofit",
  ],
  numberOfEmployees: { "@type": "QuantitativeValue", value: 1480 },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Intro />
      <Capabilities />
      <ProjectsShowcase />
      <MethodSafety />
      <FleetBim />
      <Estimator />
      <PortalTeaser />
      <Testimonials />
      <ContactRFQ />
    </>
  );
}
