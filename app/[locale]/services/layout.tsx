import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/siteMetadata";

type Props = { params: Promise<{ locale: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.services" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/services",
  });
}

export default function ServicesLayout({ children }: Props) {
  return children;
}
