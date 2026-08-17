import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/siteConfig";

/** Static sitemap for all locales and key routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/about",
    "/services",
    "/projects",
    "/blog",
    "/blog/kolko-struva-izrabotka-sait-2026",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const projectPaths = projects.map((p) => `/projects/${p.slug}`);
  const paths = [...staticPaths, ...projectPaths];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path.startsWith("/projects/") ? 0.7 : 0.8,
      });
    }
  }
  return entries;
}
