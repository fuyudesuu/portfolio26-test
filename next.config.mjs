const isDev = process.env.NODE_ENV !== "production";

// 'unsafe-inline' in script-src: Next 14 App Router emits inline bootstrap/RSC
// payload scripts, and without nonce middleware there is no way to allow them
// individually. style-src needs it for Next/framer-motion injected styles.
// 'unsafe-eval' and ws: are dev-only (React refresh / HMR websocket).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  // Any https host: the admin CMS accepts arbitrary https image URLs (validated server-side).
  "img-src 'self' data: blob: https:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // No longer static export — Vercel handles server-side features
  // To revert to GitHub Pages: add output: "export", basePath, assetPrefix, images.unoptimized
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
