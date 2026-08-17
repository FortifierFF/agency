/**
 * Canonical public site URL for sitemap, robots, and Open Graph.
 * Set `NEXT_PUBLIC_SITE_URL` in production (no trailing slash).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://palstudio.bg"
).replace(/\/+$/, "");

export const SITE_NAME = "PAL Studio";
