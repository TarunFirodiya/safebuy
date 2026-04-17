import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.hdfc.com" },
      { protocol: "https", hostname: "**.icicibank.com" },
      { protocol: "https", hostname: "**.sbi.co.in" },
    ],
  },
};

export default nextConfig;
