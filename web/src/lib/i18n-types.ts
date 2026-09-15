import type { Locale } from "@/i18n/routing";

/**
 * A string that exists in every locale. Typed as a full Record so adding a
 * locale to `routing` turns every incomplete entry in the content files into
 * a compile error, rather than silently rendering a blank on the new locale.
 */
export type L10n = Record<Locale, string>;
