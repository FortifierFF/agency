"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CosmicPageHeroShell } from "@/components/CosmicPageHeroShell";
import { CosmicRouteSectionShell } from "@/components/CosmicRouteSectionShell";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { projects } from "@/data/projects";

/**
 * About — team placeholders removed. Mid plate is “work in the wild” logos
 * so the page stays full without fake headshots.
 */
export default function AboutPage() {
  const t = useTranslations("about");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const values = [
    {
      title: t("value1.title"),
      description: t("value1.description"),
    },
    {
      title: t("value2.title"),
      description: t("value2.description"),
    },
    {
      title: t("value3.title"),
      description: t("value3.description"),
    },
    {
      title: t("value4.title"),
      description: t("value4.description"),
    },
  ];

  const stats = [
    { value: "2019", label: t("stats.founded") },
    { value: "50+", label: t("stats.projectsCompleted") },
    { value: "100%", label: t("stats.remoteTeam") },
    { value: "12", label: t("stats.countriesServed") },
  ];

  return (
    <>
      <section className="pt-28 pb-16 min-h-[92svh] flex items-center">
        <div className="container md:min-h-[640px] flex items-center">
          <CosmicPageHeroShell>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                  {tNav("about")}
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                  {t("title")}
                </h1>
                <p className="text-lg text-muted-foreground mb-8">{t("description")}</p>
                <Button asChild className="rounded-full px-6">
                  <Link href="/contact">
                    {t("workWithUs")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="aspect-[4/3] rounded-2xl bg-muted border border-border overflow-hidden">
                  <Image
                    src="/team.jpg"
                    alt="Team at work"
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                  />
                </div>
              </AnimatedSection>
            </div>
          </CosmicPageHeroShell>
        </div>
      </section>

      <CosmicRouteSectionShell anchorIndex={1}>
        <section className="section-padding">
          <div className="container">
            <AnimatedSection>
              <div className="max-w-2xl mb-12">
                <h2 className="text-3xl font-bold mb-4">{t("whatWeBelieve")}</h2>
                <p className="text-muted-foreground">{t("whatWeBelieveDescription")}</p>
              </div>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <AnimatedSection key={value.title} delay={index * 0.1}>
                  <div className="p-6 rounded-2xl bg-background border border-border">
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </CosmicRouteSectionShell>

      {/* Selected live work — fills the old team plate with real proof */}
      <CosmicRouteSectionShell anchorIndex={2}>
        <section className="section-padding">
          <div className="container">
            <AnimatedSection>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4">{t("selectedWork")}</h2>
                <p className="text-muted-foreground">{t("selectedWorkDescription")}</p>
              </div>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <AnimatedSection key={project.slug} delay={index * 0.08}>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 rounded-2xl border border-border/60 bg-background/25 p-6 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-background/40"
                  >
                    <div className="relative h-14 w-28 shrink-0">
                      <Image
                        src={`/projects/${project.slug}/logo.png`}
                        alt={project.preview.domain}
                        fill
                        className="object-contain"
                        sizes="112px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{project.preview.domain}</p>
                      <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-1">
                        {t("visitSite")}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </p>
                    </div>
                  </a>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.35}>
              <div className="mt-10 text-center">
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/projects">{tCommon("seeOurWork")}</Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={3}>
        <section className="section-padding">
          <div className="container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimatedSection key={stat.label} delay={index * 0.1}>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={4} tone="primary">
        <section className="section-padding">
          <div className="container text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold mb-4">{t("letsBuild")}</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                {t("letsBuildDescription")}
              </p>
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
                <Link href="/contact">{tCommon("getInTouch")}</Link>
              </Button>
            </AnimatedSection>
          </div>
        </section>
      </CosmicRouteSectionShell>
    </>
  );
}
