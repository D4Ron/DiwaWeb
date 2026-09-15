"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Bons Plans — layout ported one-to-one from kapiconsult.tg/bons-plans.
 *
 * The visual design, colours and typography are Kapi's, because the brief was
 * to reproduce the page. The copy, however, now comes from the message files
 * so the page switches with the locale like every other page on the site.
 *
 * Everything Kapi-specific is scoped under `.bp-scope` so none of it leaks
 * into the rest of the site: the gold/deep-blue variables, the Playfair
 * display face and the card styles all stop at this component's boundary.
 */

const POSTERS = [
  { key: "p1", src: "/images/bons-plans/zencard_pub2.jpg" },
  { key: "p2", src: "/images/bons-plans/zencard_pub3.jpg" },
  { key: "p3", src: "/images/bons-plans/zencard_pub5.jpg" },
  { key: "p4", src: "/images/bons-plans/zencard_pub6.jpg" },
  { key: "p5", src: "/images/bons-plans/zencard_pub7.jpg" },
  { key: "p6", src: "/images/bons-plans/zencard_pub5b.jpg" },
  { key: "p7", src: "/images/bons-plans/zencard_pub6b.jpg" },
  { key: "p8", src: "/images/bons-plans/zencard_product.jpg" },
] as const;

export function BonsPlans({ contactHref }: { contactHref: string }) {
  const t = useTranslations("bonsPlans");
  const [zencard, setZencard] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(
    null,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setZencard(false);
      setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll while a modal is open.
  useEffect(() => {
    const locked = zencard || lightbox !== null;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zencard, lightbox]);

  return (
    <div className="bp-scope">
      {/* ---------------------------- hero ---------------------------- */}
      <section className="bp-hero">
        <div className="bp-orb bp-orb-1" />
        <div className="bp-orb bp-orb-2" />

        <div className="bp-container bp-hero-in">
          <div className="bp-eyebrow">Diwa Industries</div>
          <h1 className="bp-title">
            {t("title")} <span className="bp-shimmer">{t("titleAnd")}</span>{" "}
            {t("titleTail")}
          </h1>
          <p className="bp-sub">{t("sub")}</p>

          <div className="bp-cta-wrap">
            <button
              type="button"
              onClick={() => setZencard(true)}
              className="bp-cta"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <path d="M2 10h20" />
              </svg>
              {t("topUp")}
            </button>
          </div>

          <div className="bp-stats">
            <div className="bp-stat">
              <div className="bp-stat-n">{POSTERS.length + 1}</div>
              <div className="bp-stat-l">{t("statOffers")}</div>
            </div>
            <div className="bp-stat-div" />
            <div className="bp-stat">
              <div className="bp-stat-n bp-stat-gold">ZenCard</div>
              <div className="bp-stat-l">{t("statCard")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- grid ---------------------------- */}
      <section className="bp-section">
        <div className="bp-container">
          <div className="bp-section-head">
            <span className="bp-tag">{t("sectionTag")}</span>
            <h2 className="bp-section-title">{t("sectionTitle")}</h2>
          </div>

          <div className="bp-grid">
            {POSTERS.map((poster, i) => {
              const title = t(`posters.${poster.key}`);
              return (
                <div
                  key={poster.key}
                  className="bp-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <button
                    type="button"
                    className="bp-card"
                    onClick={() => setLightbox({ src: poster.src, title })}
                    aria-label={t("enlargeAria", { title })}
                  >
                    <span className="bp-badge">{t("badge")}</span>
                    {/* Plain <img>: these are posters at their own aspect
                        ratio, and the card styling assumes an unwrapped image. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="bp-img"
                      src={poster.src}
                      alt={title}
                      loading="lazy"
                    />
                    <div className="bp-overlay">
                      <span className="bp-overlay-text">🔍 {t("enlarge")}</span>
                    </div>
                    <div className="bp-footer">
                      <span className="bp-name">{title}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--bp-blue-mid)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        aria-hidden
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              );
            })}

            <div
              className="bp-item"
              style={{ animationDelay: `${POSTERS.length * 0.05}s` }}
            >
              <div className="bp-text-card">
                <div className="bp-text-icon">💡</div>
                <span className="bp-text-badge">{t("tipBadge")}</span>
                <h3 className="bp-text-title">{t("tipTitle")}</h3>
                <p className="bp-text-body">{t("tipBody")}</p>
                <a
                  className="bp-text-link"
                  href="https://kapiconsult.tg/articles/formation-gratuite-maitrisez-excel-pour-les-rh-69b2408f8940d"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("tipLink")} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ ZenCard modal ------------------------ */}
      {zencard ? (
        <div
          className="bp-modal-bg"
          role="dialog"
          aria-modal="true"
          aria-label={t("modalTitle")}
          onClick={(e) => {
            if (e.target === e.currentTarget) setZencard(false);
          }}
        >
          <div className="bp-modal-box">
            <button
              type="button"
              className="bp-modal-close"
              onClick={() => setZencard(false)}
              aria-label={t("close")}
            >
              ✕
            </button>
            <div className="bp-modal-icon">💳</div>
            <h2 className="bp-modal-title">{t("modalTitle")}</h2>
            <p className="bp-modal-sub">{t("modalSub")}</p>
            <div className="bp-notice">
              <div className="bp-notice-icon">🚧</div>
              <div className="bp-notice-title">{t("modalNoticeTitle")}</div>
              <div className="bp-notice-body">{t("modalNoticeBody")}</div>
            </div>
            <div className="bp-modal-actions">
              <a href={contactHref} className="bp-modal-primary">
                📞 {t("modalContact")}
              </a>
              <button
                type="button"
                className="bp-modal-secondary"
                onClick={() => setZencard(false)}
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* -------------------------- lightbox --------------------------- */}
      {lightbox ? (
        <div
          className="bp-lb-bg"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightbox(null);
          }}
        >
          <div className="bp-lb-inner">
            <button
              type="button"
              className="bp-lb-close"
              onClick={() => setLightbox(null)}
              aria-label={t("close")}
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bp-lb-img" src={lightbox.src} alt={lightbox.title} />
            <div className="bp-lb-title">{lightbox.title}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
