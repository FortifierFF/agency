import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_LOGO_PATH } from "@/components/SiteLogo";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import "../src/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Digital Studio`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "A digital studio that delivers results",
  icons: {
    icon: SITE_LOGO_PATH,
    apple: SITE_LOGO_PATH,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: SITE_LOGO_PATH, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    images: [SITE_LOGO_PATH],
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
