"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LineChart, Search, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useCosmicExperienceOptional } from "@/context/CosmicExperienceContext";

type HeroSectionProps = {
  /**
   * When true, hero is rendered **inside** `CosmicPageHeroShell` (same stack as About). Omit the
   * outer full-screen section and the duplicate inner glass card — the shell provides the plate.
   */
  cosmicShell?: boolean;
};

/** Hero is typography-forward; the fixed WebGL layer provides the space backdrop (no local fills). */
export function HeroSection({ cosmicShell = false }: HeroSectionProps) {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const cosmic = useCosmicExperienceOptional();
  const landingPhase = cosmic?.landingPhase ?? "landed";
  const contentDelayBase = landingPhase === "landed" ? 0.1 : 0.18;

  const goalButtons = [
    { key: "getLeads", icon: Sparkles, href: "/services#web-development" as const },
    { key: "improveUX", icon: LineChart, href: "/services#ui-ux-design" as const },
    { key: "fixSEO", icon: Search, href: "/services#seo-performance" as const },
    { key: "buildApp", icon: Smartphone, href: "/services#mobile-apps" as const },
  ];

  const inner = (
    <>
      <div className="relative z-10 mx-auto w-full max-w-4xl [transform:translateZ(0)]">
        <AnimatedSection delay={contentDelayBase}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-primary/95 sm:text-xs">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_14px_rgba(150,170,255,0.8)]" />
            {t("subtitle")}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={contentDelayBase + 0.1}>
          <h1 className="mb-6 max-w-5xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.2rem]">
            {t("title")}{" "}
            <span className="gradient-text drop-shadow-[0_0_22px_rgba(170,180,255,0.24)]">{t("titleHighlight")}</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={contentDelayBase + 0.2}>
          <p className="mb-9 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {t("description")}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={contentDelayBase + 0.3}>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8 shadow-[0_0_24px_rgba(120,150,255,0.14)]">
              <Link href="/projects">
                {tCommon("viewWork")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/14 bg-white/5 px-8 text-foreground hover:bg-white/10">
              <Link href="/contact">{tCommon("getFreeAudit")}</Link>
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={contentDelayBase + 0.42}>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">{tCommon("chooseGoal")}</p>
            <div className="flex flex-wrap gap-2.5">
              {goalButtons.map((goal) => (
                <motion.div
                  key={goal.key}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <Link
                    href={goal.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-white/14"
                  >
                    <goal.icon className="h-4 w-4 text-primary" />
                    {tCommon(goal.key)}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.55 }}
        className={cosmicShell ? "pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2" : "absolute bottom-8 left-1/2 -translate-x-1/2"}
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-2"
        >
          <div className="h-2 w-1 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </>
  );

  if (cosmicShell) {
    return <div className="relative w-full">{inner}</div>;
  }

  return (
    <section className="relative flex min-h-screen items-center overflow-x-hidden overflow-y-visible pt-24 pb-10 sm:pt-28">
      <div className="container relative z-10">
        <div className="relative max-w-[72rem]">
          <div className="pointer-events-none absolute inset-x-[8%] top-10 h-40 rounded-full bg-white/6 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 top-12 h-24 w-24 rounded-full border border-white/10 opacity-40" />
          <div className="pointer-events-none absolute right-[10%] top-0 h-px w-32 bg-gradient-to-r from-transparent via-white/35 to-transparent" />

          <div className="relative z-10 overflow-hidden rounded-[2rem] border border-white/12 px-6 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.45),0_0_90px_rgba(120,140,220,0.08)] sm:px-8 sm:py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_20%,rgba(5,8,16,0.28)_100%)] backdrop-blur-md"
              style={{ zIndex: 0 }}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] rounded-[2rem] ring-1 ring-inset ring-white/10" />
            <div className="pointer-events-none absolute left-5 top-5 h-10 w-10 rounded-tl-2xl border-l border-t border-white/20" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 rounded-br-2xl border-b border-r border-primary/25" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {inner}
          </div>
        </div>
      </div>
    </section>
  );
}
