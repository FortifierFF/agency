"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type ProjectPreviewProps = {
  project: Project;
  className?: string;
  /** Show faux browser chrome + domain bar. */
  showChrome?: boolean;
  /**
   * `poster` — full homepage capture (sharp, used on cards + case study).
   * `collage` — bento composite; shown without aggressive crop.
   */
  variant?: "collage" | "poster";
};

export function ProjectPreview({
  project,
  className,
  showChrome = true,
  variant = "poster",
}: ProjectPreviewProps) {
  const src = variant === "poster" ? project.preview.poster : project.preview.collage;
  const alt = `${project.preview.domain} preview`;
  const isCollage = variant === "collage";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-950",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className={cn(
          isCollage
            ? "object-contain object-center"
            : "object-cover object-top"
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        priority={variant === "poster"}
      />

      {/* Light bottom vignette only — heavy overlays were washing out sharp screenshots. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-black/40 to-transparent"
        aria-hidden
      />

      {showChrome && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 border-b border-white/10 bg-black/50 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-md bg-black/40 px-3 py-1 font-mono text-[11px] text-white/85">
            {project.liveUrl}
          </span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/70" aria-hidden />
        </div>
      )}
    </div>
  );
}
