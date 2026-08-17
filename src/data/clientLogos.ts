/**
 * Homepage client logo strip — independent from case-study `projects` data
 * so we can show live clients before a full project page exists.
 */
export type ClientLogo = {
  id: string;
  name: string;
  /** Path under /public */
  logoSrc: string;
  /** Live site opened when the logo is clicked */
  href: string;
  /**
   * Visual scale vs the shared logo frame (1 = default).
   * Square/tall marks need >1 so they match wide wordmark weight.
   */
  scale?: number;
  /**
   * Optional Tailwind classes on the image (e.g. brightness for dark marks).
   */
  imgClassName?: string;
  /**
   * Optional production URL to switch to later (e.g. after DNS cutover).
   * BAPZG: swap `href` → this when https://nursing-bg.com is live.
   */
  plannedHref?: string;
};

export const clientLogos: ClientLogo[] = [
  {
    id: "medboard",
    name: "MedBoard",
    logoSrc: "/projects/medboard/logo.svg",
    href: "https://medboard.bg",
    // Very wide wordmark — keep near baseline so it doesn’t dominate
    scale: 0.95,
  },
  {
    id: "pal-recruitment",
    name: "PAL Recruitment",
    // Vector mark — old logo-transp.png was 135×80 and looked soft when scaled
    logoSrc: "/projects/pal-recruitment/logo.svg",
    href: "https://palrecruitment.com",
    scale: 1.05,
  },
  {
    id: "pal-credit-consult",
    name: "PAL Credit Consult",
    logoSrc: "/projects/pal-credit-consult/pal-credit-consult-logo.webp",
    href: "https://palcreditconsult.com",
    scale: 1.05,
    // Dark navy mark on dark UI — lift so it reads like the white PAL logo
    imgClassName: "brightness-150 contrast-125",
  },
  {
    id: "pitchfork-games",
    name: "Pitchfork Games",
    logoSrc: "/projects/pitchfork-games/pitchfork-logo-transparent.png",
    href: "https://pitchforkgames.com",
    scale: 1.1,
  },
  {
    id: "dkotova",
    name: "D. Kotova",
    logoSrc: "/projects/dkotova/logo-2.png",
    href: "https://dkotova.com",
    scale: 1.35,
  },
  {
    id: "bolnica-pernik",
    name: "МБАЛ Рахила Ангелова",
    // Trimmed white-text rebuild (no empty padding around the disc)
    logoSrc: "/projects/bolnica-pernik/pernik-logo-white-v5.webp",
    href: "https://bolnicapernik.com",
    scale: 1.55,
  },
  {
    id: "bapzg",
    name: "BAPZG",
    logoSrc: "/projects/bapzg/bapzg-logo-trim.webp",
    // Temporary Railway preview; replace with plannedHref after nursing-bg.com deploy
    href: "https://bapzgfrontend-production.up.railway.app",
    plannedHref: "https://nursing-bg.com",
    scale: 1.4,
  },
];
