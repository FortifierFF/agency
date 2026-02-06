"use client";

import { useTranslations } from "next-intl";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const t = useTranslations("blog.pricingPost");
  const tBlog = useTranslations("blog");
  const tCommon = useTranslations("common");
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-12">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {tBlog("backToBlog")}
            </Link>
          </AnimatedSection>

          <AnimatedSection>
            <div className="mb-8">
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                {tBlog("blogLabel")}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-20">
        <div className="container max-w-4xl">
          {/* Introduction */}
          <AnimatedSection>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("intro1")}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("intro2")}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("intro3")}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                {t("intro4")}
              </p>
              <p className="text-lg font-medium text-foreground leading-relaxed">
                {t("intro5")}
              </p>
            </div>
          </AnimatedSection>

          {/* Main Section: How is the price formed */}
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight mt-16 mb-6">
              {t("howPriceFormedTitle")}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t("howPriceFormedText")}
              </p>
            </div>
          </AnimatedSection>

          {/* Section 1: One-time development investment */}
          <AnimatedSection>
            <div className="mt-12 p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-2xl font-bold mb-4">{t("oneTimeInvestmentTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t("oneTimeInvestmentText")}
              </p>
              
              <div className="space-y-6 mt-8">
                <div>
                  <h4 className="text-xl font-semibold mb-3">{t("uiUxTitle")}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("uiUxText")}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-3">{t("technicalTitle")}</h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t("technicalText")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("technicalImportant")}
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong>{t("cmsSites")}</strong>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong>{t("customSites")}</strong>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Section 2: Hosting and Domain */}
          <AnimatedSection>
            <div className="mt-8 p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-2xl font-bold mb-4">{t("hostingDomainTitle")}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-3">{t("whatIsHosting")}</h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t("hostingText")}
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <ul className="space-y-2">
                      <li className="text-muted-foreground">
                        <strong className="text-foreground">{t("smallSites")}</strong> {t("smallSitesPrice")}
                      </li>
                      <li className="text-muted-foreground">
                        <strong className="text-foreground">{t("largeSites")}</strong> {t("largeSitesPrice")}
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-3">{t("whatIsDomain")}</h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t("domainText")}
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-3 text-foreground">{t("domainPrices")}</p>
                    <ul className="space-y-2">
                      <li className="text-muted-foreground">
                        <strong className="text-foreground">.eu</strong> – около 10 €
                      </li>
                      <li className="text-muted-foreground">
                        <strong className="text-foreground">.com</strong> – около 20 €
                      </li>
                      <li className="text-muted-foreground">
                        <strong className="text-foreground">.bg</strong> – около 30 €
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Section: Main factors affecting price */}
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight mt-16 mb-6">
              {t("factorsTitle")}
            </h2>
          </AnimatedSection>

          {/* Website Types */}
          <AnimatedSection>
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">{t("websiteTypeTitle")}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="text-lg font-semibold mb-2">{t("blogType")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("blogTypeDesc")}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="text-lg font-semibold mb-2">{t("portfolioType")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("portfolioTypeDesc")}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="text-lg font-semibold mb-2">{t("corporateType")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("corporateTypeDesc")}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="text-lg font-semibold mb-2">{t("ecommerceType")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("ecommerceTypeDesc")}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="text-lg font-semibold mb-2">{t("newsType")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("newsTypeDesc")}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h4 className="text-lg font-semibold mb-2">{t("customType")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("customTypeDesc")}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Design: Template vs Custom */}
          <AnimatedSection>
            <div className="mt-12 p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-2xl font-bold mb-4">{t("designTitle")}</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 rounded-xl bg-background border border-border">
                  <h4 className="text-lg font-semibold mb-3">{t("templateTitle")}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("templateText")}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-background border border-border">
                  <h4 className="text-lg font-semibold mb-3">{t("customDesignTitle")}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("customDesignText")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 italic">
                    {t("designNote")}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Functionalities */}
          <AnimatedSection>
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">{t("functionalitiesTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t("functionalitiesText")}
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  t("onlineBookings"),
                  t("userProfiles"),
                  t("customForms"),
                  t("payments"),
                  t("multilingual"),
                  t("calendars"),
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                {t("functionalitiesNote")}
              </p>
            </div>
          </AnimatedSection>

          {/* Timeline impact */}
          <AnimatedSection>
            <div className="mt-12 p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-2xl font-bold mb-4">{t("timelineTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("timelineText")}
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{t("timeline1")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{t("timeline2")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{t("timeline3")}</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>

          {/* Additional costs */}
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight mt-16 mb-6">
              {t("additionalCostsTitle")}
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <div className="mt-8 space-y-8">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-xl font-semibold mb-3">{t("contentTitle")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("contentText")}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-xl font-semibold mb-3">{t("seoTitle")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("seoText")}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-xl font-semibold mb-3">{t("maintenanceTitle")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("maintenanceText")}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-xl font-semibold mb-3">{t("multilingualTitle")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("multilingualText")}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Agency vs Freelancer */}
          <AnimatedSection>
            <div className="mt-12 p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-2xl font-bold mb-4">{t("agencyTitle")}</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 rounded-xl bg-background border border-border">
                  <h4 className="text-lg font-semibold mb-3">{t("freelancerTitle")}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("freelancerText")}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-background border border-border">
                  <h4 className="text-lg font-semibold mb-3">{t("agencyName")}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("agencyText")}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Why website is an investment */}
          <AnimatedSection>
            <div className="mt-16 p-10 rounded-2xl bg-primary text-primary-foreground">
              <h2 className="text-3xl font-bold mb-6">{t("investmentTitle")}</h2>
              <p className="text-primary-foreground/90 leading-relaxed mb-6">
                {t("investmentText")}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  t("investment1"),
                  t("investment2"),
                  t("investment3"),
                  t("investment4"),
                  t("investment5"),
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <p className="text-primary-foreground/90 text-lg font-medium">
                {t("investmentConclusion")}
              </p>
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">{t("ctaTitle")}</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("ctaText")}
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/contact">
                  {t("ctaButton")}
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </article>
    </Layout>
  );
}
