"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Search, PenTool, Code, Rocket } from "lucide-react";

/**
 * How-we-work: no ScrollTrigger pin here.
 *
 * Pinning added artificial scroll height (pinSpacing) so a scrubbed timeline could run.
 * That read as “empty” space and often flickered when the pin released. This layout is
 * natural document height only — motion is optional in-view fades, not scroll hijacking.
 */
export function ProcessSection() {
  const t = useTranslations("home.process");

  const steps = [
    {
      number: t("step1.number"),
      title: t("step1.title"),
      description: t("step1.description"),
      icon: Search,
    },
    {
      number: t("step2.number"),
      title: t("step2.title"),
      description: t("step2.description"),
      icon: PenTool,
    },
    {
      number: t("step3.number"),
      title: t("step3.title"),
      description: t("step3.description"),
      icon: Code,
    },
    {
      number: t("step4.number"),
      title: t("step4.title"),
      description: t("step4.description"),
      icon: Rocket,
    },
  ];

  return (
    <section className="relative py-14 md:py-16 lg:py-20">
      <div className="container relative z-10">
        <AnimatedSection>
          <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t("label")}
            </p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("description")}
            </p>
          </div>
        </AnimatedSection>

        {/* Natural flow: section height = content only (no pinSpacing). */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} delay={index * 0.08}>
              <div className="comet-border-ring group relative flex h-full flex-col rounded-2xl">
                <span className="comet-border-spin rounded-2xl" aria-hidden />
                <div className="relative z-10 flex h-full flex-col rounded-[14px] border border-border/60 bg-background/25 p-6 shadow-sm backdrop-blur-md transition-shadow duration-300 group-hover:shadow-md">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-2xl font-bold tabular-nums text-foreground/15">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
