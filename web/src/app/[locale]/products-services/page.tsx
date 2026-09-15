import { Img as Image } from "@/components/Img";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { WaveBand } from "@/components/Wave";
import {
  Container,
  Kicker,
  PageHero,
  SectionHead,
  TickList,
} from "@/components/Blocks";

const SECTIONS = [
  {
    key: "manufacturing",
    image: "/images/products/branded-cylinders.jpg",
  },
  {
    key: "requalification",
    image: "/images/facility/paint-booth.jpg",
  },
  {
    key: "co2",
    image: "/images/facility/furnace.jpg",
  },
  // Fourth line, from the 2026 commercial brochure: cages, display stands
  // and burners. Absent from the old WordPress site entirely.
  {
    key: "accessories",
    image: "/images/products/cylinder-lineup.jpg",
  },
] as const;

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  return (
    <>
      <PageHero
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        lead={t("pageLead")}
        image="/images/products/branded-cylinders-wide.jpg"
      />

      {/* Quality statement in the wave band. */}
      <div className="bg-mint">
        <WaveBand>
          <Reveal>
            <h2 className="text-white">{t("quality.title")}</h2>
            <div className="mx-auto mt-8 flex max-w-[74ch] flex-col gap-5 text-left text-[16.5px] leading-[1.75] text-white/85">
              <p>{t("quality.body1")}</p>
              <p>{t("quality.body2")}</p>
              <p>{t("quality.body3")}</p>
            </div>
          </Reveal>
        </WaveBand>
      </div>

      {/* Three products, alternating sides, each with its spec block. */}
      <div className="bg-mint">
        {SECTIONS.map((section, i) => (
          <section
            key={section.key}
            id={section.key}
            className="scroll-mt-24 py-20 sm:py-24"
          >
            <Container
              className={`grid items-center gap-12 md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={section.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <Kicker>{`0${i + 1}`}</Kicker>
                <h2>{t(`${section.key}.title`)}</h2>
                <div className="animate-rule bg-indigo mt-6 h-[3px] w-14 rounded-full" />
                <p className="text-muted mt-6 leading-relaxed">
                  {t(`${section.key}.long`)}
                </p>

                <dl className="border-rule mt-8 grid gap-x-8 gap-y-5 border-t pt-7 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted text-[10.5px] tracking-[0.13em] uppercase">
                      {t(`${section.key}.specLabel`)}
                    </dt>
                    <dd className="text-ink mt-1.5 font-semibold tabular-nums">
                      {t(`${section.key}.specValue`)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted text-[10.5px] tracking-[0.13em] uppercase">
                      {t(`${section.key}.sizesLabel`)}
                    </dt>
                    <dd className="text-ink mt-1.5 font-semibold tabular-nums">
                      {t(`${section.key}.sizesValue`)}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </Container>
          </section>
        ))}
      </div>

      {/* Benefits. */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHead title={t("benefits.title")} />
          <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
            {(["standards", "reliability", "sustainability", "service"] as const).map(
              (key) => (
                <StaggerItem key={key} className="h-full">
                  <div className="border-rule h-full rounded-2xl border p-7">
                    <TickList items={[t(`benefits.${key}`)]} />
                  </div>
                </StaggerItem>
              ),
            )}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
