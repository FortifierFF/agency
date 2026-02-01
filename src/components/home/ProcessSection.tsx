"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Search, PenTool, Code, Rocket } from "lucide-react";

export function ProcessSection() {
  const t = useTranslations("home.process");
  
  const steps = [
    {
      number: t("step1.number"),
      title: t("step1.title"),
      description: t("step1.description"),
      icon: Search,
    },
    {
      number: t("step2.number"),
      title: t("step2.title"),
      description: t("step2.description"),
      icon: PenTool,
    },
    {
      number: t("step3.number"),
      title: t("step3.title"),
      description: t("step3.description"),
      icon: Code,
    },
    {
      number: t("step4.number"),
      title: t("step4.title"),
      description: t("step4.description"),
      icon: Rocket,
    },
  ];
  return (
    <section className="section-padding bg-card">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              {t("label")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {t("title")}
            </h2>
            <p className="text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          {/* Animated connecting timeline - positioned below step titles */}
          <div className="hidden lg:block absolute top-[120px] left-0 right-0 h-0.5 bg-border">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {steps.map((step, index) => (
              <AnimatedSection key={step.number} delay={index * 0.15}>
                <div className="relative">
                  {/* Card wrapper for mobile only */}
                  <div className="sm:bg-transparent bg-card border border-border rounded-2xl p-6 sm:p-0 sm:border-0">
                    <div className="flex flex-col items-center text-center">
                      {/* Number and icon */}
                      <div className="relative z-10 mb-4 sm:mb-6">
                        <motion.div 
                          className="h-16 w-16 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center shadow-soft"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <step.icon className="h-7 w-7 text-primary" />
                        </motion.div>
                        <motion.span 
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          {step.number}
                        </motion.span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 sm:mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
