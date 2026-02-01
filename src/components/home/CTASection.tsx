"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const t = useTranslations("home.cta");
  const tCommon = useTranslations("common");
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .cta-section,
        .cta-section *,
        .cta-section::before,
        .cta-section::after,
        .cta-section *::before,
        .cta-section *::after {
          border-style: none !important;
          border-width: 0 !important;
          border-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
        }
        /* Force new rendering layer to prevent artifacts */
        .cta-section {
          transform: translateZ(0);
          will-change: transform;
        }
      `}} />
      <section 
        className="cta-section section-padding bg-primary text-primary-foreground relative overflow-hidden"
      >
      <div className="container relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full px-8"
            >
              <Link href="/contact">
                {tCommon("startProject")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full px-8"
            >
              <Link href="/projects">{tCommon("seeOurWork")}</Link>
            </Button>
          </div>
        </div>
        </AnimatedSection>
      </div>
    </section>
    </>
  );
}
