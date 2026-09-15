import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Motion";
import { Container, PageHero, TickList } from "@/components/Blocks";
import { ApplicationForm } from "@/components/ApplicationForm";

export default async function SpontaneousApplicationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("spontaneous");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        lead={t("pageLead")}
        image="/images/facility/production-line.jpg"
      />

      <section className="py-24 sm:py-28">
        <Container className="grid gap-16 md:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <h2 className="text-[clamp(24px,2.8vw,32px)]">{t("formTitle")}</h2>
            <div className="animate-rule bg-indigo mt-6 mb-8 h-[3px] w-14 rounded-full" />
            <ApplicationForm />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-muted leading-relaxed">{t("intro")}</p>

            <div className="border-rule mt-10 rounded-2xl border p-7">
              <h3 className="text-indigo text-[11px] font-semibold tracking-[0.15em] uppercase">
                {t("whatWeLookFor")}
              </h3>
              <TickList
                items={[t("look1"), t("look2"), t("look3"), t("look4")]}
              />
            </div>

            <div className="bg-mint mt-6 rounded-2xl p-7">
              <h3 className="text-[17px]">{t("processTitle")}</h3>
              <ol className="text-muted mt-4 flex flex-col gap-3 text-[15px] leading-relaxed">
                {[t("step1"), t("step2"), t("step3")].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="text-indigo flex-none font-bold tabular-nums">
                      {`0${i + 1}`}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
