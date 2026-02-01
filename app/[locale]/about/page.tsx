import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const values = [
  {
    title: "Quality over quantity",
    description:
      "We take on fewer projects to give each one the attention it deserves. No assembly lines, no junior-only handoffs.",
  },
  {
    title: "Transparency first",
    description:
      "Clear communication, honest timelines, and no scope surprises. You'll always know where your project stands.",
  },
  {
    title: "Results-driven",
    description:
      "Beautiful design is just the start. We measure success by the outcomes we help you achieve.",
  },
  {
    title: "Partnership mindset",
    description:
      "We're not just vendors—we're invested in your success. Many of our clients have worked with us for years.",
  },
];

const team = [
  {
    name: "Alex Chen",
    role: "Founder & Lead Designer",
    bio: "10+ years in product design. Previously at Stripe and Airbnb.",
    image: "/placeholder.svg",
  },
  {
    name: "Jordan Smith",
    role: "Technical Lead",
    bio: "Full-stack developer with a focus on performance and accessibility.",
    image: "/placeholder.svg",
  },
  {
    name: "Sam Rivera",
    role: "UX Strategist",
    bio: "Research-driven designer who turns insights into intuitive experiences.",
    image: "/placeholder.svg",
  },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                About Us
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                A small team doing big things
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We're a remote-first digital studio of designers and developers 
                who believe great work comes from focus, craft, and genuine 
                partnership with our clients.
              </p>
              <Button asChild className="rounded-full px-6">
                <Link href="/contact">
                  Work With Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="aspect-[4/3] rounded-2xl bg-muted border border-border overflow-hidden">
                <Image
                  src="/team.jpg"
                  alt="Team at work"
                  className="w-full h-full object-cover"
                  width={800}
                  height={600}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card">
        <div className="container">
          <AnimatedSection>
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold mb-4">What we believe</h2>
              <p className="text-muted-foreground">
                These aren't just words on a wall—they're how we make decisions 
                every day.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-background border border-border">
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet the team</h2>
              <p className="text-muted-foreground">
                The people behind the pixels. Small team, big impact.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <AnimatedSection key={member.name} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      width={128}
                      height={128}
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "2019", label: "Founded" },
              { value: "50+", label: "Projects Completed" },
              { value: "100%", label: "Remote Team" },
              { value: "12", label: "Countries Served" },
            ].map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Let's build something together</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Ready to start your next project? We'd love to hear what you're working on.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
