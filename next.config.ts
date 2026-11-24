import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * A single, explicit policy for the whole surface. Next injects its hydration
 * bootstrap inline, and the design system uses inline style props, hence the
 * two `unsafe-inline` allowances on script/style. Everything else — frames,
 * objects, fonts, images, network — is locked to first-party origins plus the
 * demo Supabase project.
 *
 * `frame-ancestors` allows the two hosting surfaces this build is previewed
 * in (E2B sandbox previews and Arena) while blocking arbitrary framing.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "form-action 'self'",
  "frame-ancestors 'self' https://*.e2b.app https://*.arena.ai",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=(self), payment=(), usb=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  // The field app and command centre are demoed inside an iframe preview — the
  // dev overlay badge would sit on top of the fixed field navigation.
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
