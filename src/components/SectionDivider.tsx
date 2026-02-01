"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "wave" | "geometric";
  className?: string;
}

export function SectionDivider({ variant = "wave", className = "" }: SectionDividerProps) {
  if (variant === "geometric") {
    return (
      <div className={`relative h-16 overflow-hidden ${className}`}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="hsl(var(--card))"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>
    );
  }

  // Wave variant
  return (
    <div className={`relative h-20 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
          fill="hsl(var(--card))"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
