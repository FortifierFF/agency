"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { testimonials } from "@/data/testimonials";
import { Button } from "@/components/ui/button";

export function TestimonialsSection() {
  const t = useTranslations("home.testimonials");
  const tCommon = useTranslations("common");
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  /** Off-screen: skip infinite Framer loops (they still tick layout/style every frame). */
  const [inView, setInView] = useState(false);
  const [current, setCurrent] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.06, rootMargin: "80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const allowHeavyMotion = inView && !reduceMotion;
  // Magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  
  const metrics = [
    { value: "50+", label: t("metrics.projectsDelivered") },
    { value: "98%", label: t("metrics.clientSatisfaction") },
    { value: "4.9★", label: t("metrics.averageRating") },
    { value: "5+ yrs", label: t("metrics.experience") },
  ];

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    createParticles();
  };
  
  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    createParticles();
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Calculate distance from top right corner (pinned point)
    const topRightX = rect.right;
    const topRightY = rect.top;
    const distanceX = e.clientX - topRightX;
    const distanceY = e.clientY - topRightY;
    // Invert X so left side pops out (positive rotateY when mouse is on left)
    // Reduce sensitivity significantly
    x.set(-distanceX * 0.008);
    y.set(distanceY * 0.008);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              {t("label")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("title")}
            </h2>
          </div>
        </AnimatedSection>

        {/* Testimonial Carousel with enhanced effects */}
        <AnimatedSection>
          <div className="max-w-3xl mx-auto mb-16 perspective-1000 relative">
            {/* Animated gradient background */}
            {allowHeavyMotion ? (
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-20 blur-3xl"
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.3), transparent 50%)",
                    "radial-gradient(circle at 100% 100%, hsl(var(--primary) / 0.3), transparent 50%)",
                    "radial-gradient(circle at 0% 100%, hsl(var(--primary) / 0.3), transparent 50%)",
                    "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.3), transparent 50%)",
                  ],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl opacity-20 blur-3xl bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.25),transparent_55%)]"
              />
            )}

            <motion.div 
              ref={cardRef}
              className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/25 p-8 shadow-2xl backdrop-blur-md md:p-12"
              style={
                allowHeavyMotion
                  ? {
                      transformStyle: "preserve-3d",
                      transformOrigin: "top right",
                      rotateY: springX,
                      rotateX: springY,
                    }
                  : { transformStyle: "flat" as const }
              }
              onMouseMove={allowHeavyMotion ? handleMouseMove : undefined}
              onMouseLeave={allowHeavyMotion ? handleMouseLeave : undefined}
              whileHover={allowHeavyMotion ? { scale: 1.02 } : undefined}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {allowHeavyMotion ? (
                <AnimatePresence>
                  {particles.map((particle) => (
                    <motion.div
                      key={particle.id}
                      className="absolute w-2 h-2 rounded-full bg-primary"
                      initial={{
                        x: `${particle.x}%`,
                        y: `${particle.y}%`,
                        scale: 0,
                        opacity: 1,
                      }}
                      animate={{
                        y: `${particle.y - 100}%`,
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 2,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </AnimatePresence>
              ) : null}

              {allowHeavyMotion ? (
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: "linear-gradient(45deg, transparent, hsl(var(--primary) / 0.1), transparent)",
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-40 bg-[linear-gradient(45deg,transparent,hsl(var(--primary)/0.08),transparent)]"
                />
              )}
              
              <Quote className="h-10 w-10 text-primary/20 mb-6 relative z-10" />
              <div className="min-h-[160px] relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <p className="text-lg md:text-xl text-foreground mb-8">
                      "{testimonials[current].quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="h-12 w-12 rounded-full bg-muted overflow-hidden"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={testimonials[current].avatar}
                          alt={testimonials[current].author}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
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
                  aria-label={tCommon("previousTestimonial")}
                  className="h-10 w-10 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  aria-label={tCommon("nextTestimonial")}
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
                    aria-label={tCommon("goToTestimonial", { number: index + 1 })}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Metrics */}
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-border/60 bg-background/20 p-6 text-center backdrop-blur-lg"
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
