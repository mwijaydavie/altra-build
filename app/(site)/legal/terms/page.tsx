import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Website terms",
  description:
    "Terms governing use of the Altra Build website, indicative estimator and tender enquiry service.",
  alternates: { canonical: "/legal/terms" },
};

const clauses = [
  {
    title: "1. Information on this site",
    body: "Project descriptions, quantities and programme data are published for reference. They do not constitute an offer, and delivery figures are audited at contract close. Project imagery may be representative of typology where a client has requested confidentiality.",
  },
  {
    title: "2. Indicative estimator",
    body: "The order-of-cost model produces a non-binding range derived from delivered 2025 rates. It excludes land, finance, professional fees, escalation and abnormal ground risk. Only a signed tender or contract creates binding obligations.",
  },
  {
    title: "3. Tender enquiries",
    body: "Submitting an enquiry does not commit either party. Altra Build may decline a scope that falls outside our registration class, capacity or safety standards. Enquiry references are issued for tracking only.",
  },
  {
    title: "4. Client portal",
    body: "Portal credentials are issued to named individuals and must not be shared. Documents remain the property of the issuing party and are subject to the confidentiality terms of the relevant contract.",
  },
  {
    title: "5. Intellectual property",
    body: "The Altra Build name, rhino emblem, lockups and this website's design are the property of Altra Build Limited. Written permission is required for any use other than the approved brand assets published at /brand.",
  },
  {
    title: "6. Liability",
    body: "To the extent permitted by Tanzanian law, Altra Build excludes liability for indirect or consequential loss arising from use of this website. Nothing excludes liability for fraud, death or personal injury caused by negligence.",
  },
  {
    title: "7. Governing law",
    body: "These terms are governed by the laws of the United Republic of Tanzania, with the courts of Dar es Salaam having exclusive jurisdiction.",
  },
];

export default function TermsPage() {
  return (
    <section className="bg-paper pb-20 pt-32 text-ink lg:pt-40">
      <div className="shell max-w-3xl">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink/40 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3" />
          Back to site
        </Link>
        <p className="eyebrow mt-10 text-gold-deep">Legal</p>
        <h1 className="display-lg mt-4 uppercase">Website terms</h1>
        <p className="mt-4 font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink/35">
          Last updated 12 November 2026
        </p>
        <div className="mt-10 space-y-8 border-t border-ink/15 pt-8">
          {clauses.map((clause) => (
            <div key={clause.title}>
              <h2 className="font-display text-[17px] tracking-tight text-ink">{clause.title}</h2>
              <p className="mt-2 text-[16px] leading-relaxed text-ink/60">{clause.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
