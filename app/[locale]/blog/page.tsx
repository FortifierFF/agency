"use client";

import { useTranslations } from "next-intl";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const t = useTranslations("blog");
  
  // Blog posts data - using translations
  const blogPosts = [
    {
      slug: "kolko-struva-izrabotka-sait-2026",
      title: t("posts.kolko-struva-izrabotka-sait-2026.title"),
      excerpt: t("posts.kolko-struva-izrabotka-sait-2026.excerpt"),
      date: "2026",
      category: t("posts.kolko-struva-izrabotka-sait-2026.category"),
      readTime: t("posts.kolko-struva-izrabotka-sait-2026.readTime"),
    },
  ];
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                {t("heroLabel")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                {t("heroTitle")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("heroDescription")}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pb-20">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <AnimatedSection key={post.slug} delay={index * 0.1}>
                <article className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <Button asChild variant="ghost" className="rounded-full">
                    <Link href={`/blog/${post.slug}`}>
                      {t("readMore")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </article>
              </AnimatedSection>
            ))}
          </div>

          {/* Empty state message for future posts */}
          {blogPosts.length === 0 && (
            <AnimatedSection>
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {t("emptyState")}
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </Layout>
  );
}
