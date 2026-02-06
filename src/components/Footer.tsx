"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "GitHub", href: "#", icon: Github },
];

export function Footer() {
  const t = useTranslations();
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  
  const footerLinks = {
    navigation: [
      { label: tNav("projects"), href: "/projects" },
      { label: tNav("services"), href: "/services" },
      { label: tNav("pricing"), href: "/pricing" },
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
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              apex<span className="text-primary">.</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {tFooter("description")}
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
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

          {/* Services */}
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

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{tFooter("contact")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@apexstudio.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  hello@apexstudio.com
                </a>
              </li>
              <li className="text-sm text-muted-foreground">
                {tFooter("basedRemotely")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {tFooter("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              {tFooter("privacyPolicy")}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {tFooter("termsOfService")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
