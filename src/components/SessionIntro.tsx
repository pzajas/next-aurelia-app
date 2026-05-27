"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useIntroReveal } from "@/lib/intro/IntroRevealContext";

const STORAGE_KEY = "aurelia:intro-seen";
const EASE = [0.22, 1, 0.36, 1] as const;
const INTRO_MS = 4200;
const EXIT_MS = 900;

const BRAND = "AURELIA";

function IntroCorners() {
  const line = "block bg-white/75";
  const motionProps = {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 1, ease: EASE, delay: 0.15 },
  };

  return (
    <>
      <motion.div
        {...motionProps}
        className="pointer-events-none absolute left-6 top-6 md:left-10 md:top-10"
        aria-hidden
      >
        <span className={`${line} h-px w-6`} />
        <span className={`${line} h-6 w-px`} />
      </motion.div>
      <motion.div
        {...motionProps}
        className="pointer-events-none absolute bottom-6 right-6 flex flex-col items-end md:bottom-10 md:right-10"
        aria-hidden
      >
        <span className={`${line} h-6 w-px`} />
        <span className={`${line} h-px w-6`} />
      </motion.div>
    </>
  );
}

export default function SessionIntro() {
  const { t, copy } = useLocale();
  const { revealHero } = useIntroReveal();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const exitingRef = useRef(false);
  const finishRef = useRef<() => void>(() => {});

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    document.documentElement.style.overflow = "";
    document.documentElement.style.scrollbarGutter = "";
    setActive(false);
    setExiting(false);
    exitingRef.current = false;
  }, []);

  useEffect(() => {
    exitingRef.current = exiting;
  }, [exiting]);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }

    if (seen || document.documentElement.dataset.intro !== "1") {
      document.documentElement.removeAttribute("data-intro");
      return;
    }

    if (reduceMotion) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode */
      }
      revealHero({ immediate: true });
      document.documentElement.removeAttribute("data-intro");
      return;
    }

    setActive(true);
  }, [reduceMotion, revealHero]);

  useEffect(() => {
    if (!active) return;

    finishRef.current = finishIntro;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "stable";

    const beginExit = () => {
      document.documentElement.removeAttribute("data-intro");
      exitingRef.current = true;
      setExiting(true);
      revealHero();
    };

    const exitTimer = window.setTimeout(beginExit, INTRO_MS - EXIT_MS);
    const fallbackTimer = window.setTimeout(finishIntro, INTRO_MS + 400);

    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      const next = Math.min(
        100,
        Math.round((elapsed / (INTRO_MS - EXIT_MS)) * 100)
      );
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(fallbackTimer);
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollbarGutter = "";
    };
  }, [active, finishIntro, revealHero]);

  if (!active) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key="session-intro"
        role="status"
        aria-live="polite"
        aria-label={t(copy.intro.sequence)}
        initial={{ y: 0 }}
        animate={exiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: EXIT_MS / 1000, ease: EASE }}
        onAnimationComplete={() => {
          if (exitingRef.current) finishRef.current();
        }}
        className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
      >
        <div
          aria-hidden
          className="testimonial-grain pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay"
        />

        <IntroCorners />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          className="absolute left-6 top-6 font-sans text-[8px] uppercase tracking-[0.48em] text-white/28 md:left-10 md:top-10"
        >
          {t(copy.intro.sequence)}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
          className="absolute right-6 top-6 font-sans text-[8px] tabular-nums tracking-[0.32em] text-white/32 md:right-10 md:top-10"
          aria-hidden
        >
          {String(progress).padStart(3, "0")}
        </motion.p>

        <div className="relative flex flex-col items-center px-8 text-center">
          <motion.div
            className="mb-10 flex w-[min(72vw,320px)] items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
            aria-hidden
          >
            <motion.span
              className="h-px flex-1 bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 1.1, ease: EASE }}
              style={{ transformOrigin: "right center" }}
            />
            <span className="font-sans text-[7px] uppercase tracking-[0.55em] text-white/35">
              {t(copy.hero.edition)}
            </span>
            <motion.span
              className="h-px flex-1 bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 1.1, ease: EASE }}
              style={{ transformOrigin: "left center" }}
            />
          </motion.div>

          <motion.div
            className="mb-2 flex overflow-hidden"
            aria-hidden
          >
            <motion.span
              className="mx-auto block h-12 w-px bg-white/25 md:h-16"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.45, duration: 1.2, ease: EASE }}
              style={{ transformOrigin: "top center" }}
            />
          </motion.div>

          <h1
            className="flex font-serif text-[clamp(2.75rem,11vw,5.5rem)] font-light leading-none tracking-[0.18em] text-white"
            aria-label={BRAND}
          >
            {BRAND.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                className="inline-block"
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.52 + index * 0.07,
                  duration: 0.95,
                  ease: EASE,
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 1, ease: EASE }}
            className="mt-5 font-serif text-[clamp(1rem,2.4vw,1.35rem)] font-light italic text-white/72"
          >
            {t(copy.hero.tagline)}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.9, ease: EASE }}
            className="mt-3 font-sans text-[8px] uppercase tracking-[0.46em] text-white/38"
          >
            {t(copy.intro.atelier)}
          </motion.p>
        </div>

        <div className="absolute bottom-10 left-1/2 w-[min(76vw,360px)] -translate-x-1/2 md:bottom-14">
          <motion.div
            className="h-px w-full origin-left bg-white/12"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 2.6, ease: EASE }}
            aria-hidden
          />
          <motion.div
            className="absolute inset-y-0 left-0 h-px origin-left bg-white/55"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.12, ease: "linear" }}
            aria-hidden
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease: EASE }}
          className="absolute bottom-6 font-sans text-[7px] uppercase tracking-[0.5em] text-white/22 md:bottom-8"
          aria-hidden
        >
          {t(copy.gallery.volume)}
        </motion.p>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
