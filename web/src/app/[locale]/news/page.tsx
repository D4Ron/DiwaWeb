import { getTranslations, setRequestLocale } from "next-intl/server";
import { Stagger, StaggerItem } from "@/components/Motion";
import { Container, MediaCard, PageHero } from "@/components/Blocks";
import { articles } from "@/content/news";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const loc = locale as "fr" | "en";

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        lead={t("pageLead")}
        image="/images/facility/warehouse-cylinders.jpg"
      />

      <section className="py-24 sm:py-28">
        <Container>
          <Stagger className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <StaggerItem key={article.id} className="h-full">
                <MediaCard
                  image={article.image}
                  title={article.title[loc]}
                  body={article.excerpt[loc]}
                  meta={new Date(article.date).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  cta={t("readMore")}
                  href={
                    locale === "fr"
                      ? `/actualites/${article.slug.fr}`
                      : `/en/news/${article.slug.en}`
                  }
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
