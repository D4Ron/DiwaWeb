import { Img as Image } from "@/components/Img";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/Blocks";
import { articles, getArticle } from "@/content/news";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    articles.map((article) => ({
      locale,
      slug: article.slug[locale as "fr" | "en"],
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug, locale as "fr" | "en");
  if (!article) return {};

  const loc = locale as "fr" | "en";
  return {
    title: `${article.title[loc]} — Diwa Industries`,
    description: article.excerpt[loc],
    openGraph: {
      title: article.title[loc],
      description: article.excerpt[loc],
      type: "article",
      publishedTime: article.date,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const loc = locale as "fr" | "en";
  const article = getArticle(slug, loc);
  if (!article) notFound();

  const t = await getTranslations("news");
  const published = new Date(article.date).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article>
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={article.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover"
          />
          <div className="from-navy/96 via-navy/88 to-navy/60 absolute inset-0 bg-gradient-to-r" />
        </div>

        <Container className="relative z-10 py-24 sm:py-28">
          <p className="animate-rise-sm mb-5 text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase [animation-delay:100ms]">
            {t("published")} {published}
          </p>
          <h1 className="max-w-[22ch] text-[clamp(30px,4.2vw,52px)] leading-[1.08] text-white [animation-delay:280ms] motion-safe:animate-[diwa-rise_1600ms_var(--ease-soft)_both]">
            {article.title[loc]}
          </h1>
          <div className="animate-rule bg-indigo-light mt-7 h-[3px] w-16 rounded-full [animation-delay:800ms]" />
        </Container>
      </header>

      <Container className="py-20 sm:py-24">
        <div className="mx-auto max-w-[68ch]">
          {article.body[loc].map((block, i) =>
            block.startsWith("## ") ? (
              <h2
                key={i}
                className="mt-12 mb-4 text-[clamp(21px,2.4vw,27px)] first:mt-0"
              >
                {block.replace("## ", "")}
              </h2>
            ) : (
              <p key={i} className="text-ink-2 mb-5 leading-[1.78]">
                {block}
              </p>
            ),
          )}

          <div className="border-rule mt-16 border-t pt-8">
            <Link
              href="/news"
              className="text-indigo text-[15px] font-semibold transition-opacity duration-300 hover:opacity-70"
            >
              ← {t("back")}
            </Link>
          </div>
        </div>
      </Container>
    </article>
  );
}
