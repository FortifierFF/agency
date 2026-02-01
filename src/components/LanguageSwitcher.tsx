"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, getPathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, type Locale } from "@/i18n/routing";

const localeNames: Record<Locale, string> = {
  bg: "БГ",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const tCommon = useTranslations("common");
  // Get pathname without locale prefix from next-intl
  const pathnameWithoutLocale = usePathname();
  // Use next-intl router which handles locale-aware navigation
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    // Don't switch if already on the same locale
    if (newLocale === locale) {
      return;
    }

    // Save locale preference to localStorage
    localStorage.setItem("user-locale-preference", newLocale);
    
    // Construct the full path with the new locale using getPathname
    // This ensures we get the correct path like "/bg" or "/bg/about"
    const newPath = getPathname({ 
      locale: newLocale, 
      href: pathnameWithoutLocale 
    });
    
    // Use window.location for a full page reload to ensure
    // the new locale is properly loaded
    window.location.href = newPath;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{tCommon("switchLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={locale === loc ? "bg-secondary" : ""}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
