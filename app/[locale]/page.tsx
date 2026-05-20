import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
// Pricing section temporarily hidden - uncomment to restore
// import { PackagesPreview } from "@/components/home/PackagesPreview";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { CosmicPageHeroShell } from "@/components/CosmicPageHeroShell";
import { CosmicRouteSectionShell } from "@/components/CosmicRouteSectionShell";
import { routing } from "@/i18n/routing";

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Home uses the **same** composition as `about/page.tsx`: one hero `<section>` + `CosmicPageHeroShell`,
 * then each block wrapped only by `CosmicRouteSectionShell` (no extra outer section/div shell).
 */
export default function Home() {
  return (
    <>
      {/* Hero — same outer layout classes as About */}
      <section className="pt-28 pb-16 min-h-[92svh] flex items-center">
        <div className="container md:min-h-[640px] flex items-center">
          <CosmicPageHeroShell className="w-full">
            <HeroSection cosmicShell />
          </CosmicPageHeroShell>
        </div>
      </section>

      <CosmicRouteSectionShell anchorIndex={1}>
        <FeaturedWork />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={2}>
        <ServicesSection />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={3}>
        <ProcessSection />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={4}>
        <TestimonialsSection />
      </CosmicRouteSectionShell>

      {/* Pricing section temporarily hidden - uncomment to restore */}
      {/* <PackagesPreview /> */}

      <CosmicRouteSectionShell anchorIndex={5}>
        <FAQSection />
      </CosmicRouteSectionShell>

      <CosmicRouteSectionShell anchorIndex={6} tone="primary">
        <CTASection />
      </CosmicRouteSectionShell>
    </>
  );
}
