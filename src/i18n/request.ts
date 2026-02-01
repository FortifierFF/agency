import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Request configuration for next-intl
// This is called for every request and provides the locale and messages
export default getRequestConfig(async ({ requestLocale }) => {
  // Get the requested locale from the middleware
  const requested = await requestLocale;
  
  // Validate that the incoming locale is valid, otherwise use default
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
