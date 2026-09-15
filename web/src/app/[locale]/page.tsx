import { Img as Image } from "@/components/Img";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CountUp, HeroRotator, Marquee, Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { WaveBand } from "@/components/Wave";
import {
  Button,
  Container,
  Kicker,
  MediaCard,
  SectionHead,
  TickList,
} from "@/components/Blocks";
import { articles } from "@/content/news";

/**
 * Frames for the hero loop, standing in for the video until it is produced.
 * All four are real photographs of Blitta, from the company's own documents.
 */
const HERO_FRAMES = [
  "/images/facility/warehouse-cylinders.jpg",
  "/images/facility/factory-floor.jpg",
  "/images/facility/production-line.jpg",
  "/images/facility/assembly-stations.jpg",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const loc = locale as "fr" | "en";

  const products = [
    { key: "manufacturing", image: "/images/products/branded-cylinders.jpg" },
    { key: "co2", image: "/images/products/co2-cylinders.jpg" },
    { key: "requalification", image: "/images/facility/paint-booth.jpg" },
  ] as const;

  const credentials = [
    t("credentials.iso9001"),
    t("credentials.iso45001"),
    t("credentials.iso14001"),
    t("credentials.total"),
    t("credentials.oryx"),
    t("credentials.wlpga"),
    t("credentials.region"),
  ];

  const partners = [
    { src: "/images/partners/pegaz.png", alt: "Pegaz" },
    { src: "/images/partners/sodigaz.jpg", alt: "Sodigaz" },
    { src: "/images/partners/zener.png", alt: "Zener" },
    { src: "/images/partners/total.jpg", alt: "Total" },
  ];

  return (
    <>
      {/* ---------------------------------------------------------------
          Hero — the one orchestrated sequence on the site.
          eyebrow 0.1s → title 0.28s → rule 0.8s → sub 0.52s → CTAs 0.72s
          → figures 0.92s, all on the same 1.25-1.6s expo-out curve.
      ---------------------------------------------------------------- */}
      <header className="relative flex min-h-[86vh] items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroRotator images={HERO_FRAMES} />
        </div>
        <div className="from-navy/95 via-navy/82 to-indigo/35 absolute inset-0 z-10 bg-gradient-to-r" />

        <Container className="relative z-20 py-24 sm:py-32">
          <p className="animate-rise-sm mb-6 text-[11px] font-semibold tracking-[0.2em] text-white/62 uppercase [animation-delay:100ms]">
            {t("hero.eyebrow")}
          </p>

          <h1 className="max-w-[15ch] text-white [animation-delay:280ms] motion-safe:animate-[diwa-rise_1600ms_var(--ease-soft)_both]">
            {t("hero.title")}
          </h1>

          <div className="animate-rule bg-indigo-light my-8 h-[3px] w-[74px] rounded-full [animation-delay:800ms]" />

          <p className="max-w-[52ch] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-white/80 [animation-delay:520ms] motion-safe:animate-[diwa-rise_1600ms_var(--ease-soft)_both]">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap gap-3 [animation-delay:720ms] motion-safe:animate-[diwa-rise_1600ms_var(--ease-soft)_both]">
            <Button href={locale === "fr" ? "/contact" : "/en/contact"}>
              {t("hero.cta")}
            </Button>
            <Button
              href={
                locale === "fr" ? "/produits-services" : "/en/products-services"
              }
              variant="ghost"
            >
              {t("hero.ctaSecondary")}
            </Button>
          </div>

          <dl className="mt-16 flex flex-wrap gap-x-14 gap-y-8 [animation-delay:920ms] motion-safe:animate-[diwa-rise_1600ms_var(--ease-soft)_both]">
            {(
              [
                { n: 2000000, s: "+", l: "cylindersPerYear" },
                { n: 3600, s: "", l: "requalifiedPerDay" },
                { n: 3, s: "", l: "certifications" },
              ] as const
            ).map((stat) => (
              <div key={stat.l}>
                <dd className="text-[38px] leading-none font-extrabold text-white">
                  <CountUp target={stat.n} suffix={stat.s} locale={locale} />
                </dd>
                <dt className="mt-2.5 text-[10.5px] tracking-[0.13em] text-white/52 uppercase">
                  {t(`stats.${stat.l}`)}
                </dt>
              </div>
            ))}
          </dl>
        </Container>

        <div className="absolute right-0 bottom-0 left-0 z-20 border-t border-white/10 py-5">
          <Marquee items={credentials} />
        </div>
      </header>

      {/* --------------------- Intro, in the wave band ------------------ */}
      <div className="bg-mint">
        <WaveBand>
          <Reveal>
            <h2 className="text-white">{t("intro.title")}</h2>
            <p className="mx-auto mt-7 max-w-[74ch] text-[17px] leading-[1.75] text-white/85">
              {t("intro.body")}
            </p>
            <Button
              href={
                locale === "fr" ? "/produits-services" : "/en/products-services"
              }
              variant="white"
              className="mt-9"
            >
              {t("intro.cta")}
            </Button>
          </Reveal>
        </WaveBand>
      </div>

      {/* --------------------------- Products --------------------------- */}
      <section className="bg-mint py-24 sm:py-28">
        <Container>
          <SectionHead
            kicker={t("products.eyebrow")}
            title={t("products.title")}
          />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <StaggerItem key={product.key} className="h-full">
                <MediaCard
                  image={product.image}
                  title={t(`products.${product.key}.title`)}
                  body={t(`products.${product.key}.body`)}
                  cta={t("products.more")}
                  href={
                    locale === "fr"
                      ? `/produits-services#${product.key}`
                      : `/en/products-services#${product.key}`
                  }
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ----------------------- Sustainability ------------------------- */}
      <section className="bg-works-green py-24 text-white sm:py-28">
        <Container className="grid items-center gap-14 md:grid-cols-2">
          <Reveal>
            <Kicker tone="white">{t("sustainability.eyebrow")}</Kicker>
            <h2 className="text-white">{t("sustainability.title")}</h2>
            <div className="animate-rule mt-6 h-[3px] w-14 rounded-full bg-white/70" />
            <p className="mt-7 max-w-[58ch] leading-relaxed text-white/85">
              {t("sustainability.body")}
            </p>
            <Link
              href="/sustainability"
              className="text-works-green mt-9 inline-flex rounded-lg bg-white px-7 py-3.5 text-[15px] font-semibold transition-all duration-[450ms] ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.45)]"
            >
              {t("sustainability.cta")}
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/facility/paint-booth.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* -------------------------- Vision ------------------------------ */}
      <section className="py-24 sm:py-28">
        <Container className="grid gap-14 md:grid-cols-2">
          <Reveal>
            <SectionHead title={t("vision.title")} />
            <p className="text-muted mt-7 leading-relaxed">
              {t("vision.body")}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="text-[clamp(22px,2.6vw,30px)]">
              {t("vision.whyTitle")}
            </h2>
            <TickList
              items={[
                t("vision.reliability"),
                t("vision.innovation"),
                t("vision.service"),
                t("vision.environment"),
              ]}
            />
          </Reveal>
        </Container>
      </section>

      {/* ---------------------- Certifications -------------------------- */}
      <section className="bg-mint py-24 sm:py-28">
        <Container>
          <SectionHead
            kicker={t("certifications.eyebrow")}
            title={t("certifications.title")}
            lead={t("certifications.body")}
          />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {(
              [
                {
                  heading: t("certifications.certHeading"),
                  items: [
                    t("credentials.iso9001"),
                    t("credentials.iso45001"),
                    t("credentials.iso14001"),
                  ],
                },
                {
                  heading: t("certifications.auditHeading"),
                  items: [t("credentials.total"), t("credentials.oryx")],
                },
                {
                  heading: t("certifications.membershipHeading"),
                  items: [t("certifications.membership")],
                },
              ] as const
            ).map((group) => (
              <StaggerItem key={group.heading} className="h-full">
                <div className="border-rule bg-paper h-full rounded-2xl border p-8">
                  <h3 className="text-indigo text-[11px] font-semibold tracking-[0.15em] uppercase">
                    {group.heading}
                  </h3>
                  <TickList items={[...group.items]} />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ----------------------- Latest news ---------------------------- */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHead kicker={t("news.eyebrow")} title={t("news.pageTitle")} />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
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
                  cta={t("news.readMore")}
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

      {/* -------------------------- Partners ---------------------------- */}
      <section className="bg-mint py-20 sm:py-24">
        <Container>
          <SectionHead
            title={t("partners.title")}
            lead={t("partners.body")}
            align="center"
          />
          <Stagger className="mt-14 flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
            {partners.map((partner) => (
              <StaggerItem key={partner.alt}>
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={200}
                  height={90}
                  className="h-12 w-auto opacity-55 grayscale transition duration-[550ms] ease-[var(--ease-soft)] hover:opacity-100 hover:grayscale-0"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
