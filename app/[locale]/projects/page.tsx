"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { CosmicPageHeroShell } from "@/components/CosmicPageHeroShell";
import { CosmicRouteSectionShell } from "@/components/CosmicRouteSectionShell";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects, getProjectsByTag, searchProjects } from "@/data/projects";
import { Input } from "@/components/ui/input";

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const tags = [
    { value: "All", label: t("filterAll") },
    { value: "Web", label: t("filterWeb") },
    { value: "UIUX", label: t("filterUIUX") },
    { value: "SEO", label: t("filterSEO") },
    { value: "Mobile", label: t("filterMobile") },
  ];

  const filteredProjects = useMemo(() => {
    let result = getProjectsByTag(activeTag);
    if (searchQuery.trim()) {
      result = searchProjects(searchQuery).filter((p) =>
        activeTag === "All" ? true : p.tags.includes(activeTag as "Web" | "UIUX" | "SEO" | "Mobile")
      );
    }
    return result;
  }, [activeTag, searchQuery]);

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
        <section className="pb-12">
          <div className="container">
            <AnimatedSection>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => setActiveTag(tag.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTag === tag.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        <section className="pb-20">
          <div className="container">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("noProjects")}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {filteredProjects.map((project, index) => (
                  <AnimatedSection key={project.slug} delay={index * 0.05}>
                    <ProjectCard project={project} />
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>
      </CosmicRouteSectionShell>
    </>
  );
}
