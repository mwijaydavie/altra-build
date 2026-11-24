import type { Metadata, Viewport } from "next";

import { OpsProviders } from "@/components/dashboard/Providers";
import { ServiceWorker } from "@/components/field/ServiceWorker";

export const metadata: Metadata = {
  title: "ALTRA FIELD — site reporting",
  description:
    "Offline-first daily logs, safety observations and SOS broadcast for Altra Build site supervisors.",
  manifest: "/field/manifest.webmanifest",
  applicationName: "ALTRA FIELD",
  appleWebApp: {
    capable: true,
    title: "ALTRA FIELD",
    statusBarStyle: "black-translucent",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0F1117",
};

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <OpsProviders>
      <ServiceWorker />
      {children}
    </OpsProviders>
  );
}
