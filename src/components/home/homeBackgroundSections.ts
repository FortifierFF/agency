/**
 * Section ids on `HomeSectionShell` (`data-home-bg-section`) for scroll layout reads (`readHomeSectionLayouts`).
 * Order is the narrative order down the home page — keep in sync with `page.tsx`.
 */
export const HOME_BG_SECTION_ORDER = [
  "hero",
  "work",
  "services",
  "process",
  "testimonials",
  "faq",
  "cta",
] as const;

export type HomeBgSectionId = (typeof HOME_BG_SECTION_ORDER)[number];

export function isHomeBgSectionId(value: string): value is HomeBgSectionId {
  return (HOME_BG_SECTION_ORDER as readonly string[]).includes(value);
}

export type SectionLayout = { id: HomeBgSectionId; top: number; height: number };

/** Reads each marked section’s document position. Missing nodes are skipped until they paint. */
export function readHomeSectionLayouts(): SectionLayout[] {
  if (typeof document === "undefined") return [];
  const out: SectionLayout[] = [];
  for (const id of HOME_BG_SECTION_ORDER) {
    const el = document.querySelector(`[data-home-bg-section="${id}"]`);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = rect.height;
    if (height < 8) continue;
    out.push({ id, top, height });
  }
  return out;
}
