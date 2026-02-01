import { defineRouting } from "next-intl/routing";

// Define routing configuration for next-intl
// This tells next-intl how to handle locale-based routing
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["bg", "en"],
  
  // Used when no locale matches
  defaultLocale: "bg",
  
  // Always show locale prefix in URL
  localePrefix: "always",
});

// Export locales and Locale type for convenience
export const locales = routing.locales;
export type Locale = (typeof locales)[number];
export const defaultLocale = routing.defaultLocale;
