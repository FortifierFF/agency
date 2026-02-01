import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../src/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apex Studio - Digital Studio Showcase",
  description: "A digital studio that delivers results",
};

// Root layout - required by Next.js
// The locale-specific layout is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
