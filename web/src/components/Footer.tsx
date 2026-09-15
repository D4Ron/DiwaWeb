import { Img as Image } from "@/components/Img";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const products = await getTranslations("products");

  return (
    <footer className="bg-navy text-white/65">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-16 sm:px-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          {/* Dedicated white artwork, so the mark keeps its shape on navy
              without the brightness/invert filter the flat PNG needed. */}
          <Image
            src="/images/brand/diwa-logo-white.png"
            alt="Diwa Industries"
            width={340}
            height={220}
            className="h-12 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            {t("address")}
          </p>
          <nav className="mt-7 flex flex-col gap-2.5 text-sm">
            {(
              [
                { href: "/products-services", label: nav("products") },
                { href: "/sustainability", label: nav("sustainability") },
                { href: "/about", label: nav("about") },
                { href: "/careers", label: nav("careers") },
                { href: "/news", label: nav("news") },
                { href: "/contact", label: nav("contact") },
              ] as const
            ).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors duration-300 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="mb-4 text-[11px] font-semibold tracking-[0.14em] text-white uppercase">
            {t("productsHeading")}
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm leading-relaxed">
            <li>{products("manufacturing.title")}</li>
            <li>{products("requalification.title")}</li>
            <li>{products("co2.title")}</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-[11px] font-semibold tracking-[0.14em] text-white uppercase">
            {t("contactHeading")}
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[t("phone"), t("phone2"), t("phone3")].map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="tabular-nums transition-colors duration-300 hover:text-white"
                >
                  {phone}
                </a>
              </li>
            ))}
            {[t("email"), t("email2")].map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  className="break-all transition-colors duration-300 hover:text-white"
                >
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1180px] px-6 py-6 text-xs sm:px-10">
          © {new Date().getFullYear()} Diwa Industries SA. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
