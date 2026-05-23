"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import heroImg from "@/assets/hero.png";
import { useIntroReveal } from "@/lib/intro/IntroRevealContext";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const HERO_EASE = [0.22, 1, 0.36, 1] as const;
const HERO_EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Jedna ścieżka animacji — po intro i przy zwykłym wejściu */
const HERO_ENTRANCE = {
  image: { duration: 2.8, fromScale: 1.06 },
  edition: { delay: 0, duration: 0.5 },
  title: { delay: 0.5, duration: 1.2 },
  tagline: { delay: 0.8, duration: 1.2 },
  subtitle: { delay: 1, duration: 1.1 },
  appointment: { delay: 1.2, duration: 0.8 },
} as const;

export default function Hero() {
  const { t, copy } = useLocale();
  const { deferHeroEntrance } = useIntroReveal();
  const [mediaReady, setMediaReady] = useState(false);
  const revealed = !deferHeroEntrance;
  const runImageMotion = revealed && mediaReady;

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black -mt-[58px]"
    >
      <div
        className={cn(
          "absolute inset-0 origin-center will-change-transform",
          "[backface-visibility:hidden]",
          "motion-reduce:transition-none"
        )}
        style={{
          transform: runImageMotion
            ? "scale(1) translateZ(0)"
            : `scale(${HERO_ENTRANCE.image.fromScale}) translateZ(0)`,
          transitionProperty: "transform",
          transitionDuration: runImageMotion
            ? `${HERO_ENTRANCE.image.duration}s`
            : "0s",
          transitionTimingFunction: HERO_EASE_CSS,
        }}
      >
        <Image
          src={heroImg}
          alt="Aurelia"
          fill
          priority
          fetchPriority="high"
          className="object-cover grayscale opacity-90"
          sizes="1200px"
          onLoadingComplete={() => setMediaReady(true)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 z-10" />

      <div className="absolute bottom-0 left-0 right-0 z-20 px-8 md:px-16 pb-12 md:pb-20 pt-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{
            delay: revealed ? HERO_ENTRANCE.edition.delay : 0,
            duration: HERO_ENTRANCE.edition.duration,
            ease: HERO_EASE,
          }}
          className="text-[9px] font-sans uppercase text-white/50 mb-4"
        >
          {t(copy.hero.edition)}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 30 }}
          transition={{
            delay: revealed ? HERO_ENTRANCE.title.delay : 0,
            duration: HERO_ENTRANCE.title.duration,
            ease: HERO_EASE,
          }}
          className="font-serif text-[clamp(4.5rem,18vw,9rem)] font-light leading-none text-white"
        >
          AURELIA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 30 }}
          transition={{
            delay: revealed ? HERO_ENTRANCE.tagline.delay : 0,
            duration: HERO_ENTRANCE.tagline.duration,
            ease: HERO_EASE,
          }}
          className="font-serif italic text-[clamp(1.2rem,2.5vw,2rem)] text-white/80 mt-3"
        >
          {t(copy.hero.tagline)}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
          transition={{
            delay: revealed ? HERO_ENTRANCE.subtitle.delay : 0,
            duration: HERO_ENTRANCE.subtitle.duration,
            ease: HERO_EASE,
          }}
          className="text-[8px] font-sans uppercase tracking-[0.45em] text-white/45 mt-4"
        >
          {t(copy.hero.subtitle)}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{
          delay: revealed ? HERO_ENTRANCE.appointment.delay : 0,
          duration: HERO_ENTRANCE.appointment.duration,
          ease: HERO_EASE,
        }}
        className="absolute bottom-8 right-8 z-20 hidden md:block text-[8px] font-sans uppercase text-white/40"
      >
        {t(copy.hero.appointmentOnly)}
      </motion.div>
    </section>
  );
}
