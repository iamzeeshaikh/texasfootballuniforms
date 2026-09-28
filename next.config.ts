import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve trailing-slash URLs so the served page matches the canonical tags and
  // sitemap (both use /slug/). Without this, /slug/ 308-redirected to /slug while
  // the canonical still pointed to /slug/, so Google's declared canonical was a
  // redirect and pages would not index.
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // No CSP here on purpose: the page loads the ZeeOps chat widget, gtag and
  // inline JSON-LD, and a policy tight enough to be worth having would break
  // one of them silently. These four are the headers that cost nothing.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.texasfootballuniforms.com" }],
        destination: "https://texasfootballuniforms.com/:path*",
        permanent: true,
      },
      {
        source: "/locations/corpus-christi",
        destination: "/corpus-christi-football-uniforms",
        permanent: true,
      },
      // The two other paths a buyer or a crawler guesses for this document.
      // Both were 404 while every product page's schema claimed a return
      // policy; the policy now lives at /return-policy/ and these lead to it.
      { source: "/returns", destination: "/return-policy/", permanent: true },
      { source: "/refund-policy", destination: "/return-policy/", permanent: true },
    ];
  },
};

export default nextConfig;
