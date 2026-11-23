import type { Metadata } from "next";
import { PortalClient } from "@/components/portal/PortalClient";

export const metadata: Metadata = {
  title: "Client portal",
  description:
    "Secure Altra Build client portal — live programme, documents, RFIs, invoices and safety records for your project.",
  alternates: { canonical: "/portal" },
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return <PortalClient />;
}
