"use client";

import {
  MANIFESTO_TEXT,
  getManifestoMotionScale,
  manifestoAttributionDelay,
  manifestoDividerDelay,
  manifestoQuoteDelay,
  manifestoTransition,
  scaledDuration,
  type ManifestoMotionScale,
} from "@/lib/manifesto-motion";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import {
  ScrollVelocityProvider,
  useScrollVelocityReveal,
} from "@/lib/useScrollVelocity";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

function SubtleReveal({
  children,
  delay,
  duration,
  className,
  active,
  driftY = MANIFESTO_TEXT.driftY,
  drift = true,
}: {
  children: ReactNode;
  delay: number;
  duration: number;
  className?: string;
  active: boolean;
  driftY?: number;
  drift?: boolean;
}) {
  const reduced = Boolean(useReducedMotion());
  const hidden = reduced
    ? { opacity: 0 }
    : drift
      ? { opacity: 0, y: driftY }
      : { opacity: 0 };
  const shown = reduced
    ? { opacity: 1 }
    : drift
      ? { opacity: 1, y: 0 }
      : { opacity: 1 };

  return (
    <motion.div
      initial={hidden}
      animate={active ? shown : hidden}
      transition={manifestoTransition(active ? delay : 0, duration, reduced)}
      className={cn("will-change-[transform,opacity]", className)}
    >
      {children}
    </motion.div>
  );
}

function ManifestoQuote({
  lines,
  active,
  scale,
}: {
  lines: string[];
  active: boolean;
  scale: ManifestoMotionScale;
}) {
  const reduced = Boolean(useReducedMotion());
  const hidden = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: MANIFESTO_TEXT.driftY };
  const shown = reduced ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.blockquote
      initial={hidden}
      animate={active ? shown : hidden}
      transition={manifestoTransition(
        active ? manifestoQuoteDelay(scale) : 0,
        scaledDuration(MANIFESTO_TEXT.quote.duration, scale),
        reduced
      )}
      className="font-serif text-[clamp(1.22rem,5.1vw,2.35rem)] font-light italic leading-[1.52] tracking-[0.01em] text-[rgb(255_255_255/0.9)] will-change-[transform,opacity] md:leading-[1.45]"
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </motion.blockquote>
  );
}

function ManifestoContent() {
  const { t, tLines, copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const sampleRevealVelocity = useScrollVelocityReveal();
  const reducedMotion = Boolean(useReducedMotion());
  const [entered, setEntered] = useState(false);
  const [lockedScale, setLockedScale] = useState<ManifestoMotionScale | null>(
    null
  );

  const quoteLines = tLines(copy.manifesto.lines);
  const scale =
    lockedScale ??
    getManifestoMotionScale(sampleRevealVelocity(), reducedMotion);

  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  useEffect(() => {
    if (!inView || lockedScale) return;
    setLockedScale(
      getManifestoMotionScale(sampleRevealVelocity(), reducedMotion)
    );
  }, [inView, lockedScale, sampleRevealVelocity, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="manifesto-section relative isolate overflow-hidden border-b border-white/10 bg-[#0a0a0a] editorial-whitespace-xl"
    >
      <div
        className="manifesto-diagonal-light pointer-events-none absolute inset-0 z-0"
        aria-hidden
      />

      <div
        className="manifesto-mobile-grain pointer-events-none absolute inset-0 z-[1] opacity-[0.04]"
        aria-hidden
      />

      <div className="relative z-[2] flex min-h-[88svh] flex-col justify-center px-6 py-28 md:min-h-0 md:px-10 md:py-32">
        <div className="mx-auto w-full max-w-[22rem] text-center md:max-w-3xl">
          <SubtleReveal
            delay={MANIFESTO_TEXT.label.delay}
            duration={scaledDuration(MANIFESTO_TEXT.label.duration, scale)}
            active={entered}
            driftY={MANIFESTO_TEXT.labelDriftY}
            className="mb-12 md:mb-16"
          >
            <p className="font-sans text-[9px] uppercase tracking-[0.42em] text-white/38 md:text-[12px] md:tracking-[0.4em]">
              {t(copy.manifesto.label)}
            </p>
          </SubtleReveal>

          <ManifestoQuote lines={quoteLines} active={entered} scale={scale} />

          <SubtleReveal
            delay={manifestoAttributionDelay(scale)}
            duration={scaledDuration(
              MANIFESTO_TEXT.attribution.duration,
              scale
            )}
            active={entered}
            drift={false}
            className="mt-14"
          >
            <p className="font-sans text-[9px] uppercase tracking-[0.34em] text-white/44 md:text-[12px] md:tracking-[0.3em]">
              {t(copy.manifesto.attribution)}
            </p>
          </SubtleReveal>

          <div className="mt-14 flex justify-center">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={
                entered
                  ? { opacity: MANIFESTO_TEXT.divider.opacity }
                  : { opacity: 0 }
              }
              transition={manifestoTransition(
                entered ? manifestoDividerDelay(scale) : 0,
                scaledDuration(MANIFESTO_TEXT.divider.duration, scale),
                reducedMotion
              )}
              className="h-px w-12 bg-white/22 will-change-[opacity]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DirectorManifesto() {
  return (
    <ScrollVelocityProvider>
      <ManifestoContent />
    </ScrollVelocityProvider>
  );
}
