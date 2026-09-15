import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Articles used to sit at the WordPress root (/kodjo-adedze-visite-diwa-industries/).
 * They now live under /actualites/<slug>, so the old paths are redirected
 * permanently to keep their inbound links and search rankings.
 */
const LEGACY_ARTICLES = [
  "diwa-industries-a-la-6e-edition-du-west-africa-lpg-expo-nigeria-2025-une-participation-marquante-pour-le-developpement-du-secteur-du-gaz-en-afrique-de-louest",
  "diwa-industries-a-la-19e-foire-internationale-de-lome-une-vitrine-pour-linnovation-et-la-qualite",
  "kodjo-adedze-visite-diwa-industries",
];

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle so the Docker runtime stage can ship
  // without node_modules. See Dockerfile, which sets DOCKER_BUILD=1.
  //
  // Vercel builds its own output format and does not want "standalone", so
  // this stays off unless we are building the container.
  output: process.env.DOCKER_BUILD === "1" ? "standalone" : undefined,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      ...LEGACY_ARTICLES.map((slug) => ({
        source: `/${slug}`,
        destination: `/actualites/${slug}`,
        permanent: true,
      })),
      // The old English contact slug.
      { source: "/en/contact-us", destination: "/en/contact", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
