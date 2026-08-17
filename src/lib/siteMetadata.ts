import type { Metadata } from "next";
import { SITE_LOGO_PATH } from "@/components/SiteLogo";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

type BuildPageMetadataArgs = {
  locale: string;
  title: string;
  description: string;
  /** Path without locale prefix, e.g. `/about` or `/`. */
  path: string;
  /** Optional absolute or site-relative OG image. Defaults to logo. */
  image?: string;
  noIndex?: boolean;
};

/** Locale-aware title / description / canonical / Open Graph for every route. */
export function buildPageMetadata({
  locale,
  title,
  description,
  path,
  image,
  noIndex,
}: BuildPageMetadataArgs): Metadata {
  const normalizedPath = path === "/" ? "" : path.replace(/\/+$/, "");
  const canonical = `${SITE_URL}/${locale}${normalizedPath}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : `${SITE_URL}${SITE_LOGO_PATH}`;

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: { absolute: fullTitle },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        bg: `${SITE_URL}/bg${normalizedPath}`,
        en: `${SITE_URL}/en${normalizedPath}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "bg" ? "bg_BG" : "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [{ url: ogImage, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
