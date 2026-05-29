"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { HERO_MOBILE_SIZES } from "@/lib/hero-image-preload";
import { useIntroReveal } from "@/lib/intro/IntroRevealContext";
import { runEditorialIntroExit } from "@/lib/intro/runEditorialIntroExit";
import { scrollPageToTop } from "@/lib/intro/scrollPageToTop";
import { media } from "@/lib/media";
import {
  INTRO_EASE,
  INTRO_HOLD_MS,
  INTRO_LINE_INSET_PX,
  TOTAL_INTRO_MS,
} from "@/lib/intro/timing";
import gsap from "gsap";

const STORAGE_KEY = "aurelia:intro-seen";
const BRAND = "AURELIA";

export default function SessionIntro() {
  const { t, copy } = useLocale();
  const { revealHeroImage, peekHeroUnderIntro } = useIntroReveal();
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const curtainRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitStartedRef = useRef(false);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    document.documentElement.style.overflow = "";
    document.documentElement.style.scrollbarGutter = "";
    document.documentElement.removeAttribute("data-intro-reveal");
    scrollPageToTop();
    timelineRef.current?.kill();
    timelineRef.current = null;
    setActive(false);
    exitStartedRef.current = false;
  }, []);

  const startExit = useCallback(() => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;

    const curtain = curtainRef.current;
    const content = contentRef.current;
    const meta = metaRef.current;
    const line = lineRef.current;

    if (!curtain || !content || !meta || !line) {
      document.documentElement.removeAttribute("data-intro");
      revealHeroImage({ immediate: true });
      finishIntro();
      return;
    }

    timelineRef.current = runEditorialIntroExit(
      { curtain, content, meta, line },
      {
        onRollUpStart: () => {
          document.documentElement.removeAttribute("data-intro");
          document.documentElement.setAttribute("data-intro-reveal", "1");
          stageRef.current?.classList.add("intro-stage--revealing");
          peekHeroUnderIntro();
        },
        onComplete: () => {
          revealHeroImage({ afterIntroComplete: true });
          requestAnimationFrame(() => {
            finishIntro();
          });
        },
      },
      Boolean(reduceMotion)
    );
  }, [finishIntro, reduceMotion, revealHeroImage, peekHeroUnderIntro]);

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
      revealHeroImage({ immediate: true });
      document.documentElement.removeAttribute("data-intro");
      return;
    }

    setActive(true);
    scrollPageToTop();
  }, [reduceMotion, revealHeroImage]);

  useEffect(() => {
    if (!active) return;

    const setFullWidth = () => {
      if (!curtainRef.current) return;
      const w = window.innerWidth;
      curtainRef.current.style.width = `${w}px`;
      curtainRef.current.style.maxWidth = `${w}px`;
    };

    const widthFrame = requestAnimationFrame(setFullWidth);
    window.addEventListener("resize", setFullWidth);

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "stable";

    const exitTimer = window.setTimeout(startExit, INTRO_HOLD_MS);
    const fallbackTimer = window.setTimeout(finishIntro, TOTAL_INTRO_MS);

    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      const next = Math.min(100, Math.round((elapsed / INTRO_HOLD_MS) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(widthFrame);
      window.removeEventListener("resize", setFullWidth);
      window.clearTimeout(exitTimer);
      window.clearTimeout(fallbackTimer);
      cancelAnimationFrame(frame);
      timelineRef.current?.kill();
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollbarGutter = "";
    };
  }, [active, finishIntro, startExit]);

  if (!active) return null;

  return createPortal(
    <div
      ref={stageRef}
      className="intro-stage fixed inset-0 z-[300]"
      aria-hidden={false}
    >
      <div className="intro-hero-peek" aria-hidden>
        <div className="intro-hero-peek-inner">
          <div className="intro-hero-peek-media">
            <Image
              src={media.hero.src}
              alt=""
              fill
              priority
              loading="eager"
              fetchPriority="high"
              quality={75}
              sizes={HERO_MOBILE_SIZES}
              className="intro-hero-peek-image md:hidden object-cover object-[60%_center] grayscale contrast-[1.06] brightness-[1.02]"
            />
            <Image
              src={media.hero.src}
              alt=""
              fill
              priority
              loading="eager"
              fetchPriority="high"
              quality={75}
              sizes={HERO_MOBILE_SIZES}
              className="intro-hero-peek-image hidden md:block object-contain object-[72%_center] grayscale contrast-[1.06] brightness-[1.02]"
            />
          </div>
        </div>
      </div>

      <div
        ref={curtainRef}
        role="status"
        aria-live="polite"
        aria-label={t(copy.intro.sequence)}
        className="intro-curtain relative mx-auto block h-full overflow-hidden bg-[#050505]"
      >
        <div className="intro-curtain-inner relative h-full min-h-0 overflow-hidden">
        <div
          aria-hidden
          className="testimonial-grain pointer-events-none absolute inset-0 z-[1] opacity-[0.045] mix-blend-overlay"
        />

        <div
          ref={lineRef}
          className="intro-reveal-line pointer-events-none absolute left-1/2 z-[12] w-px -translate-x-1/2"
          style={{
            top: INTRO_LINE_INSET_PX,
            bottom: INTRO_LINE_INSET_PX,
          }}
          aria-hidden
        />

        <div ref={metaRef} className="intro-meta absolute inset-0 z-[10]">
          <p className="absolute left-6 top-6 font-sans text-[12px] uppercase tracking-[0.48em] text-white/28 md:left-10 md:top-10">
            {t(copy.intro.sequence)}
          </p>

          <p
            className="absolute right-6 top-6 font-sans text-[12px] tabular-nums tracking-[0.32em] text-white/32 md:right-10 md:top-10"
            aria-hidden
          >
            {String(progress).padStart(3, "0")}
          </p>

          <div className="absolute bottom-10 left-1/2 w-[min(76vw,360px)] -translate-x-1/2 md:bottom-14">
            <div className="h-px w-full bg-white/12" aria-hidden />
            <div
              className="absolute inset-y-0 left-0 h-px origin-left bg-white/55"
              style={{ transform: `scaleX(${progress / 100})` }}
              aria-hidden
            />
          </div>

          <p
            className="absolute bottom-6 font-sans text-[12px] uppercase tracking-[0.5em] text-white/22 md:bottom-8"
            aria-hidden
          >
            {t(copy.gallery.volume)}
          </p>
        </div>

        <div
          ref={contentRef}
          className="intro-content relative z-[15] flex h-full flex-col items-center justify-center px-8 text-center"
        >
          <div className="flex flex-col items-center gap-10">
          <motion.div
            className="flex w-[min(72vw,320px)] items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6, ease: INTRO_EASE }}
            aria-hidden
          >
            <motion.span
              className="h-px flex-1 bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 1.1, ease: INTRO_EASE }}
              style={{ transformOrigin: "right center" }}
            />
            <span className="font-sans text-[12px] uppercase tracking-[0.55em] text-white/35">
              {t(copy.hero.edition)}
            </span>
            <motion.span
              className="h-px flex-1 bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 1.1, ease: INTRO_EASE }}
              style={{ transformOrigin: "left center" }}
            />
          </motion.div>

          <motion.div className="flex overflow-hidden" aria-hidden>
            <motion.span
              className="mx-auto block h-12 w-px bg-white/25 md:h-16"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.45, duration: 1.2, ease: INTRO_EASE }}
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
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.18 + index * 0.045,
                  duration: 0.75,
                  ease: INTRO_EASE,
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: INTRO_EASE }}
            className="mt-5 font-serif text-[clamp(1rem,2.4vw,1.35rem)] font-light italic text-white/72"
          >
            {t(copy.hero.tagline)}
          </motion.p>

          <motion.p
            initial={{ opacity: 1, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease: INTRO_EASE }}
            className="mt-3 font-sans text-[12px] uppercase tracking-[0.46em] text-white/38"
          >
            {t(copy.intro.atelier)}
          </motion.p>
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
