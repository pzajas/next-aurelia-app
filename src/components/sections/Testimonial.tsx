"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const easeLuxury = [0.22, 1, 0.36, 1] as const;
const easeEditorial = [0.19, 1, 0.22, 1] as const;
const hoverTransition = { duration: 1.25, ease: easeEditorial };
const ROTATE_MS = 7000;

const revealLabel = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.15, ease: easeLuxury },
  },
};

const revealRule = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.2, ease: easeLuxury },
  },
};

const revealQuoteShell = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.45, ease: easeLuxury, delay: 0.22 },
  },
};

const revealNav = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: easeLuxury, delay: 0.55 },
  },
};

export default function Testimonial() {
  const { t, tLines, copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" });
  const [entered, setEntered] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);
  const [active, setActive] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const testimonials = copy.testimonials.items.map((item, index) => ({
    id: String(index + 1).padStart(2, "0"),
    lines: tLines(item.lines),
    attribution: t(item.attribution),
    footnote: t(item.footnote),
  }));

  const current = testimonials[active];

  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused || !entered) return;
    const timer = window.setInterval(next, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, entered, next]);

  return (
    <section
      ref={sectionRef}
      className="cinematic-section relative bg-layer-0 text-editorial-body overflow-hidden border-b border-editorial"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <motion.div className="cinematic-bloom" aria-hidden />
      <motion.div
        className="testimonial-grain pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden
      />

      <div className="relative px-4 pt-28 pb-36 md:px-10 md:pt-40 md:pb-48 lg:pt-48 lg:pb-56">
        <motion.p
          variants={revealLabel}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          className="text-center text-[12px] font-sans uppercase tracking-[0.45em] text-editorial-micro mb-20 md:mb-28"
        >
          {t(copy.testimonials.label)}
        </motion.p>

        <motion.div
          variants={revealQuoteShell}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const startX = touchStartX.current;
            const endX = e.changedTouches[0]?.clientX ?? null;
            touchStartX.current = null;
            if (startX === null || endX === null) return;
            const delta = endX - startX;
            if (Math.abs(delta) < 38) return;
            if (delta < 0) {
              setActive((i) => (i + 1) % testimonials.length);
            } else {
              setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
            }
          }}
          onAnimationComplete={() => {
            if (entered) setRevealComplete(true);
          }}
          className="mx-auto flex max-w-4xl min-h-[280px] md:min-h-[320px] flex-col items-center justify-center text-center"
        >
          <motion.span
            variants={revealRule}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            transition={{ delay: 0.32 }}
            className="mb-10 block h-px w-14 origin-center bg-foreground/18 md:mb-12 md:w-20"
            aria-hidden
          />

          <div className="relative w-full min-h-[220px] md:min-h-[250px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                initial={revealComplete ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: revealComplete ? 0.55 : 1.05, ease: easeLuxury }}
                className="absolute inset-0 flex flex-col items-center justify-center will-change-[opacity,transform]"
              >
              <blockquote className="font-serif italic font-light text-[clamp(2rem,4.5vw,4rem)] leading-[1.35] tracking-[-0.01em] text-editorial-heading">
                {current.lines.map((line, i) =>
                  revealComplete ? (
                    <span key={line} className="block">
                      {i === 0 ? "\u201E" : null}
                      {line}
                      {i === current.lines.length - 1 ? "\u201D" : null}
                    </span>
                  ) : (
                    <motion.span
                      key={line}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1.05,
                        delay: 0.38 + i * 0.11,
                        ease: easeLuxury,
                      }}
                      className="block"
                    >
                      {i === 0 ? "\u201E" : null}
                      {line}
                      {i === current.lines.length - 1 ? "\u201D" : null}
                    </motion.span>
                  )
                )}
              </blockquote>

                {revealComplete ? (
                  <p className="mt-14 md:mt-16 text-[12px] font-sans uppercase tracking-[0.32em] text-editorial-micro">
                    {current.attribution}
                  </p>
                ) : (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.62,
                      ease: easeLuxury,
                    }}
                    className="mt-14 md:mt-16 text-[12px] font-sans uppercase tracking-[0.32em] text-editorial-micro"
                  >
                    {current.attribution}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.span
            variants={revealRule}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            transition={{ delay: 0.48 }}
            className="mt-10 block h-px w-14 origin-center bg-foreground/18 md:mt-12 md:w-20"
            aria-hidden
          />
        </motion.div>

        <motion.div
          variants={revealNav}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          className="mx-auto mt-20 md:mt-28 hidden md:flex max-w-3xl flex-col items-center gap-8 md:flex-row md:justify-center md:gap-0"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {testimonials.map((item, index) => {
            const isActive = index === active;
            const isHovered = hoveredIndex === index;
            const dimSibling =
              hoveredIndex !== null && !isActive && !isHovered;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                aria-current={isActive ? "true" : undefined}
                initial={false}
                animate={{
                  opacity: entered ? (dimSibling ? 0.4 : 1) : 0,
                }}
                transition={{
                  opacity: { ...hoverTransition, duration: 1.2 },
                }}
                className={cn(
                  "group relative flex cursor-pointer flex-col items-center px-5 pb-2 pt-1 md:px-8",
                  index > 0 && "md:border-l md:border-foreground/10"
                )}
              >
                <motion.span
                  animate={{
                    opacity: isActive ? 0.88 : isHovered ? 0.72 : 0.48,
                    scale: isActive ? 1.04 : isHovered ? 1.06 : 1,
                    letterSpacing: isHovered || isActive ? "0.26em" : "0.22em",
                  }}
                  transition={hoverTransition}
                  style={{ transformOrigin: "center bottom" }}
                  className="block max-w-[200px] text-center font-sans text-[12px] uppercase leading-relaxed tracking-[0.22em] text-editorial-body will-change-transform"
                >
                  {item.footnote}
                </motion.span>

                <motion.span
                  className="absolute bottom-0 left-1/2 h-px w-[90%] max-w-[180px] -translate-x-1/2 origin-center bg-foreground/55 scale-y-[0.35] will-change-transform"
                  initial={false}
                  animate={{
                    scaleX: isActive ? 0.72 : isHovered ? 0.48 : 0,
                  }}
                  transition={{ duration: 1.4, ease: easeEditorial }}
                  aria-hidden
                />
              </motion.button>
            );
          })}
        </motion.div>
        <div className="mt-6 flex items-center justify-center gap-3 md:hidden" aria-hidden>
          {testimonials.map((item, index) => (
            <span
              key={`dot-${item.id}`}
              style={{ width: index === active ? 44 : 16 }}
              className={cn(
                "block h-px transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                index === active ? "bg-foreground/60" : "bg-foreground/22"
              )}
            >
              &nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
