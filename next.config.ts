import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  async redirects() {
    return [
      // Blog: single wildcard catches /blog and all /blog/* variants
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:slug*",
        destination: "/",
        permanent: true,
      },

      // Legacy marketing / site pages → homepage
      { source: "/the-acorn-care-approach", destination: "/", permanent: true },
      { source: "/contact",                 destination: "/", permanent: true },
      { source: "/whyacorncare",            destination: "/", permanent: true },
      { source: "/acorn-plans",             destination: "/", permanent: true },
      { source: "/home",                    destination: "/", permanent: true },
      { source: "/get-started",             destination: "/", permanent: true },
      { source: "/contact-plan",            destination: "/", permanent: true },
      { source: "/store",                   destination: "/", permanent: true },

      // NOTE: /our-story is intentionally omitted — it is a live route on this site.
    ];
  },
};

export default nextConfig;
