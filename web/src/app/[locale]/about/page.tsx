import { Img as Image } from "@/components/Img";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { WaveBand } from "@/components/Wave";
import {
  Button,
  Container,
  Kicker,
  PageHero,
  SectionHead,
  TickList,
} from "@/components/Blocks";
import { GROUP_COMPANIES, MILESTONES } from "@/content/group";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const v = await getTranslations("vision");
  const loc = locale as "fr" | "en";

  const values = ["safety", "quality", "innovation", "environment"] as const;

  return (
    <>
      {/* The one genuine photograph of the plant, so it leads the page. */}
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        lead={t("pageLead")}
        image="/images/facility/blitta-plant-visit-2021.jpg"
      />

      {/* -------------------------- Mission --------------------------- */}
      <section className="py-24 sm:py-28">
        <Container className="grid items-start gap-14 md:grid-cols-2">
          <Reveal>
            <Kicker>{t("missionKicker")}</Kicker>
            <h2>{t("missionTitle")}</h2>
            <div className="animate-rule bg-indigo mt-6 h-[3px] w-14 rounded-full" />
          </Reveal>
          <Reveal delay={0.12}>
            <div className="text-muted flex flex-col gap-5 leading-relaxed">
              <p>{t("missionBody1")}</p>
              <p>{t("missionBody2")}</p>
              <p>{t("missionBody3")}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* --------------------------- Figures -------------------------- */}
      <section className="bg-mint py-20 sm:py-24">
        <Container>
          <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                { n: 2000000, s: "+", l: "cylinders" },
                { n: 3600, s: "", l: "requalified" },
                { n: 180, s: "", l: "jobs" },
                { n: 3, s: "", l: "iso" },
              ] as const
            ).map((stat) => (
              <StaggerItem key={stat.l}>
                <div className="border-rule border-t pt-6">
                  <div className="text-indigo font-display text-[38px] leading-none font-extrabold">
                    <CountUp target={stat.n} suffix={stat.s} locale={locale} />
                  </div>
                  <p className="text-muted mt-2.5 text-[11px] tracking-[0.13em] uppercase">
                    {t(`figures.${stat.l}`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2}>
            <p className="text-muted mt-10 max-w-[70ch] text-[14.5px] leading-relaxed">
              {t("figuresNote")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* -------------------------- Timeline -------------------------- */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHead kicker={t("historyKicker")} title={t("historyTitle")} />
          <Stagger className="mt-14 flex flex-col">
            {MILESTONES.map((milestone) => (
              <StaggerItem key={milestone.year}>
                <div className="border-rule grid gap-4 border-b py-8 md:grid-cols-[110px_1fr] md:gap-10">
                  <div className="text-indigo font-display text-[26px] leading-none font-extrabold tabular-nums">
                    {milestone.year}
                  </div>
                  <div>
                    <h3>{milestone.title[loc]}</h3>
                    <p className="text-muted mt-3 max-w-[72ch] text-[15px] leading-relaxed">
                      {milestone.body[loc]}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* --------------------- Vision, in the band -------------------- */}
      <div className="bg-mint">
        <WaveBand>
          <Reveal>
            <h2 className="text-white">{v("title")}</h2>
            <p className="mx-auto mt-7 max-w-[74ch] text-[17px] leading-[1.75] text-white/85">
              {v("body")}
            </p>
          </Reveal>
        </WaveBand>
      </div>

      {/* --------------------------- Values --------------------------- */}
      <section className="bg-mint py-24 sm:py-28">
        <Container>
          <SectionHead kicker={t("valuesKicker")} title={t("valuesTitle")} />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2">
            {values.map((key, i) => (
              <StaggerItem key={key} className="h-full">
                <div className="border-rule bg-paper h-full rounded-2xl border p-8">
                  <span
                    aria-hidden
                    className="text-indigo/35 text-[13px] font-bold tracking-[0.14em]"
                  >
                    {`0${i + 1}`}
                  </span>
                  <h3 className="mt-3">{t(`values.${key}.title`)}</h3>
                  <p className="text-muted mt-3 text-[15px] leading-relaxed">
                    {t(`values.${key}.body`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---------------------- Plant photograph ---------------------- */}
      <section className="py-24 sm:py-28">
        <Container className="grid items-center gap-14 md:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
              <Image
                src="/images/facility/blitta-plant-visit-2021.jpg"
                alt={t("plantAlt")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="text-muted mt-3 text-[12.5px]">{t("plantCaption")}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="text-[clamp(24px,2.8vw,32px)]">{t("plantTitle")}</h2>
            <div className="animate-rule bg-indigo mt-6 h-[3px] w-14 rounded-full" />
            <p className="text-muted mt-6 leading-relaxed">{t("plantBody")}</p>
            <TickList
              items={[
                v("reliability"),
                v("innovation"),
                v("service"),
                v("environment"),
              ]}
            />
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------- Group --------------------------- */}
      <section className="bg-navy py-24 text-white sm:py-28">
        <Container>
          <Reveal>
            <Kicker tone="white">{t("groupKicker")}</Kicker>
            <h2 className="text-white">{t("groupTitle")}</h2>
            <div className="animate-rule mt-6 h-[3px] w-14 rounded-full bg-white/70" />
            <p className="mt-7 max-w-[74ch] leading-relaxed text-white/80">
              {t("groupBody")}
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
            {GROUP_COMPANIES.map((company) => (
              <StaggerItem key={company.name} className="h-full">
                <div
                  className={`h-full p-6 ${
                    company.highlight ? "bg-indigo" : "bg-navy"
                  }`}
                >
                  <h3
                    className={`text-[15px] ${
                      company.highlight ? "text-white" : "text-white/90"
                    }`}
                  >
                    {company.name}
                  </h3>
                  <p
                    className={`mt-2.5 text-[13.5px] leading-relaxed ${
                      company.highlight ? "text-white/85" : "text-white/55"
                    }`}
                  >
                    {company.role[loc]}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <p className="mt-10 max-w-[74ch] text-[14.5px] leading-relaxed text-white/60">
              {t("groupNote")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* --------------------------- Reach ---------------------------- */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHead
            kicker={t("reachKicker")}
            title={t("reachTitle")}
            lead={t("reachBody")}
          />
          <Reveal delay={0.12}>
            {/* Diwa's own reach graphic, from the company deck. Its lettering
                is baked into the image and is French-only. */}
            <div className="border-rule mt-12 overflow-hidden rounded-2xl border">
              <Image
                src="/images/brand/west-africa-map.jpg"
                alt={t("reachAlt")}
                width={2200}
                height={1238}
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ----------------------------- CTA ---------------------------- */}
      <div className="bg-mint">
        <WaveBand>
          <Reveal>
            <h2 className="text-white">{t("ctaTitle")}</h2>
            <p className="mx-auto mt-6 max-w-[58ch] text-white/85">
              {t("ctaBody")}
            </p>
            <Button
              href={locale === "fr" ? "/contact" : "/en/contact"}
              variant="white"
              className="mt-9"
            >
              {t("ctaButton")}
            </Button>
          </Reveal>
        </WaveBand>
      </div>

      <section className="bg-mint pb-24 sm:pb-28" />
    </>
  );
}
