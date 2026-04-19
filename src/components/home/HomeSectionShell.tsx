"use client";

import type { HomeBgSectionId } from "./homeBackgroundSections";
import { CosmicSectionFrame } from "./CosmicSectionFrame";

interface HomeSectionShellProps {
  children: React.ReactNode;
  /** When set, marks the section for scroll-linked `CosmicSectionFrame` depth (see `data-home-bg-section`). */
  homeBgSection?: HomeBgSectionId;
}

/** Transparent wrapper so the fixed WebGL cosmos reads continuously behind home content. */
export function HomeSectionShell({ children, homeBgSection }: HomeSectionShellProps) {
  return (
    <section
      className="relative overflow-visible"
      {...(homeBgSection ? { "data-home-bg-section": homeBgSection } : {})}
    >
      <div className="relative z-10 w-full">
        {homeBgSection ? (
          <CosmicSectionFrame sectionId={homeBgSection}>{children}</CosmicSectionFrame>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
