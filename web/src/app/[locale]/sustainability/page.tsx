import { Img as Image } from "@/components/Img";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { WaveBand } from "@/components/Wave";
import { Container, PageHero, SectionHead, TickList } from "@/components/Blocks";

export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sustainability");
  const c = await getTranslations("certifications");
  const cred = await getTranslations("credentials");

  const pillars = [
    { key: "resources", image: "/images/facility/factory-floor.jpg" },
    { key: "requalification", image: "/images/facility/paint-booth.jpg" },
    { key: "qse", image: "/images/facility/overhead-conveyor.jpg" },
  ] as const;

  return (
    <>
      <PageHero
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        lead={t("pageLead")}
        image="/images/people/loading-team.jpg"
      />

      {/* The one page that leads in works green rather than indigo. */}
      <section className="bg-works-green py-24 text-white sm:py-28">
        <Container>
          <Reveal>
            <p className="mx-auto max-w-[76ch] text-center text-[18px] leading-[1.75] text-white/90">
              {t("intro")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Three pillars, alternating. */}
      <div className="bg-mint">
        {pillars.map((pillar, i) => (
          <section key={pillar.key} className="py-20 sm:py-24">
            <Container
              className={`grid items-center gap-12 md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={pillar.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <h2>{t(`${pillar.key}.title`)}</h2>
                <div className="animate-rule bg-works-green mt-6 h-[3px] w-14 rounded-full" />
                <p className="text-muted mt-6 leading-relaxed">
                  {t(`${pillar.key}.body`)}
                </p>
              </Reveal>
            </Container>
          </section>
        ))}
      </div>

      {/* Certifications in the wave band. */}
      <div className="bg-mint">
        <WaveBand>
          <Reveal>
            <h2 className="text-white">{c("title")}</h2>
            <p className="mx-auto mt-6 max-w-[64ch] text-white/85">
              {c("body")}
            </p>
          </Reveal>
        </WaveBand>
      </div>

      <section className="bg-mint pb-24 sm:pb-28">
        <Container>
          <Stagger className="grid gap-6 md:grid-cols-3">
            {(
              [
                {
                  heading: c("certHeading"),
                  items: [
                    cred("iso9001"),
                    cred("iso45001"),
                    cred("iso14001"),
                  ],
                },
                {
                  heading: c("auditHeading"),
                  items: [cred("total"), cred("oryx")],
                },
                {
                  heading: c("membershipHeading"),
                  items: [c("membership")],
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

      <section className="py-24 sm:py-28">
        <Container>
          <SectionHead
            kicker={t("eyebrow")}
            title={t("title")}
            lead={t("body")}
            align="center"
          />
        </Container>
      </section>
    </>
  );
}
