import { Img as Image } from "@/components/Img";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { WaveBand } from "@/components/Wave";
import { Container, PageHero, SectionHead } from "@/components/Blocks";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");

  const reasons = [1, 2, 3, 4] as const;

  const testimonials = [
    { key: "t1", image: "/images/people/operator-portrait.jpg" },
    { key: "t2", image: "/images/people/operator-smiling.jpg" },
    { key: "t3", image: "/images/people/diwa-jacket.jpg" },
  ] as const;

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
          <Reveal>
            <p className="text-muted mx-auto max-w-[74ch] text-center text-[18px] leading-[1.75]">
              {t("intro")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Why work here. */}
      <section className="bg-mint py-24 sm:py-28">
        <Container>
          <SectionHead title={t("whyTitle")} lead={t("whyBody")} />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2">
            {reasons.map((n) => (
              <StaggerItem key={n} className="h-full">
                <div className="border-rule bg-paper h-full rounded-2xl border p-8">
                  <span
                    aria-hidden
                    className="text-indigo/35 text-[13px] font-bold tracking-[0.14em]"
                  >
                    {`0${n}`}
                  </span>
                  <h3 className="mt-3">{t(`reason${n}Title`)}</h3>
                  <p className="text-muted mt-3 text-[15px] leading-relaxed">
                    {t(`reason${n}Body`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Testimonials. */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHead
            title={t("testimonialsTitle")}
            lead={t("testimonialsLead")}
          />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((person) => (
              <StaggerItem key={person.key} className="h-full">
                <figure className="border-rule flex h-full flex-col rounded-2xl border p-8">
                  <blockquote className="text-ink-2 flex-1 text-[15px] leading-relaxed italic">
                    “{t(person.key)}”
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-4">
                    <Image
                      src={person.image}
                      alt=""
                      width={56}
                      height={56}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-ink text-[15px] font-bold">
                        {t(`${person.key}Name`)}
                      </p>
                      <p className="text-muted text-[13px]">
                        {t(`${person.key}Role`)}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* How to apply, in the wave band. */}
      <div className="bg-mint">
        <WaveBand>
          <Reveal>
            <h2 className="text-white">{t("applyTitle")}</h2>
            <p className="mx-auto mt-6 max-w-[62ch] text-white/85">
              {t("applyBody")}
            </p>
            {/* Sends people to the application form rather than a mailto,
                so the CV and structured fields are captured properly. */}
            <Link
              href="/careers/spontaneous-application"
              className="text-indigo mt-9 inline-flex rounded-lg bg-white px-7 py-3.5 text-[15px] font-semibold transition-all duration-[450ms] ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.45)]"
            >
              {t("applyCta")}
            </Link>
          </Reveal>
        </WaveBand>
      </div>

      <section className="bg-mint pb-24 sm:pb-28" />
    </>
  );
}
