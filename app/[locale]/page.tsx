import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PackagesPreview } from "@/components/home/PackagesPreview";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { routing } from "@/i18n/routing";

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeaturedWork />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <PackagesPreview />
      <FAQSection />
      <CTASection />
    </Layout>
  );
}
