import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

import { company } from "@/data/siteData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://altrabuild.co.tz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Altra Build — Civil Engineering & Infrastructure, Tanzania",
    template: "%s · Altra Build",
  },
  description:
    "Altra Build is a Tanzanian general contractor delivering bridges, high-rise towers, industrial facilities and structural retrofits across East Africa. ISO 9001, 45001 and 14001 certified.",
  applicationName: company.name,
  keywords: [
    "Tanzania construction",
    "civil engineering Dar es Salaam",
    "general contractor Tanzania",
    "bridge construction East Africa",
    "design and build Tanzania",
    "structural retrofit",
    "industrial construction",
  ],
  authors: [{ name: company.legalName, url: siteUrl }],
  creator: company.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_TZ",
    url: siteUrl,
    siteName: company.name,
    title: "Altra Build — Engineering tomorrow's horizons",
    description:
      "Precision civil engineering, mega-structure delivery and heavy industrial infrastructure across Tanzania and East Africa.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Altra Build — engineering tomorrow's horizons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Altra Build — Engineering tomorrow's horizons",
    description:
      "Tanzanian civil engineering, high-rise and industrial construction. 1.42M m² delivered, zero lost-time injuries.",
    images: ["/brand/og-image.png"],
  },
  category: "construction",
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F2E7" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1117" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-TZ" className="antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('altra-theme')||'dark';var l=t==='light'||(t==='system'&&window.matchMedia('(prefers-color-scheme: light)').matches);var v=l?'light':'dark';document.documentElement.dataset.opsTheme=v;document.documentElement.style.colorScheme=v;}catch(e){}})();",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
