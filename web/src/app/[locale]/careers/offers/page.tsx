import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { WaveBand } from "@/components/Wave";
import { Button, Container, PageHero } from "@/components/Blocks";
import { offers, isExpired } from "@/content/offers";

export default async function OffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("offers");
  const loc = locale as "fr" | "en";

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        lead={t("pageLead")}
        image="/images/people/loading-team.jpg"
      />

      <section className="py-24 sm:py-28">
        <Container>
          {offers.length === 0 ? (
            <Reveal>
              <div className="border-rule mx-auto max-w-[62ch] rounded-2xl border border-dashed px-8 py-14 text-center">
                <p className="text-indigo text-[11px] font-semibold tracking-[0.16em] uppercase">
                  {t("noneKicker")}
                </p>
                <h2 className="mt-4 text-[clamp(22px,2.6vw,30px)]">
                  {t("noneTitle")}
                </h2>
                <p className="text-muted mx-auto mt-5 max-w-[52ch] leading-relaxed">
                  {t("noneBody")}
                </p>
                <Link
                  href="/careers/spontaneous-application"
                  className="bg-indigo hover:bg-indigo-deep mt-8 inline-flex rounded-lg px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-[450ms] ease-[var(--ease-soft)] hover:-translate-y-0.5"
                >
                  {t("noneCta")}
                </Link>
              </div>
            </Reveal>
          ) : (
            <>
              <Reveal>
                <p className="text-muted text-[14.5px]">
                  {t("count", { count: offers.length })}
                </p>
              </Reveal>

              <Stagger className="mt-8 flex flex-col gap-4">
                {offers.map((offer) => {
                  const expired = isExpired(offer);
                  return (
                    <StaggerItem key={offer.id}>
                      <article className="border-rule bg-paper rounded-2xl border p-7 transition-[transform,box-shadow] duration-[550ms] ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(26,26,61,0.35)]">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="bg-indigo-soft text-indigo rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.08em] uppercase">
                            {offer.contract}
                          </span>
                          {expired ? (
                            <span className="text-muted bg-surface rounded-full px-3 py-1 text-[11px] font-semibold">
                              {t("expired")}
                            </span>
                          ) : (
                            <span className="text-works-green bg-works-green-soft rounded-full px-3 py-1 text-[11px] font-semibold">
                              {t("active")}
                            </span>
                          )}
                        </div>

                        <h2 className="mt-4 text-[clamp(19px,2.1vw,24px)]">
                          {offer.title[loc]}
                        </h2>
                        <p className="text-muted mt-3 max-w-[70ch] text-[15px] leading-relaxed">
                          {offer.summary[loc]}
                        </p>

                        <dl className="text-muted border-rule mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t pt-5 text-[13.5px]">
                          <div className="flex gap-2">
                            <dt className="font-semibold">{t("location")}</dt>
                            <dd>{offer.location[loc]}</dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="font-semibold">{t("experience")}</dt>
                            <dd>{offer.experience[loc]}</dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="font-semibold">{t("posted")}</dt>
                            <dd className="tabular-nums">
                              {new Date(offer.posted).toLocaleDateString(locale, {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </dd>
                          </div>
                        </dl>

                        {!expired ? (
                          <Link
                            href="/careers/spontaneous-application"
                            className="text-indigo mt-5 inline-flex text-[15px] font-semibold transition-opacity duration-300 hover:opacity-70"
                          >
                            {t("apply")} →
                          </Link>
                        ) : null}
                      </article>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </>
          )}
        </Container>
      </section>

      <div className="bg-mint">
        <WaveBand>
          <Reveal>
            <h2 className="text-white">{t("spontaneousTitle")}</h2>
            <p className="mx-auto mt-6 max-w-[62ch] text-white/85">
              {t("spontaneousBody")}
            </p>
            <Button
              href={
                locale === "fr"
                  ? "/carrieres/candidature-spontanee"
                  : "/en/careers/spontaneous-application"
              }
              variant="white"
              className="mt-9"
            >
              {t("spontaneousCta")}
            </Button>
          </Reveal>
        </WaveBand>
      </div>

      <section className="bg-mint pb-24 sm:pb-28" />
    </>
  );
}
