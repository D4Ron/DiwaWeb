import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BonsPlans } from "@/components/BonsPlans";
import "./bons-plans.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bonsPlans" });

  return {
    title: `${t("title")} — Diwa Industries`,
    description: t("sub"),
  };
}

/**
 * Layout ported one-to-one from kapiconsult.tg/bons-plans at the client's
 * request. The copy is translated and switches with the locale.
 *
 * Playfair Display and DM Sans are loaded here rather than in the root layout
 * so the rest of the site keeps Urbanist alone.
 */
export default async function BonsPlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const contactHref =
    locale === "fr" ? "/contact" : locale === "pt" ? "/pt/contacto" : "/en/contact";

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap"
      />
      <BonsPlans contactHref={contactHref} />
    </>
  );
}
