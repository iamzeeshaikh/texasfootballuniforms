import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
