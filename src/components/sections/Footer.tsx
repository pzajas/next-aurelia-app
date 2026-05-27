"use client";

import Link from "next/link";
import CinematicSurface from "@/components/CinematicSurface";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const leftLinks = [
  { key: "atelier" as const, href: "#atelier" },
  { key: "journal" as const, href: "#journal" },
  { key: "disciplines" as const, href: "#services" },
];

const rightLinks = [
  { key: "archive" as const, href: "#works" },
  { key: "stories" as const, href: "#opinie" },
  { key: "contact" as const, href: "#contact" },
];

function FooterNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-block whitespace-nowrap py-1 text-[9px] font-sans uppercase tracking-[0.38em] text-white/42",
        "transition-[color,letter-spacing] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:text-white/78 hover:tracking-[0.44em]"
      )}
    >
      {label}
      <span
        className="pointer-events-none absolute -bottom-2 left-0 h-px w-full origin-center scale-x-0 bg-white/18 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        aria-hidden
      >
        <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_8px_rgba(255,255,255,0.85)] transition-opacity duration-500 group-hover:opacity-100" />
      </span>
    </Link>
  );
}

export default function Footer() {
  const { t, copy } = useLocale();

  const cities = [
    t(copy.footer.cityParis),
    t(copy.footer.cityMayfair),
    t(copy.footer.cityNewYork),
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CinematicSurface
      as="footer"
      intenseGrain
      className="z-[2] text-white"
      contentClassName="mx-auto max-w-6xl px-8 pb-10 pt-16 md:px-12 md:pb-12 md:pt-20 md:pr-14 relative before:absolute before:top-0 before:left-1/4 before:w-1/2 before:h-px before:bg-white/10"
    >
      <div className="relative md:pr-10">
        <button
          type="button"
          onClick={scrollToTop}
          className={cn(
            "absolute right-0 top-[4.25rem] bottom-0 z-10 my-auto hidden h-fit cursor-pointer md:top-[4.75rem] md:flex",
            "flex-col items-center gap-1.5 text-[7px] font-sans uppercase tracking-[0.38em] text-white/26",
            "transition-colors duration-500 hover:text-white/52"
          )}
          aria-label={t(copy.footer.backToTop)}
        >
          <span className="text-[8px] leading-none text-white/36">↑</span>
          <span className="[writing-mode:vertical-rl] rotate-180">
            {t(copy.footer.backToTop)}
          </span>
          <span className="mt-0.5 h-8 w-px bg-white/12" aria-hidden />
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-10 lg:gap-x-14">
          <nav
            className="order-2 flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-3 md:order-1 md:justify-end md:gap-x-8 lg:gap-x-10"
            aria-label="Footer navigation left"
          >
            {leftLinks.map((item) => (
              <FooterNavLink
                key={item.key}
                href={item.href}
                label={t(copy.nav[item.key])}
              />
            ))}
          </nav>

          <div className="order-1 text-center md:order-2">
            <div className="font-serif text-[clamp(2.4rem,6vw,3.35rem)] font-light uppercase tracking-[0.18em] text-white/95">
              AURELIA
            </div>
          </div>

          <nav
            className="order-3 flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start md:gap-x-8 lg:gap-x-10"
            aria-label="Footer navigation right"
          >
            {rightLinks.map((item) => (
              <FooterNavLink
                key={item.key}
                href={item.href}
                label={t(copy.nav[item.key])}
              />
            ))}
          </nav>
        </div>

        <div className="mx-auto mt-4 flex max-w-md flex-col items-center text-center md:mt-5">
          <p className="text-[8px] font-sans uppercase leading-relaxed tracking-[0.42em] text-white/34">
            {t(copy.footer.tagline)}
          </p>
          <div
            className="mt-10 h-10 w-px bg-white/16 md:mt-12 md:h-12"
            aria-hidden
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[9px] font-sans uppercase tracking-[0.38em] text-white/38 md:mt-12">
            {cities.map((city, index) => (
              <span key={city} className="inline-flex items-center gap-3">
                {index > 0 && (
                  <span className="text-white/18" aria-hidden>
                    ·
                  </span>
                )}
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 md:mt-16" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 text-[8px] font-sans uppercase tracking-[0.28em] text-white/28 md:mt-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-8">
        <p className="text-center leading-relaxed md:text-left">
          {t(copy.footer.copyright)}
        </p>
        <div className="flex items-center justify-center gap-x-6">
          <Link
            href="#"
            className="tracking-[0.32em] text-white/32 transition-colors duration-500 hover:text-white/58"
          >
            {t(copy.footer.privacyPolicy)}
          </Link>
          <Link
            href="#"
            className="tracking-[0.32em] text-white/32 transition-colors duration-500 hover:text-white/58"
          >
            {t(copy.footer.terms)}
          </Link>
        </div>
        <div className="flex items-center justify-center gap-3 md:justify-end">
          <p className="tracking-[0.32em]">{t(copy.footer.credit)}</p>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/14 text-[10px] font-serif text-white/55"
            aria-hidden
          >
            A
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className="mt-10 flex w-full cursor-pointer items-center justify-center gap-2 text-[8px] font-sans uppercase tracking-[0.38em] text-white/28 transition-colors duration-500 hover:text-white/55 md:hidden"
      >
        <span>{t(copy.footer.backToTop)}</span>
        <span className="text-[10px] leading-none">↑</span>
      </button>
    </CinematicSurface>
  );
}
