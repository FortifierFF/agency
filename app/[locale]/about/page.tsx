"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
  const t = useTranslations("about");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  
  const values = [
    {
      title: t("value1.title"),
      description: t("value1.description"),
    },
    {
      title: t("value2.title"),
      description: t("value2.description"),
    },
    {
      title: t("value3.title"),
      description: t("value3.description"),
    },
    {
      title: t("value4.title"),
      description: t("value4.description"),
    },
  ];
  
  const stats = [
    { value: "2019", label: t("stats.founded") },
    { value: "50+", label: t("stats.projectsCompleted") },
    { value: "100%", label: t("stats.remoteTeam") },
    { value: "12", label: t("stats.countriesServed") },
  ];
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                {tNav("about")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                {t("title")}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {t("description")}
              </p>
              <Button asChild className="rounded-full px-6">
                <Link href="/contact">
                  {t("workWithUs")}
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
              <h2 className="text-3xl font-bold mb-4">{t("whatWeBelieve")}</h2>
              <p className="text-muted-foreground">
                {t("whatWeBelieveDescription")}
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
              <h2 className="text-3xl font-bold mb-4">{t("meetTeam")}</h2>
              <p className="text-muted-foreground">
                {t("meetTeamDescription")}
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
            {stats.map((stat, index) => (
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
            <h2 className="text-3xl font-bold mb-4">{t("letsBuild")}</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              {t("letsBuildDescription")}
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
              <Link href="/contact">{tCommon("getInTouch")}</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
