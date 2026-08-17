"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SiteLogo } from "@/components/SiteLogo";

export function Footer() {
  const t = useTranslations();
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  const footerLinks = {
    navigation: [
      { label: tNav("home"), href: "/" },
      { label: tNav("projects"), href: "/projects" },
      { label: tNav("services"), href: "/services" },
      { label: tNav("about"), href: "/about" },
      { label: tNav("blog"), href: "/blog" },
      { label: tNav("contact"), href: "/contact" },
    ],
    services: [
      { label: tFooter("webDevelopment"), href: "/services#web-development" },
      { label: tFooter("uiUxDesign"), href: "/services#ui-ux-design" },
      { label: tFooter("seoPerformance"), href: "/services#seo-performance" },
      { label: tFooter("mobileApps"), href: "/services#mobile-apps" },
    ],
  };

  return (
    <footer className="border-t border-border bg-card" role="contentinfo">
      <div className="w-full max-w-none px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand — socials hidden until real profile URLs exist */}
          <div className="lg:col-span-1">
            <SiteLogo
              href="/"
              linkAriaLabel={t("common.apexStudioHome")}
              alt={t("common.brand")}
              variant="footer"
              wrapperClassName="h-[80px] w-[140px]"
              className="scale-[1.75]"
            />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {tFooter("description")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">{tFooter("navigation")}</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">{tFooter("services")}</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — no fake email; point people to the contact form */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{tFooter("contact")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {tFooter("contactFormCta")}
                </Link>
              </li>
              <li className="text-sm text-muted-foreground">
                {tFooter("basedRemotely")}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {tFooter("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {tFooter("privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {tFooter("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
