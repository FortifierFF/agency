import Link from "next/link";
import { ArrowRight, Globe, Palette, TrendingUp, Smartphone } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { services } from "@/data/services";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Palette,
  TrendingUp,
  Smartphone,
};

export function ServicesSection() {
  return (
    <section className="section-padding">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              What We Do
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Full-service digital studio
            </h2>
            <p className="text-muted-foreground">
              We handle everything from strategy to launch. Pick what you need, 
              or let us build the complete solution.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <AnimatedSection key={service.id} delay={index * 0.1}>
                <div className="group p-6 rounded-2xl border border-border bg-card hover:shadow-soft hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {service.deliverables.slice(0, 4).map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services#${service.id}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
