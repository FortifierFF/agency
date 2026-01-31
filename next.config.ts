import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
