"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import gallery2 from "@/assets/gallery-2.png";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function Booking() {
  const { t, copy } = useLocale();
  const headline = copy.booking.headline.map((line) => t(line));

  return (
    <section className="bg-[#0C0B0A] py-28 md:py-36 px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-[8px] font-sans uppercase tracking-[0.5em] text-white/40 mb-8">
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

          <div className="mt-8 text-[9px] font-sans uppercase text-white/40 tracking-[0.2em]">
            {t(copy.booking.availability)}
          </div>

          <div className="mt-10">
            <button
              type="button"
              data-testid="button-book-consultation"
              className="inline-flex flex-col gap-1 cursor-pointer group text-left"
            >
              <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-white">
                {t(copy.booking.cta)}
              </span>
              <div className="h-px bg-white/20 w-full mt-1 group-hover:bg-white/60 transition-colors duration-400" />
            </button>
          </div>
        </div>

        <div className="hidden md:block relative w-full aspect-[3/4]">
          <Image
            src={gallery2}
            alt={t(copy.booking.cta)}
            fill
            className="object-cover grayscale opacity-60"
            sizes="50vw"
          />
        </div>
      </div>
    </section>
  );
}
