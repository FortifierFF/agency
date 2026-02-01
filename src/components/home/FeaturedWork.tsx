"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getFeaturedProjects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";

export function FeaturedWork() {
  const t = useTranslations("home.featuredWork");
  const projects = getFeaturedProjects();

  return (
    <section className="section-padding bg-card">
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
            </div>
            <Link
              href="/projects"
              className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
            >
              {t("viewAll")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <AnimatedSection key={project.slug} delay={index * 0.1}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block bg-background rounded-2xl border border-border overflow-hidden hover:shadow-soft transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Outcome badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      {project.resultsMetrics[0]?.label}: {project.resultsMetrics[0]?.value}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.shortSummary}
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
