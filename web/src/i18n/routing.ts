import { defineRouting } from "next-intl/routing";

/**
 * French is the default locale and is served unprefixed at `/`.
 *
 * This mirrors the live WordPress site, which serves fr-FR at the root and
 * declares `<link rel="alternate" hreflang="x-default" href="https://diwaindustries.tg/">`.
 * English lives under /en/ and Portuguese under /pt/ — Portuguese because
 * Guinea-Bissau sits inside the CEDEAO/UEMOA zone Diwa already ships to
 * duty-free, and it is lusophone.
 *
 * `pathnames` reproduces the live site's French slugs exactly, so
 * /produits-services, /durabilite, /carrieres and /actualites all keep
 * working. Article URLs moved from the WordPress root to /actualites/<slug>;
 * the old root-level paths are redirected in next.config.ts.
 */
export const routing = defineRouting({
  locales: ["fr", "en", "pt"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/about": {
      fr: "/a-propos",
      en: "/about",
      pt: "/sobre",
    },
    "/products-services": {
      fr: "/produits-services",
      en: "/products-services",
      pt: "/produtos-servicos",
    },
    "/sustainability": {
      fr: "/durabilite",
      en: "/sustainability",
      pt: "/sustentabilidade",
    },
    "/careers": {
      fr: "/carrieres",
      en: "/careers",
      pt: "/carreiras",
    },
    "/careers/offers": {
      fr: "/carrieres/offres",
      en: "/careers/offers",
      pt: "/carreiras/ofertas",
    },
    "/careers/spontaneous-application": {
      fr: "/carrieres/candidature-spontanee",
      en: "/careers/spontaneous-application",
      pt: "/carreiras/candidatura-espontanea",
    },
    "/news": {
      fr: "/actualites",
      en: "/news",
      pt: "/noticias",
    },
    "/news/[slug]": {
      fr: "/actualites/[slug]",
      en: "/news/[slug]",
      pt: "/noticias/[slug]",
    },
    "/contact": {
      fr: "/contact",
      en: "/contact",
      pt: "/contacto",
    },
    // The slug stays identical in all three locales: "Bons Plans" is how the
    // client refers to the page. Only the content is translated.
    "/bons-plans": {
      fr: "/bons-plans",
      en: "/bons-plans",
      pt: "/bons-plans",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
