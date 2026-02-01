"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Check, X, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { packages } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const t = useTranslations("pricing");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                {tNav("pricing")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                {t("title")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("description")}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Packages */}
      <section className="pb-20">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <AnimatedSection key={pkg.id} delay={index * 0.1}>
                <div
                  className={`relative h-full flex flex-col p-6 rounded-2xl border ${
                    pkg.popular
                      ? "border-primary bg-card shadow-glow"
                      : "border-border bg-card"
                  }`}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-6">{t("mostPopular")}</Badge>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.timeline}</p>
                  </div>

                  <p className="text-2xl font-bold mb-4">{pkg.priceRange}</p>

                  <p className="text-sm text-muted-foreground mb-6">
                    {pkg.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-3">{t("whatsIncluded")}</p>
                    <ul className="space-y-2">
                      {pkg.included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-3">{t("bestFor")}</p>
                    <ul className="space-y-1">
                      {pkg.bestFor.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-3">{t("notFor")}</p>
                    <ul className="space-y-1">
                      {pkg.notFor.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <X className="h-4 w-4 shrink-0 mt-0.5 opacity-50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <Button
                      asChild
                      className="w-full rounded-full"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      <Link href="/contact">
                        {t("getStarted")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-card">
        <div className="container">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("faq")}</h2>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="max-w-3xl mx-auto grid gap-8">
              <div>
                <h3 className="font-semibold mb-2">
                  {t("faq1.question")}
                </h3>
                <p className="text-muted-foreground">
                  {t("faq1.answer")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {t("faq2.question")}
                </h3>
                <p className="text-muted-foreground">
                  {t("faq2.answer")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {t("faq3.question")}
                </h3>
                <p className="text-muted-foreground">
                  {t("faq3.answer")}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">{t("readyToGetStarted")}</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              {t("readyToGetStartedDescription")}
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
              <Link href="/contact">{tCommon("startYourProject")}</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
