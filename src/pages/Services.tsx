import { Link } from "react-router-dom";
import { Globe, Palette, TrendingUp, Smartphone, ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { services } from "@/data/services";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Palette,
  TrendingUp,
  Smartphone,
};

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                Services
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Everything you need to build and grow online
              </h1>
              <p className="text-lg text-muted-foreground">
                From strategy to launch and beyond. We offer focused services 
                that deliver measurable results for your business.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Detail */}
      <section className="pb-20">
        <div className="container">
          <div className="space-y-24">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon];
              const isEven = index % 2 === 0;

              return (
                <AnimatedSection key={service.id}>
                  <div
                    id={service.id}
                    className={`grid lg:grid-cols-2 gap-12 items-center ${
                      isEven ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div className={isEven ? "" : "lg:order-2"}>
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                      <p className="text-muted-foreground mb-8">
                        {service.description}
                      </p>
                      <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild className="rounded-full px-6">
                        <Link to="/contact">
                          Discuss Your Project
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className={isEven ? "lg:order-2" : ""}>
                      <div className="aspect-[4/3] rounded-2xl bg-muted border border-border overflow-hidden">
                        <img
                          src="/placeholder.svg"
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">
              Not sure which service you need?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Book a free consultation and we'll help you figure out the best 
              approach for your specific goals.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
              <Link to="/contact">Book a Free Call</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
