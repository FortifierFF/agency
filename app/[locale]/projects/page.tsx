"use client";

import { useTranslations } from "next-intl";
import { CosmicPageHeroShell } from "@/components/CosmicPageHeroShell";
import { CosmicRouteSectionShell } from "@/components/CosmicRouteSectionShell";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  const t = useTranslations("projects");

  return (
    <>
      <section className="pt-28 pb-16 min-h-[92svh] flex items-center">
        <div className="container md:min-h-[640px] flex items-center">
          <CosmicPageHeroShell pad="sm">
            <AnimatedSection>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                {t("ourWork")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t("title")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t("description")}
              </p>
            </AnimatedSection>
          </CosmicPageHeroShell>
        </div>
      </section>

      <CosmicRouteSectionShell anchorIndex={1}>
        <section className="section-padding">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {projects.map((project, index) => (
                <AnimatedSection key={project.slug} delay={index * 0.05}>
                  <ProjectCard project={project} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </CosmicRouteSectionShell>
    </>
  );
}
