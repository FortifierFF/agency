import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Building2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getProjectBySlug, projects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug || "");

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container">
          <AnimatedSection>
            <Link
              to="/projects"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
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
                  {project.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {project.shortSummary}
                </p>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-medium">{project.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Timeline:</span>
                    <span className="font-medium">{project.timeline}</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Results */}
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {project.resultsMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="p-6 rounded-2xl bg-card border border-border text-center"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                      {metric.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="pb-16">
        <div className="container">
          <AnimatedSection>
            <div className="aspect-[16/9] rounded-2xl bg-muted overflow-hidden border border-border">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Challenge & Approach */}
      <section className="pb-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div>
                <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
                <p className="text-muted-foreground">{project.challenge}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
                <p className="text-muted-foreground">{project.approach}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What We Delivered */}
      <section className="section-padding bg-card">
        <div className="container">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-8">What We Delivered</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.deliverables.map((item, index) => (
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

      {/* Gallery */}
      <section className="section-padding">
        <div className="container">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-8">Gallery</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {project.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] rounded-2xl bg-muted overflow-hidden border border-border"
                >
                  <img
                    src={image}
                    alt={`${project.title} gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="pb-16">
        <div className="container">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-8">Tech Stack</h2>
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

      {/* Next Project */}
      <section className="section-padding bg-card border-t border-border">
        <div className="container">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Next Project</p>
                <h3 className="text-2xl font-bold">{nextProject.title}</h3>
              </div>
              <Button asChild className="rounded-full px-8">
                <Link to={`/projects/${nextProject.slug}`}>
                  View Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Let's discuss how we can help you achieve similar results for your business.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default CaseStudy;
