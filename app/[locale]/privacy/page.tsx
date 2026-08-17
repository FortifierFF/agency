"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CosmicPageHeroShell } from "@/components/CosmicPageHeroShell";
import { CosmicRouteSectionShell } from "@/components/CosmicRouteSectionShell";
import { AnimatedSection } from "@/components/AnimatedSection";

/** Privacy policy body — cosmic plate layout matches other content routes. */
export default function PrivacyPage() {
  const t = useTranslations("legal.privacy");

  const sections = [
    "intro",
    "collect",
    "use",
    "share",
    "cookies",
    "rights",
    "contact",
  ] as const;

  return (
    <>
      <section className="pt-28 pb-16 min-h-[70svh] flex items-center">
        <div className="container max-w-3xl md:min-h-[420px] flex items-center">
          <CosmicPageHeroShell pad="sm">
            <AnimatedSection>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                {t("label")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t("title")}
              </h1>
              <p className="text-muted-foreground">{t("updated")}</p>
            </AnimatedSection>
          </CosmicPageHeroShell>
        </div>
      </section>

      <CosmicRouteSectionShell anchorIndex={1}>
        <article className="pb-20">
          <div className="container max-w-3xl space-y-10 py-8 md:py-12">
            {sections.map((key, index) => (
              <AnimatedSection key={key} delay={index * 0.04}>
                <h2 className="text-xl font-semibold mb-3">{t(`${key}.title`)}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {t(`${key}.body`)}
                </p>
              </AnimatedSection>
            ))}

            <AnimatedSection>
              <p className="text-sm text-muted-foreground">
                {t("seeAlso")}{" "}
                <Link href="/terms" className="text-primary hover:underline underline-offset-4">
                  {t("termsLink")}
                </Link>
                .
              </p>
            </AnimatedSection>
          </div>
        </article>
      </CosmicRouteSectionShell>
    </>
  );
}
