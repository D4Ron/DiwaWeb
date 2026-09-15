import { Img as Image } from "@/components/Img";
import type { ReactNode } from "react";
import { Reveal } from "./Motion";

/** Page shell — one max width for the whole site. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1180px] px-6 sm:px-10 ${className}`}>
      {children}
    </div>
  );
}

/** The uppercase label that sits above section headings. */
export function Kicker({
  children,
  tone = "indigo",
}: {
  children: ReactNode;
  tone?: "indigo" | "white" | "green";
}) {
  const colour =
    tone === "white"
      ? "text-white/65"
      : tone === "green"
        ? "text-works-green"
        : "text-indigo";

  return (
    <p
      className={`mb-3 text-[11px] font-semibold tracking-[0.17em] uppercase ${colour}`}
    >
      {children}
    </p>
  );
}

/** Section heading with the growing indigo rule beneath it. */
export function SectionHead({
  kicker,
  title,
  lead,
  tone = "indigo",
  align = "left",
}: {
  kicker?: string;
  title: string;
  lead?: string;
  tone?: "indigo" | "white" | "green";
  align?: "left" | "center";
}) {
  const centred = align === "center";

  return (
    <Reveal className={centred ? "text-center" : undefined}>
      {kicker ? <Kicker tone={tone}>{kicker}</Kicker> : null}
      <h2 className={tone === "white" ? "text-white" : undefined}>{title}</h2>
      <div
        className={`animate-rule mt-6 h-[3px] w-14 rounded-full ${
          tone === "white" ? "bg-white/70" : "bg-indigo"
        } ${centred ? "mx-auto" : ""}`}
      />
      {lead ? (
        <p
          className={`mt-6 max-w-[68ch] text-lg leading-relaxed ${
            centred ? "mx-auto" : ""
          } ${tone === "white" ? "text-white/80" : "text-muted"}`}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

/**
 * Inner-page hero. Shorter than the homepage's, and static rather than
 * rotating — the video slot belongs to the landing page alone.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  image: string;
}) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
        <div className="from-navy/95 via-navy/85 to-navy/50 absolute inset-0 bg-gradient-to-r" />
      </div>

      <Container className="relative z-10 py-24 sm:py-32">
        <p className="animate-rise-sm mb-5 text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase [animation-delay:100ms]">
          {eyebrow}
        </p>
        <h1 className="max-w-[17ch] text-[clamp(34px,4.6vw,58px)] leading-[1.06] text-white [animation-delay:280ms] motion-safe:animate-[diwa-rise_1600ms_var(--ease-soft)_both]">
          {title}
        </h1>
        <div className="animate-rule bg-indigo-light mt-7 h-[3px] w-16 rounded-full [animation-delay:800ms]" />
        {lead ? (
          <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-white/80 [animation-delay:520ms] motion-safe:animate-[diwa-rise_1600ms_var(--ease-soft)_both]">
            {lead}
          </p>
        ) : null}
      </Container>
    </header>
  );
}

/** Image card used for products and news. */
export function MediaCard({
  image,
  title,
  body,
  meta,
  cta,
  href,
}: {
  image: string;
  title: string;
  body: string;
  meta?: string;
  cta?: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt=""
          width={900}
          height={675}
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-soft)] group-hover:scale-107"
        />
      </div>
      <div className="flex flex-1 flex-col p-7">
        {meta ? (
          <p className="text-muted mb-2 text-[11px] tracking-[0.12em] uppercase">
            {meta}
          </p>
        ) : null}
        <h3>{title}</h3>
        <p className="text-muted mt-3 flex-1 text-[15px] leading-relaxed">
          {body}
        </p>
        {cta ? (
          <span className="text-indigo mt-5 text-sm font-semibold">
            {cta} →
          </span>
        ) : null}
      </div>
    </>
  );

  const shell =
    "group border-rule bg-paper flex h-full flex-col overflow-hidden rounded-2xl border transition-[transform,box-shadow] duration-[550ms] ease-[var(--ease-soft)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-26px_rgba(26,26,61,0.42)]";

  return href ? (
    <a href={href} className={shell}>
      {inner}
    </a>
  ) : (
    <article className={shell}>{inner}</article>
  );
}

/** Primary / ghost buttons. */
export function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost" | "white";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-indigo text-white hover:bg-indigo-deep hover:shadow-[0_14px_30px_-12px_rgba(93,91,157,0.7)]",
    ghost: "border border-white/30 text-white hover:bg-white/10",
    white:
      "bg-white text-indigo hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.45)]",
  }[variant];

  return (
    <a
      href={href}
      className={`inline-flex items-center rounded-lg px-7 py-3.5 text-[15px] font-semibold transition-all duration-[450ms] ease-[var(--ease-soft)] hover:-translate-y-0.5 ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

/** Tick list used for certifications, benefits and guarantees. */
export function TickList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-snug">
          <span aria-hidden className="text-works-green flex-none">
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
