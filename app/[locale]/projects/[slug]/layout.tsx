import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/siteMetadata";
import { getProjectBySlug, isProjectSlug } from "@/data/projects";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "meta.project" });
  const project = isProjectSlug(slug) ? getProjectBySlug(slug) : undefined;
  const name = project?.preview.domain ?? slug;
  const image = project?.preview.poster?.split("?")[0];

  return buildPageMetadata({
    locale,
    title: t("title", { name }),
    description: t("description", { name }),
    path: `/projects/${slug}`,
    image,
  });
}

export default function ProjectSlugLayout({ children }: Props) {
  return children;
}
