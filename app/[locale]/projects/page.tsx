"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { projects, getProjectsByTag, searchProjects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const tags = ["All", "Web", "UIUX", "SEO", "Mobile"];

export default function ProjectsPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    let result = getProjectsByTag(activeTag);
    if (searchQuery.trim()) {
      result = searchProjects(searchQuery).filter((p) =>
        activeTag === "All" ? true : p.tags.includes(activeTag as any)
      );
    }
    return result;
  }, [activeTag, searchQuery]);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container">
          <AnimatedSection>
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              Our Work
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Projects that delivered results
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              From startups to established brands, here's a selection of the 
              digital products we've designed and built.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="container">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTag === tag
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <AnimatedSection key={project.slug} delay={index * 0.05}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-soft transition-all duration-300"
                  >
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
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
          )}
        </div>
      </section>
    </Layout>
  );
}
