import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// Create middleware using the routing configuration
// This handles locale detection, redirects, and rewrites
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next)
  // - Static files (files with extensions)
  // - Vercel internals
  // Explicitly include root path and all other paths
  matcher: [
    "/",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
