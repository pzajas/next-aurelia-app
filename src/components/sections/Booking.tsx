"use client";

import CinematicSurface from "@/components/CinematicSurface";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { media } from "@/lib/media";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Booking() {
  const { t, copy } = useLocale();
  const headline = copy.booking.headline.map((line) => t(line));

  return (
    <CinematicSurface intenseGrain className="bg-black pt-24 pb-32 md:py-36">
      <div className="mx-auto max-w-5xl px-4 md:hidden">
        <div className="relative min-h-[84svh] overflow-hidden bg-black">
          <Image
            src={media.gallery[2].src}
            alt={t(copy.booking.cta)}
            fill
            loading="lazy"
            className="object-cover grayscale opacity-70"
            style={{ objectPosition: "66% 52%" }}
            sizes="100vw"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-[62%] bg-black/72"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-[62%] w-16 bg-gradient-to-r from-black/62 to-transparent"
            aria-hidden
          />

          <div className="absolute inset-y-0 left-0 z-20 flex w-[64%] flex-col justify-center px-4 py-8">
            <div className="mb-6 h-16 w-px bg-white/25" aria-hidden />
            <p className="font-sans text-[9px] uppercase tracking-[0.35em] text-neutral-500">
              {t(copy.booking.label)}
            </p>

            <div className="mt-3 font-serif text-[clamp(2.05rem,9.3vw,3.2rem)] font-light leading-tight text-white">
              {headline.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.8 }}
                  className="overflow-visible"
                >
                  {line}
                </motion.div>
              ))}
            </div>

            <p className="mt-8 font-sans text-[9px] uppercase tracking-[0.35em] text-neutral-500">
              {t(copy.booking.availability)}
            </p>

            <div className="mt-12">
              <button
                type="button"
                data-testid="button-book-consultation"
                data-cursor-cta
                className="group inline-flex cursor-pointer items-center gap-3 text-left"
              >
                <span className="border-b border-white/30 pb-1 text-xs font-sans uppercase tracking-[0.2em] text-white">
                  {t(copy.booking.cta)}
                </span>
                <span className="pt-[2px] font-sans text-[12px] text-white/55 transition-transform duration-500 group-hover:translate-x-[3px]">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden max-w-5xl items-center gap-16 px-4 md:grid md:grid-cols-2 md:px-10">
        <div>
          <div className="mb-8 text-[12px] font-sans uppercase tracking-[0.5em] text-white/40">
            {t(copy.booking.label)}
          </div>
          <div className="font-serif text-[clamp(2.8rem,6vw,6.5rem)] font-light leading-none text-white">
            {headline.map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="overflow-hidden"
              >
                {line}
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-[12px] font-sans uppercase tracking-[0.2em] text-white/40">
            {t(copy.booking.availability)}
          </div>
          <div className="mt-10">
            <button
              type="button"
              data-testid="button-book-consultation"
              data-cursor-cta
              className="inline-flex cursor-pointer flex-col gap-1 text-left"
            >
              <span className="text-[12px] font-sans uppercase tracking-[0.35em] text-white">
                {t(copy.booking.cta)}
              </span>
              <div className="mt-1 h-px w-full bg-white/20" />
            </button>
          </div>
        </div>

        <div className="relative hidden w-full aspect-[3/4] md:block">
          <Image
            src={media.gallery[2].src}
            alt={t(copy.booking.cta)}
            fill
            loading="lazy"
            className="object-cover grayscale opacity-60"
            sizes="50vw"
          />
        </div>
      </div>
    </CinematicSurface>
  );
}
