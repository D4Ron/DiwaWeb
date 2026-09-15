import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale negotiation and redirects.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy`; the export
 * shape is unchanged.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and anything with a file extension.
  // The `\\.` is a literal dot in the compiled regex.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
