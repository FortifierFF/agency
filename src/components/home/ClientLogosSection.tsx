"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/AnimatedSection";
import { clientLogos } from "@/data/clientLogos";
import { cn } from "@/lib/utils";

/**
 * Card chrome (no transform here) — lift lives only on the outer `<a>`.
 * Matches PalRecruitment PAL Group tile proportions + darkened #3d617c fill.
 */
const tileSurfaceClass = cn(
  "overflow-hidden rounded-2xl border border-sky-200/20 bg-[#2f4559]",
  "shadow-[0_18px_50px_-28px_rgba(0,0,0,0.5)]"
);

export function ClientLogosSection() {
  const t = useTranslations("home.clientLogos");

  return (
    <section className="section-padding">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              {t("label")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
          </div>
        </AnimatedSection>

        {/* One entrance for the grid — avoid per-card motion.div (fights hover transform) */}
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {clientLogos.map((client) => {
              const scale = client.scale ?? 1;

              return (
                <a
                  key={client.id}
                  href={client.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={client.name}
                  title={client.name}
                  className={cn(
                    "block transition-transform duration-200 ease-out hover:-translate-y-0.5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  )}
                >
                  <div className={tileSurfaceClass}>
                    <div className="flex h-[190px] w-full items-center justify-center px-4 md:h-[245px] md:px-5">
                      <Image
                        src={client.logoSrc}
                        alt=""
                        width={420}
                        height={220}
                        unoptimized={client.logoSrc.endsWith(".svg")}
                        // Logo stays glued to the card — no own transform / transition
                        className={cn(
                          "pointer-events-none block h-auto w-full object-contain !transform-none",
                          client.imgClassName
                        )}
                        style={{
                          maxHeight: `min(${Math.round(112 * scale)}px, 100%)`,
                        }}
                        sizes="(max-width: 768px) 45vw, 280px"
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
