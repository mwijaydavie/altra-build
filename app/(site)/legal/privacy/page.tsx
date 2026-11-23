import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How Altra Build Limited collects and processes personal data submitted through tender enquiries and the client portal.",
  alternates: { canonical: "/legal/privacy" },
};

const sections = [
  {
    title: "1. Who we are",
    body: "Altra Build Limited (BRELA Reg. 104-882-TZ) is the data controller for information submitted through this website. Our registered office is Plot 1482, Msasani Peninsula, Dar es Salaam, Tanzania.",
  },
  {
    title: "2. What we collect",
    body: "Tender enquiries: name, organisation, email, telephone number, site location and the scope information you choose to provide. Client portal: account identifiers, project records and access logs. Server logs record IP address and user agent for security purposes.",
  },
  {
    title: "3. Why we process it",
    body: "To respond to enquiries, prepare tenders, administer contracts, meet health-and-safety and statutory obligations, and secure our systems. We do not sell personal data, and we do not use enquiry details for unrelated marketing.",
  },
  {
    title: "4. Legal basis and retention",
    body: "Processing is based on your consent, our legitimate interest in responding to commercial enquiries, and our legal obligations. Tender records are held for seven years from contract close in line with Tanzanian construction and tax requirements.",
  },
  {
    title: "5. Sharing",
    body: "We share data only with consultants and subcontractors engaged on your project, our auditors, and public authorities where legally required. All parties are bound by confidentiality and data-protection terms.",
  },
  {
    title: "6. Your rights",
    body: "Under the Personal Data Protection Act 2022 (Tanzania) you may request access, correction, deletion, restriction or portability of your data, and object to processing. Write to tender@altrabuild.co.tz; we respond within 30 days.",
  },
  {
    title: "7. Security",
    body: "Portal access is protected by TLS, role-based permissions and multi-factor authentication for staff. We run quarterly access reviews and annual penetration tests.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="bg-paper pb-20 pt-32 text-ink lg:pt-40">
      <div className="shell max-w-3xl">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3" />
          Back to site
        </Link>
        <p className="eyebrow mt-10 text-gold-deep">Legal</p>
        <h1 className="display-lg mt-4 uppercase">Privacy notice</h1>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/35">
          Last updated 12 November 2026
        </p>
        <div className="mt-10 space-y-8 border-t border-ink/15 pt-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-[15px] tracking-tight text-ink">{section.title}</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">{section.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-ink/15 pt-6 text-[11px] leading-relaxed text-ink/40">
          Questions: tender@altrabuild.co.tz · +255 22 550 0148 · Plot 1482 Msasani Peninsula, Dar es
          Salaam.
        </p>
      </div>
    </section>
  );
}
