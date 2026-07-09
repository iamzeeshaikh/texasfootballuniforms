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
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.texasfootballuniforms.com" }],
        destination: "https://texasfootballuniforms.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
