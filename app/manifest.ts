import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Altra Build — Civil Engineering & Infrastructure",
    short_name: "Altra Build",
    description:
      "Tanzanian civil engineering, high-rise and industrial construction. Tender enquiries, project records and client portal.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F1117",
    theme_color: "#0F1117",
    lang: "en-TZ",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
