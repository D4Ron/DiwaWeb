import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Motion";
import { Container, PageHero } from "@/components/Blocks";
import { ContactForm } from "@/components/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const f = await getTranslations("footer");

  const details = [
    { label: t("addressLabel"), value: t("address") },
    { label: t("poBoxLabel"), value: t("poBox") },
    {
      label: t("phoneLabel"),
      value: `${f("phone")}\n${f("phone2")}\n${f("phone3")}`,
      hrefs: [
        `tel:${f("phone").replace(/\s/g, "")}`,
        `tel:${f("phone2").replace(/\s/g, "")}`,
        `tel:${f("phone3").replace(/\s/g, "")}`,
      ],
    },
    {
      // info@ plus the commercial contact named in the 2026 brochure.
      label: t("emailLabel"),
      value: `${f("email")}\n${f("email2")}`,
      hrefs: [`mailto:${f("email")}`, `mailto:${f("email2")}`],
    },
    { label: t("hoursLabel"), value: t("hours") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        lead={t("pageLead")}
        image="/images/facility/plant-exterior.jpg"
      />

      <section className="py-24 sm:py-28">
        <Container className="grid gap-16 md:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <h2 className="text-[clamp(24px,2.8vw,32px)]">{t("formTitle")}</h2>
            <div className="animate-rule bg-indigo mt-6 mb-8 h-[3px] w-14 rounded-full" />
            <ContactForm />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-muted leading-relaxed">{t("intro")}</p>

            <dl className="mt-10 flex flex-col gap-7">
              {details.map((detail) => (
                <div key={detail.label} className="border-rule border-t pt-5">
                  <dt className="text-muted text-[10.5px] tracking-[0.14em] uppercase">
                    {detail.label}
                  </dt>
                  <dd className="text-ink mt-2 leading-relaxed font-medium">
                    {detail.value.split("\n").map((line, i) => (
                      <span key={line} className="block">
                        {detail.hrefs ? (
                          <a
                            href={detail.hrefs[i]}
                            className="hover:text-indigo tabular-nums transition-colors duration-300"
                          >
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
