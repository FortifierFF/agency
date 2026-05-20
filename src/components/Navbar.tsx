"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/SiteLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useCosmicExperienceOptional } from "@/context/CosmicExperienceContext";

/** Desktop nav choreography: logo from the left, links from the right one-by-one, utilities after a short beat. */
const logoVariants = {
  hidden: { x: -72, opacity: 0, filter: "blur(6px)" },
  show: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 220, damping: 30, mass: 0.95 },
  },
};

const linkParentVariants = {
  hidden: {},
  show: {
    // One-by-one link chips from the right; medium stagger so each lock-in reads clearly.
    transition: { staggerChildren: 0.094, delayChildren: 0.14 },
  },
};

const linkItemVariants = {
  hidden: { x: 64, opacity: 0, filter: "blur(5px)" },
  show: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 300, damping: 27, mass: 0.95 },
  },
};

const controlsParentVariants = {
  hidden: {},
  show: {
    // Language / CTA: same direction as links, but in a clearly delayed second wave.
    transition: { staggerChildren: 0.075, delayChildren: 0.64 },
  },
};

const controlItemVariants = {
  hidden: { x: 56, opacity: 0, filter: "blur(4px)" },
  show: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 285, damping: 25, mass: 0.96 },
  },
};

export function Navbar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const cosmic = useCosmicExperienceOptional();
  const landingPhase = cosmic?.landingPhase ?? "landed";
  const reduceMotion = useReducedMotion();

  /** Projects, Services, About, Blog, Contact — rainbow border hover lives only on these. */
  const navLinks = [
    { href: "/projects", label: t("projects") },
    { href: "/services", label: t("services") },
    // Pricing temporarily hidden - uncomment to restore
    // { href: "/pricing", label: t("pricing") },
    { href: "/about", label: t("about") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  // After the boot overlay, run the staged entrance. Reduced-motion users skip the wait.
  const revealNav = reduceMotion || landingPhase !== "loading";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass shadow-soft backdrop-blur-xl bg-background/45"
          : "bg-transparent"
      )}
    >
      <nav
        className="flex w-full max-w-none items-stretch justify-between gap-3 px-4 sm:px-6 lg:px-8"
        aria-label={tCommon("mainNavigation")}
      >
        {/* Group 1 — brand mark slides in from the left; self-stretch so logo frame matches nav row height */}
        <motion.div
          className="flex"
          initial="hidden"
          animate={revealNav ? "show" : "hidden"}
          variants={logoVariants}
        >
          <SiteLogo
            href="/"
            linkAriaLabel={tCommon("apexStudioHome")}
            alt={tCommon("brand")}
            variant="nav"
            priority
            wrapperClassName={cn(
              "w-[120px] transition-[height] duration-300 ease-in-out",
              isScrolled ? "h-[70px]" : "h-[80px]"
            )}
            className="scale-[1.25]"
          />
        </motion.div>

        {/* Group 2 — primary routes: each chip arrives from the right and locks flush in the row */}
        <motion.div
          className="hidden md:flex flex-1 items-center justify-center self-center"
          initial="hidden"
          animate={revealNav ? "show" : "hidden"}
          variants={linkParentVariants}
        >
          <div className="flex flex-row flex-wrap items-center justify-center gap-1">
            {navLinks.map((link) => (
              <motion.div key={link.href} variants={linkItemVariants} className="flex">
                <div className="nav-link-rainbow-ring rounded-[6px]">
                  <span className="nav-link-rainbow-spin rounded-[6px]" aria-hidden />
                  <Link
                    href={link.href}
                    className={cn(
                      "relative z-10 block rounded-[6px] px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors",
                      "bg-background/92 dark:bg-background/78",
                      pathname === link.href
                        ? "text-foreground ring-1 ring-white/12"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/8"
                    )}
                  >
                    {link.label}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Group 3 — locale, CTA: same direction as links but deliberately late (delayChildren) */}
        <motion.div
          className="hidden md:flex items-center gap-2 self-center"
          initial="hidden"
          animate={revealNav ? "show" : "hidden"}
          variants={controlsParentVariants}
        >
          <motion.div variants={controlItemVariants}>
            <LanguageSwitcher />
          </motion.div>
          <motion.div variants={controlItemVariants}>
            <Button asChild className="rounded-full px-6">
              <Link href="/contact">{tCommon("bookCall")}</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Mobile: compact controls + menu */}
        <motion.div
          className="flex md:hidden items-center gap-2 self-center"
          initial="hidden"
          animate={revealNav ? "show" : "hidden"}
          variants={controlsParentVariants}
        >
          <motion.div variants={controlItemVariants}>
            <LanguageSwitcher />
          </motion.div>
          <motion.div variants={controlItemVariants}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? tCommon("closeMenu") : tCommon("openMenu")}
              aria-expanded={isMobileMenuOpen}
              className="h-9 w-9"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </motion.div>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="flex w-full max-w-none flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="nav-link-rainbow-ring flex w-full rounded-[6px]"
                >
                  <span className="nav-link-rainbow-spin rounded-[6px]" aria-hidden />
                  <Link
                    href={link.href}
                    className={cn(
                      "relative z-10 block w-full rounded-[6px] px-4 py-3 text-sm font-medium transition-colors",
                      "bg-background/92 dark:bg-background/78",
                      pathname === link.href
                        ? "text-foreground ring-1 ring-white/12"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              <Button asChild className="mt-2 w-full rounded-full">
                <Link href="/contact">{tCommon("bookCall")}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
