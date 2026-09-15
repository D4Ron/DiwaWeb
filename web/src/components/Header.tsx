"use client";

import { Img as Image } from "@/components/Img";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Child = {
  href:
    | "/careers"
    | "/careers/offers"
    | "/careers/spontaneous-application"
    | "/bons-plans";
  key: string;
};

type Item = {
  href:
    | "/about"
    | "/products-services"
    | "/sustainability"
    | "/careers"
    | "/news";
  key: string;
  children?: Child[];
};

const LINKS: Item[] = [
  { href: "/products-services", key: "products" },
  { href: "/sustainability", key: "sustainability" },
  { href: "/about", key: "about" },
  {
    href: "/careers",
    key: "careers",
    children: [
      { href: "/careers", key: "careersOverview" },
      { href: "/careers/offers", key: "offers" },
      { href: "/careers/spontaneous-application", key: "spontaneous" },
      { href: "/bons-plans", key: "bonsPlans" },
    ],
  },
  { href: "/news", key: "news" },
];

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Escape closes the dropdown, for keyboard users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdown(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // A short close delay keeps the menu usable while the pointer crosses the
  // gap between the trigger and the panel.
  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdown(key);
  };
  const closeMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDropdown(null), 160);
  };

  return (
    <header className="border-rule bg-paper/92 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1180px] items-center justify-between gap-6 px-6 sm:px-10">
        <Link
          href="/"
          className="flex flex-none items-center"
          aria-label="Diwa Industries"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/brand/diwa-logo.png"
            alt="Diwa Industries"
            width={340}
            height={220}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) =>
            link.children ? (
              <div
                key={link.key}
                className="relative"
                onMouseEnter={() => openMenu(link.key)}
                onMouseLeave={closeMenu}
              >
                <button
                  type="button"
                  aria-expanded={dropdown === link.key}
                  aria-haspopup="true"
                  onClick={() =>
                    setDropdown(dropdown === link.key ? null : link.key)
                  }
                  className="text-ink-2 hover:text-indigo hover:bg-indigo-soft flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[14.5px] font-medium transition-colors duration-300"
                >
                  {t(link.key)}
                  <span
                    aria-hidden
                    className={`text-[9px] transition-transform duration-300 ${
                      dropdown === link.key ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {dropdown === link.key ? (
                  <div className="border-rule bg-paper absolute top-full left-0 mt-1 w-64 overflow-hidden rounded-xl border shadow-[0_18px_40px_-18px_rgba(26,26,61,0.35)]">
                    {link.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setDropdown(null)}
                        className="text-ink-2 hover:text-indigo hover:bg-indigo-soft block px-4 py-3 text-[14.5px] font-medium transition-colors duration-200"
                      >
                        {t(child.key)}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                className="text-ink-2 hover:text-indigo hover:bg-indigo-soft rounded-lg px-3.5 py-2 text-[14.5px] font-medium transition-colors duration-300"
              >
                {t(link.key)}
              </Link>
            ),
          )}
        </nav>

        <div className="flex flex-none items-center gap-3">
          <div
            className="border-rule flex items-center gap-0.5 rounded-lg border p-0.5"
            role="group"
            aria-label={t("language")}
          >
            {routing.locales.map((loc) => {
              const active = loc === locale;
              return (
                <button
                  key={loc}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() =>
                    router.replace(
                      // @ts-expect-error -- pathname is a known route at runtime
                      pathname,
                      { locale: loc },
                    )
                  }
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase transition-colors duration-300 ${
                    active
                      ? "bg-indigo text-white"
                      : "text-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>

          <Link
            href="/contact"
            className="bg-indigo hover:bg-indigo-deep hidden rounded-lg px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors duration-300 sm:inline-flex"
          >
            {t("contact")}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t("menu")}
            className="border-rule text-ink flex h-10 w-10 items-center justify-center rounded-lg border lg:hidden"
          >
            <span aria-hidden className="text-lg leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-rule bg-paper border-t lg:hidden">
          <div className="mx-auto flex max-w-[1180px] flex-col px-6 py-3 sm:px-10">
            {LINKS.map((link) => (
              <div key={link.key} className="border-rule/60 border-b">
                {link.children ? (
                  <>
                    <p className="text-muted pt-3.5 pb-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
                      {t(link.key)}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="text-ink-2 hover:text-indigo block py-2.5 pl-3 text-[15px] font-medium"
                      >
                        {t(child.key)}
                      </Link>
                    ))}
                    <div className="pb-2" />
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-ink-2 hover:text-indigo block py-3.5 text-[15px] font-medium"
                  >
                    {t(link.key)}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-ink-2 hover:text-indigo py-3.5 text-[15px] font-medium"
            >
              {t("contact")}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
