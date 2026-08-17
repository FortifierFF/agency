import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/siteMetadata";

type Props = { params: Promise<{ locale: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/about",
  });
}

export default function AboutLayout({ children }: Props) {
  return children;
}
