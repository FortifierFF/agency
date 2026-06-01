import { PROJECT_PREVIEW_ASSET_VERSION } from "@/data/projectPreviewAssetVersion";

export type ProjectTag = "Web" | "UIUX" | "SEO" | "Mobile";

export type ProjectSlug =
  | "medboard"
  | "pal-recruitment"
  | "pal-credit-consult"
  | "pitchfork-games";

export interface ProjectPreviewAssets {
  domain: string;
  /** Pre-built bento collage for cards (generated under `public/projects/`). */
  collage: string;
  /** Homepage frame for case-study hero. */
  poster: string;
  /** Fallback if collage missing. */
  gradient: string;
  glow: string;
}

export interface Project {
  slug: ProjectSlug;
  liveUrl: string;
  tags: ProjectTag[];
  preview: ProjectPreviewAssets;
  techStack: string[];
  featured: boolean;
}

const previewBase = (slug: ProjectSlug) => `/projects/${slug}`;

/** Query param busts browser + `next/image` cache when captures are regenerated. */
function previewAsset(slug: ProjectSlug, file: string) {
  return `${previewBase(slug)}/${file}?v=${PROJECT_PREVIEW_ASSET_VERSION}`;
}

export const projects: Project[] = [
  {
    slug: "medboard",
    liveUrl: "https://medboard.bg/",
    tags: ["Web", "UIUX"],
    preview: {
      domain: "medboard.bg",
      collage: previewAsset("medboard", "collage.webp"),
      poster: previewAsset("medboard", "hero.webp"),
      gradient: "bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950",
      glow: "bg-[radial-gradient(ellipse_at_30%_20%,rgba(52,211,153,0.35),transparent_55%)]",
    },
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    featured: true,
  },
  {
    slug: "pal-recruitment",
    liveUrl: "https://palrecruitment.com/",
    tags: ["Web", "UIUX", "SEO"],
    preview: {
      domain: "palrecruitment.com",
      collage: previewAsset("pal-recruitment", "collage.webp"),
      poster: previewAsset("pal-recruitment", "hero.webp"),
      gradient: "bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950",
      glow: "bg-[radial-gradient(ellipse_at_70%_30%,rgba(96,165,250,0.3),transparent_50%)]",
    },
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    featured: true,
  },
  {
    slug: "pal-credit-consult",
    liveUrl: "https://palcreditconsult.com/",
    tags: ["Web", "UIUX"],
    preview: {
      domain: "palcreditconsult.com",
      collage: previewAsset("pal-credit-consult", "collage.webp"),
      poster: previewAsset("pal-credit-consult", "hero.webp"),
      gradient: "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900",
      glow: "bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,191,36,0.18),transparent_45%)]",
    },
    techStack: [
      "WordPress",
      "Elementor",
      "Elementor Pro",
      "Yoast SEO",
      "Contact Form 7",
      "WP Rocket",
      "Wordfence",
      "LiteSpeed Cache",
    ],
    featured: true,
  },
  {
    slug: "pitchfork-games",
    liveUrl: "https://pitchforkgames.com/",
    tags: ["Web", "UIUX"],
    preview: {
      domain: "pitchforkgames.com",
      collage: previewAsset("pitchfork-games", "collage.webp"),
      poster: previewAsset("pitchfork-games", "hero.webp"),
      gradient: "bg-gradient-to-br from-violet-950 via-fuchsia-950 to-black",
      glow: "bg-[radial-gradient(ellipse_at_80%_80%,rgba(192,132,252,0.35),transparent_50%)]",
    },
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    featured: true,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getProjectsByTag = (tag: string) =>
  tag === "All"
    ? projects
    : projects.filter((p) => p.tags.includes(tag as ProjectTag));

export const searchProjects = (query: string) => {
  const q = query.toLowerCase();
  return projects.filter(
    (p) =>
      p.slug.toLowerCase().includes(q) ||
      p.preview.domain.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
};

export function isProjectSlug(slug: string): slug is ProjectSlug {
  return projects.some((p) => p.slug === slug);
}
