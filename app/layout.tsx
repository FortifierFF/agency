import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_LOGO_PATH } from "@/components/SiteLogo";
import "../src/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PAL Studio - Digital Studio Showcase",
  description: "A digital studio that delivers results",
  icons: {
    icon: SITE_LOGO_PATH,
    apple: SITE_LOGO_PATH,
  },
  openGraph: {
    images: [{ url: SITE_LOGO_PATH, alt: "PAL Web Studio" }],
  },
};

// Root layout - required by Next.js
// The locale-specific layout is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
