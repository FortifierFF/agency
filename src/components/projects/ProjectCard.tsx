"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "@/components/projects/ProjectPreview";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const t = useTranslations("projects");
  const tCase = useTranslations(`projects.cases.${project.slug}`);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300",
        "hover:border-primary/30 hover:shadow-soft",
        className
      )}
    >
      <div className="relative overflow-hidden bg-slate-950">
        <ProjectPreview project={project} variant="poster" />

        <div className="absolute top-4 left-4 z-20">
          <Badge className="border-0 bg-primary/90 text-primary-foreground shadow-md backdrop-blur-sm">
            {tCase("highlight")}
          </Badge>
        </div>

        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-full",
            "bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur-sm",
            "opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0",
            "focus-visible:opacity-100 focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {t("visitLiveSite")}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="flex flex-1 flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-b-2xl"
      >
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-start justify-between gap-2">
          <span>{tCase("title")}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 text-primary" />
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {tCase("shortSummary")}
        </p>
        <p className="mt-4 text-xs font-medium text-primary/90">{t("readCaseStudy")}</p>
      </Link>
    </article>
  );
}
