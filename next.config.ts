import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    formats: ["image/avif", "image/webp"],
  },
  
  // Set workspace root to silence warning about multiple lockfiles
  outputFileTracingRoot: path.join(process.cwd()),
};

export default withNextIntl(nextConfig);
