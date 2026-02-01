"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale, locales } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

// Custom localStorage key for user's locale preference
const LOCALE_STORAGE_KEY = "user-locale-preference";

// Root page that redirects to the appropriate locale
// Checks localStorage for saved locale preference, otherwise uses default
export default function RootPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage for saved locale preference
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    
    // Validate that the saved locale is one of our supported locales
    const locale = savedLocale && locales.includes(savedLocale)
      ? savedLocale
      : defaultLocale;
    
    // Redirect to the locale-prefixed path
    router.replace(`/${locale}`);
  }, [router]);

  // Show nothing while redirecting (prevents flash of content)
  // Only render after mount to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return null;
}
