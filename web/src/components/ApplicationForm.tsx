"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type State = "idle" | "sending" | "sent" | "error";

const FIELDS = ["hr", "finance", "it", "marketing", "sales", "legal", "logistics", "engineering", "admin", "other"] as const;
const LEVELS = ["junior", "confirmed", "senior", "expert"] as const;

// Matches MAX_ATTACHMENT_BYTES in src/lib/mailer.ts. Microsoft Graph carries
// attachments inline and caps the request at 4 MB; base64 inflates by a third.
const MAX_CV_BYTES = 3 * 1024 * 1024;

export function ApplicationForm() {
  const t = useTranslations("spontaneous");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const cv = (form.elements.namedItem("cv") as HTMLInputElement)?.files?.[0];
    if (cv && cv.size > MAX_CV_BYTES) {
      setState("error");
      setMessage(t("errorSize"));
      return;
    }

    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/application", {
        method: "POST",
        body: new FormData(form),
      });
      if (res.ok) {
        setState("sent");
        setMessage(t("success"));
        form.reset();
      } else {
        setState("error");
        setMessage(t("error"));
      }
    } catch {
      setState("error");
      setMessage(t("error"));
    }
  }

  const field =
    "border-rule bg-paper text-ink w-full rounded-lg border px-4 py-3 text-[15px] transition-colors duration-300 focus:border-indigo focus:outline-none";
  const label = "text-ink mb-1.5 block text-[13px] font-semibold";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={label}>
            {t("firstName")} *
          </label>
          <input id="firstName" name="firstName" required autoComplete="given-name" className={field} />
        </div>
        <div>
          <label htmlFor="lastName" className={label}>
            {t("lastName")} *
          </label>
          <input id="lastName" name="lastName" required autoComplete="family-name" className={field} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>
            {t("email")} *
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            {t("phone")} *
          </label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className={field} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="field" className={label}>
            {t("field")} *
          </label>
          <select id="field" name="field" required defaultValue="" className={field}>
            <option value="" disabled>
              {t("fieldPlaceholder")}
            </option>
            {FIELDS.map((f) => (
              <option key={f} value={t(`fields.${f}`)}>
                {t(`fields.${f}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className={label}>
            {t("level")} *
          </label>
          <select id="level" name="level" required defaultValue="" className={field}>
            <option value="" disabled>
              {t("levelPlaceholder")}
            </option>
            {LEVELS.map((l) => (
              <option key={l} value={t(`levels.${l}`)}>
                {t(`levels.${l}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="motivation" className={label}>
          {t("motivation")} *
        </label>
        <textarea id="motivation" name="motivation" rows={6} required className={`${field} resize-y`} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cv" className={label}>
            {t("cv")} *
          </label>
          <input
            id="cv"
            name="cv"
            type="file"
            accept="application/pdf"
            required
            className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-indigo-soft file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-indigo`}
          />
          <p className="text-muted mt-1.5 text-[12.5px]">{t("cvHint")}</p>
        </div>
        <div>
          <label htmlFor="letter" className={label}>
            {t("letter")}
          </label>
          <input
            id="letter"
            name="letter"
            type="file"
            accept="application/pdf"
            className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-indigo-soft file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-indigo`}
          />
        </div>
      </div>

      {/* Honeypot — hidden from people, filled in by most bots. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="bg-indigo hover:bg-indigo-deep mt-1 inline-flex w-fit rounded-lg px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-[450ms] ease-[var(--ease-soft)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {state === "sending" ? t("sending") : t("send")}
      </button>

      <p aria-live="polite" className="min-h-6 text-[14.5px]">
        {state === "sent" ? (
          <span className="text-works-green font-medium">{message}</span>
        ) : state === "error" ? (
          <span className="font-medium text-red-700">{message}</span>
        ) : null}
      </p>
    </form>
  );
}
