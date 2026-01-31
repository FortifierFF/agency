"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { testimonials } from "@/data/testimonials";
import { Button } from "@/components/ui/button";

const metrics = [
  { value: "50+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "4.9★", label: "Average Rating" },
  { value: "5+ yrs", label: "Experience" },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              Proof
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              What our clients say
            </h2>
          </div>
        </AnimatedSection>

        {/* Testimonial Carousel */}
        <AnimatedSection>
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative bg-card rounded-2xl border border-border p-8 md:p-12">
              <Quote className="h-10 w-10 text-primary/20 mb-6" />
              <div className="min-h-[160px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg md:text-xl text-foreground mb-8">
                      "{testimonials[current].quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                        <img
                          src={testimonials[current].avatar}
                          alt={testimonials[current].author}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonials[current].author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonials[current].role}, {testimonials[current].company}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="absolute bottom-8 right-8 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="h-10 w-10 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  aria-label="Next testimonial"
                  className="h-10 w-10 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === current
                        ? "w-6 bg-primary"
                        : "w-2 bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Metrics */}
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
