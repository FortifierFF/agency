"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LineChart, Search, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import Image from "next/image";

export function HeroSection() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");

  const goalButtons = [
    { key: "getLeads", icon: Sparkles },
    { key: "improveUX", icon: LineChart },
    { key: "fixSEO", icon: Search },
    { key: "buildApp", icon: Smartphone },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Hero visual on the right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2/5 h-4/5 hidden lg:block pointer-events-none">
        <div className="relative w-full h-full">
          <Image 
            src="/hero-visual.jpg" 
            alt="" 
            className="object-cover opacity-60 rounded-l-3xl"
            fill
            sizes="40vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <AnimatedSection delay={0.1}>
            <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
              {t("subtitle")}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              {t("title")}{" "}
              <span className="gradient-text">{t("titleHighlight")}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
              {t("description")}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/projects">
                  {tCommon("viewWork")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/contact">{tCommon("getFreeAudit")}</Link>
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <div>
              <p className="text-sm text-muted-foreground mb-3">{tCommon("chooseGoal")}</p>
              <div className="flex flex-wrap gap-2">
                {goalButtons.map((goal) => (
                  <motion.button
                    key={goal.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
                  >
                    <goal.icon className="h-4 w-4 text-primary" />
                    {tCommon(goal.key)}
                  </motion.button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
