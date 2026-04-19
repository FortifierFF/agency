import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
// Pricing section temporarily hidden - uncomment to restore
// import { PackagesPreview } from "@/components/home/PackagesPreview";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { HomeSectionShell } from "@/components/home/HomeSectionShell";
import { HomeCosmicScrollBridge } from "@/components/home/HomeCosmicScrollBridge";
import { routing } from "@/i18n/routing";

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function Home() {
  return (
    <div className="relative">
      <HomeCosmicScrollBridge />
      <HomeSectionShell homeBgSection="hero">
        <HeroSection />
      </HomeSectionShell>
      <HomeSectionShell homeBgSection="work">
        <FeaturedWork />
      </HomeSectionShell>
      <HomeSectionShell homeBgSection="services">
        <ServicesSection />
      </HomeSectionShell>
      <HomeSectionShell homeBgSection="process">
        <ProcessSection />
      </HomeSectionShell>
      <HomeSectionShell homeBgSection="testimonials">
        <TestimonialsSection />
      </HomeSectionShell>
      {/* Pricing section temporarily hidden - uncomment to restore */}
      {/* <PackagesPreview /> */}
      <HomeSectionShell homeBgSection="faq">
        <FAQSection />
      </HomeSectionShell>
      <HomeSectionShell homeBgSection="cta">
        <CTASection />
      </HomeSectionShell>
    </div>
  );
}
