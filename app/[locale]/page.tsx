import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ClientLogosSection } from "@/components/home/ClientLogosSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { CosmicPageHeroShell } from "@/components/CosmicPageHeroShell";
import { CosmicRouteSectionShell } from "@/components/CosmicRouteSectionShell";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/siteMetadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/",
  });
}

/**
 * Home: hero + work + services + process + client logos + FAQ + CTA.
 */
export default function Home() {
  return (
    <>
      <section className="pt-28 pb-16 min-h-[92svh] flex items-center">
        <div className="container md:min-h-[640px] flex items-center">
          <CosmicPageHeroShell className="w-full">
            <HeroSection cosmicShell />
          </CosmicPageHeroShell>
        </div>
      </section>

      <CosmicRouteSectionShell anchorIndex={1}>
        <FeaturedWork />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={2}>
        <ServicesSection />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={3}>
        <ProcessSection />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={4}>
        <ClientLogosSection />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={5}>
        <FAQSection />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={6} tone="primary">
        <CTASection />
      </CosmicRouteSectionShell>
    </>
  );
}

