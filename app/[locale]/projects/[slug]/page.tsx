"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Building2, ExternalLink } from "lucide-react";
import { CosmicPageHeroShell } from "@/components/CosmicPageHeroShell";
import { CosmicRouteSectionShell } from "@/components/CosmicRouteSectionShell";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectPreview } from "@/components/projects/ProjectPreview";
import { getProjectBySlug, projects, type ProjectSlug } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Outcome = { label: string; value: string };

export default function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const { slug } = use(params);
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const tCase = useTranslations(`projects.cases.${project.slug}` as `projects.cases.${ProjectSlug}`);
  const outcomes = tCase.raw("outcomes") as Outcome[];
  const deliverables = tCase.raw("deliverables") as string[];

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const tNext = useTranslations(`projects.cases.${nextProject.slug}` as `projects.cases.${ProjectSlug}`);

  return (
    <>
      <section className="pt-28 pb-16 min-h-[92svh] flex items-center">
        <div className="container md:min-h-[640px] flex items-center">
          <CosmicPageHeroShell pad="sm" className="w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-start w-full">
              <div>
                <AnimatedSection>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                    {tCase("title")}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    {tCase("shortSummary")}
                  </p>
                  <div className="flex flex-wrap gap-6 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t("client")}:</span>
                      <span className="font-medium">{tCase("clientName")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t("timeline")}:</span>
                      <span className="font-medium">{tCase("timeline")}</span>
                    </div>
                  </div>
                  <Button asChild className="rounded-full">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      {t("visitLiveSite")}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </AnimatedSection>
              </div>

              <AnimatedSection delay={0.2}>
                <div>
                  <p className="text-sm font-medium text-primary mb-4 uppercase tracking-wide">
                    {t("outcomesTitle")}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {outcomes.map((metric) => (
                      <div
                        key={metric.label}
                        className="p-6 rounded-2xl bg-background/80 border border-border text-center"
                      >
                        <p className="text-xl sm:text-2xl font-bold text-primary mb-1">
                          {metric.value}
                        </p>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                      </div>
                    ))}
                  </div>
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
              <div className="overflow-hidden rounded-2xl border border-border">
                <ProjectPreview
                  project={project}
                  variant="poster"
                  className="aspect-[16/9]"
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={2}>
        <section className="section-padding">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              <AnimatedSection>
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t("challenge")}</h2>
                  <p className="text-muted-foreground">{tCase("challenge")}</p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t("approach")}</h2>
                  <p className="text-muted-foreground">{tCase("approach")}</p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={3}>
        <section className="section-padding">
          <div className="container">
            <AnimatedSection>
              <h2 className="text-2xl font-bold mb-8">{t("delivered")}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliverables.map((item, index) => (
                  <div
                    key={item}
                    className="p-4 rounded-xl bg-background border border-border"
                  >
                    <span className="text-sm text-primary font-medium mr-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={4}>
        <section className="section-padding">
          <div className="container">
            <AnimatedSection>
              <h2 className="text-2xl font-bold mb-8">{t("techStack")}</h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={5}>
        <section className="section-padding">
          <div className="container">
            <AnimatedSection>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("nextProject")}</p>
                  <h3 className="text-2xl font-bold">{tNext("title")}</h3>
                </div>
                <Button asChild className="rounded-full px-8">
                  <Link href={`/projects/${nextProject.slug}`}>
                    {t("viewProject")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={6} tone="primary">
        <section className="section-padding">
          <div className="container text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold mb-4">{t("readyToStart")}</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                {t("readyToStartDescription")}
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
