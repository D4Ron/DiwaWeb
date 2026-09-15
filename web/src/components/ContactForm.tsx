"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "sent" : "error");
      if (res.ok) event.currentTarget.reset();
    } catch {
      setState("error");
    }
  }

  const field =
    "border-rule bg-paper text-ink w-full rounded-lg border px-4 py-3 text-[15px] transition-colors duration-300 focus:border-indigo focus:outline-none";
  const label = "text-ink mb-1.5 block text-[13px] font-semibold";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate={false}>
      <div>
        <label htmlFor="name" className={label}>
          {t("name")}
        </label>
        <input id="name" name="name" required autoComplete="name" className={field} />
      </div>

      <div>
        <label htmlFor="email" className={label}>
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="subject" className={label}>
          {t("subject")}
        </label>
        <select id="subject" name="subject" className={field}>
          <option>{t("subjectQuote")}</option>
          <option>{t("subjectGeneral")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className={`${field} resize-y`}
        />
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
          <span className="text-works-green font-medium">{t("success")}</span>
        ) : state === "error" ? (
          <span className="font-medium text-red-700">{t("error")}</span>
        ) : null}
      </p>
    </form>
  );
}
