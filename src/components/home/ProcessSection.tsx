import { AnimatedSection } from "@/components/AnimatedSection";
import { Search, PenTool, Code, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We dive deep into your business, users, and goals. Through research and strategy sessions, we define the problem worth solving.",
    icon: Search,
  },
  {
    number: "02",
    title: "Design",
    description:
      "Wireframes become prototypes. We iterate with your feedback until the design feels right—intuitive, beautiful, and on-brand.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Build",
    description:
      "Clean code, modern stack, and regular check-ins. We develop with quality and transparency, keeping you informed throughout.",
    icon: Code,
  },
  {
    number: "04",
    title: "Launch & Grow",
    description:
      "We deploy, test, and optimize. Post-launch, we measure what matters and help you iterate based on real user data.",
    icon: Rocket,
  },
];

export function ProcessSection() {
  return (
    <section className="section-padding bg-card">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              How We Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              A process built for clarity
            </h2>
            <p className="text-muted-foreground">
              No surprises, no scope creep. Just a proven process that 
              gets you from idea to launch efficiently.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <AnimatedSection key={step.number} delay={index * 0.15}>
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    {/* Number and icon */}
                    <div className="relative z-10 mb-6">
                      <div className="h-16 w-16 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center shadow-soft">
                        <step.icon className="h-7 w-7 text-primary" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
