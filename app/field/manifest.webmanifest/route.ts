import { NextResponse } from "next/server";

export const dynamic = "force-static";

/** Field PWA manifest — served at /field/manifest.webmanifest. */
export function GET(): NextResponse {
  return NextResponse.json(
    {
      name: "ALTRA FIELD — Site reporting",
      short_name: "ALTRA FIELD",
      description:
        "Offline-first daily logs, safety observations and SOS broadcast for Altra Build site supervisors.",
      id: "/field",
      start_url: "/field",
      scope: "/field",
      display: "standalone",
      orientation: "portrait",
      background_color: "#0F1117",
      theme_color: "#0F1117",
      lang: "en-TZ",
      categories: ["business", "productivity"],
      icons: [
        { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
