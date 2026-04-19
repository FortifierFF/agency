"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { AnimatedSection } from "@/components/AnimatedSection";
import { faqs } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const t = useTranslations("home.faq");
  const tFaqs = useTranslations("faqs");
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              {t("label")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("title")}
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="overflow-hidden rounded-xl border border-border/60 px-6 transition-all duration-300 group data-[state=open]:border-primary/30 data-[state=open]:bg-background/30 data-[state=open]:backdrop-blur-md"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-5 group-hover:text-primary transition-colors">
                    <span className="flex items-center gap-3">
                      <span className="text-primary/60 group-data-[state=open]:text-primary transition-colors">
                        Q{faq.id}
                      </span>
                      {tFaqs(`faq${faq.id}.question`)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      {faq.id === "8" ? (() => {
                        const answer = tFaqs(`faq${faq.id}.answer`);
                        // Check for Bulgarian text
                        if (answer.includes("разгледайте нашата статия")) {
                          const parts = answer.split("разгледайте нашата статия");
                          return (
                            <div>
                              {parts[0]}
                              <Link 
                                href="/blog/kolko-struva-izrabotka-sait-2026" 
                                className="text-primary hover:underline font-medium"
                              >
                                разгледайте нашата статия за ценообразуването
                              </Link>
                              {parts[1] || "."}
                            </div>
                          );
                        }
                        // Check for English text
                        if (answer.includes("check out our pricing article")) {
                          const parts = answer.split("check out our pricing article");
                          return (
                            <div>
                              {parts[0]}
                              <Link 
                                href="/blog/kolko-struva-izrabotka-sait-2026" 
                                className="text-primary hover:underline font-medium"
                              >
                                check out our pricing article
                              </Link>
                              {parts[1] || "."}
                            </div>
                          );
                        }
                        return answer;
                      })() : (
                        tFaqs(`faq${faq.id}.answer`)
                      )}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
