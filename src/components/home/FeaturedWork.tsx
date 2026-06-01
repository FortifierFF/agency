"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getFeaturedProjects } from "@/data/projects";

export function FeaturedWork() {
  const t = useTranslations("home.featuredWork");
  const projects = getFeaturedProjects();

  return (
    <section className="section-padding">
      <div className="container">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                {t("label")}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {t("title")}
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">{t("subtitle")}</p>
            </div>
            <Link
              href="/projects"
              className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1 shrink-0"
            >
              {t("viewAll")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <AnimatedSection key={project.slug} delay={index * 0.08}>
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
