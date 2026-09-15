import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../globals.css";

// Urbanist is the brand face already in use on the live site. Open Sans,
// which Divi injected alongside it, is deliberately not carried over.
const urbanist = Urbanist({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-urbanist",
  display: "swap",
});

const SITE_URL = "https://diwaindustries.tg";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      // French is the default locale and is served unprefixed, matching the
      // x-default the live site already publishes. Derived from the locale
      // list so adding a locale to `routing` cannot leave it out of hreflang.
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [
            l,
            l === routing.defaultLocale ? "/" : `/${l}`,
          ]),
        ),
        "x-default": "/",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      type: "website",
      siteName: "Diwa Industries",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  // Organisation structured data — the certifications and the Blitta plant
  // are the parts search engines can actually use.
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Diwa Industries SA",
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/diwa-logo.png`,
    email: "info@diwaindustries.tg",
    telephone: "+228 90 04 07 42",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Blitta",
      addressRegion: "Région Centrale",
      addressCountry: "TG",
      postOfficeBoxNumber: "08 BP 8535",
    },
    hasCredential: ["ISO 9001:2015", "ISO 45001:2018", "ISO 14001:2015"],
  };

  return (
    <html lang={locale} className={urbanist.variable}>
      <body className="bg-paper text-ink-2 antialiased">
        {/*
          Marks the document as scripted before first paint. The scroll-reveal
          rules in globals.css hang off `html.js`, so if this never runs every
          section simply renders visible instead of waiting on an observer.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <NextIntlClientProvider>
          <a
            href="#main"
            className="bg-indigo sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:px-4 focus:py-2 focus:text-white"
          >
            {t("skip")}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
