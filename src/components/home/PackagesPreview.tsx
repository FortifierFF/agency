"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { packages } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PackagesPreview() {
  const t = useTranslations("home.packages");
  const tCommon = useTranslations("common");
  const tPricing = useTranslations("pricing");
  const previewPackages = packages.slice(0, 3);

  return (
    <section className="section-padding bg-card">
      <div className="container">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                {t("label")}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {t("title")}
              </h2>
            </div>
            <Link
              href="/pricing"
              className="text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {previewPackages.map((pkg, index) => (
            <AnimatedSection key={pkg.id} delay={index * 0.1}>
              <div
                className={`relative p-6 rounded-2xl border h-full flex flex-col ${
                  pkg.popular
                    ? "border-primary bg-background shadow-glow"
                    : "border-border bg-background"
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-6">{tPricing("mostPopular")}</Badge>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-1">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.timeline}</p>
                </div>
                <p className="text-2xl font-bold mb-4">{pkg.priceRange}</p>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {pkg.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {pkg.included.slice(0, 4).map((item) => (
                    <li key={item} className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={pkg.popular ? "default" : "outline"} className="rounded-full">
                  <Link href="/pricing">{tCommon("learnMore")}</Link>
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
