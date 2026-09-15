"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Motion system — Direction A.
 *
 *   entrance  1.25s, 18px travel, expo-out landing, staggered 140ms
 *   response  250-450ms  — hover, focus
 *   ambient   11-34s     — wave separators, hero drift
 *
 * Scroll reveals are CSS transitions gated on `html.js`, not a JS library
 * setting inline styles. That gate is the important part: without
 * JavaScript the `.reveal` rule never applies, so every section renders at
 * full opacity. Nothing is ever left invisible because a script failed —
 * which is the flaw in the reference site this design was measured against.
 */

/** Adds `.in` once the element has scrolled into view. Fires once. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the gate never applied (no JS is impossible here, but reduced
    // motion collapses the transition anyway) this is simply a no-op.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Seconds, to match the previous API. */
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Staggers direct children. Each child's delay comes from its index, so the
 * markup stays declarative and there is no orchestration state to hold.
 */
export function Stagger({
  children,
  className = "",
  step = 0.14,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`stagger ${className}`}
      style={{ ["--stagger-step" as string]: `${step}s` }}
    >
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`stagger-item ${className}`}>{children}</div>;
}

/**
 * Counts a production figure up when it enters view. The final value is
 * rendered on the server, so the number is correct in the HTML source and
 * for anyone who never runs the animation.
 */
export function CountUp({
  target,
  suffix = "",
  locale,
  duration = 2200,
}: {
  target: number;
  suffix?: string;
  locale: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start: number | null = null;

    const run = () => {
      const tick = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        // Matches the expo-out curve the entrances use.
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setValue(Math.round(target * eased));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setValue(0);
          run();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat(locale).format(value)}
      {suffix}
    </span>
  );
}

/**
 * Ambient marquee for the certification strip. What moves past is the
 * credibility argument, so this carries information rather than decoration.
 */
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="marquee group relative overflow-hidden">
      <div className="marquee-track flex w-max gap-10 group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-3 text-[11px] tracking-[0.14em] whitespace-nowrap text-white/55 uppercase"
          >
            <span aria-hidden className="bg-indigo-light h-1 w-1 rounded-full" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Stands in for the hero video loop until the real one is produced: a slow
 * crossfade across plant frames, paired with the CSS Ken Burns drift. The
 * first frame renders at full opacity server-side, so the hero is never
 * blank regardless of JavaScript.
 */
export function HeroRotator({
  images,
  interval = 7000,
}: {
  images: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval,
    );
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          fetchPriority={i === 0 ? "high" : "low"}
          className="animate-kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-[2600ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </>
  );
}
