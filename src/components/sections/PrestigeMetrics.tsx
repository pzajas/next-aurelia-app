"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;
const STAGGER = 0.14;
const COUNTER_DURATION = 1.6;

const statValues = [
  { value: 17, suffix: "", align: "start" as const },
  { value: 3400, suffix: "+", align: "center" as const },
  { value: 12, suffix: "", align: "end" as const },
];

function formatCount(value: number, suffix: string) {
  if (value >= 1000) {
    return `${value.toLocaleString("en-US")}${suffix}`;
  }
  return `${value}${suffix}`;
}

function CountUp({
  target,
  suffix = "",
  start,
  delay = 0,
}: {
  target: number;
  suffix?: string;
  start: boolean;
  delay?: number;
}) {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!start) {
      setRunning(false);
      setValue(0);
      return;
    }

    const timeout = window.setTimeout(() => setRunning(true), delay * 1000);
    return () => window.clearTimeout(timeout);
  }, [start, delay]);

  useEffect(() => {
    if (!running) return;

    let frame = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(
        (now - startTime) / (COUNTER_DURATION * 1000),
        1,
      );
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, target]);

  return <span className="tabular-nums">{formatCount(value, suffix)}</span>;
}

const alignClasses = {
  start: "md:items-start md:text-left",
  center: "md:items-center md:text-center",
  end: "md:items-end md:text-right",
} as const;

const hairlineAlign = {
  start: "",
  center: "md:mx-auto",
  end: "md:ml-auto",
} as const;

export default function PrestigeMetrics() {
  const { t, copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-12% 0px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [14, -12]);

  return (
    <section ref={sectionRef} className="bg-background overflow-hidden">
      <motion.div
        style={{ y: parallaxY }}
        className="max-w-5xl mx-auto px-4 py-20 md:px-10 border-b border-foreground/10"
      >
        <motion.p
          initial={{ opacity: 0, x: -14, letterSpacing: "0.28em" }}
          animate={
            inView ? { opacity: 1, x: 0, letterSpacing: "0.4em" } : undefined
          }
          transition={{ duration: 1.1, ease: easeLuxury }}
          className="text-[10px] font-sans uppercase text-foreground/60 mb-16"
        >
          {t(copy.prestige.label)}
        </motion.p>

        <div className="group/stats grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
          {statValues.map((stat, i) => {
            const label = t(copy.prestige.stats[i].label);
            const statDelay = STAGGER * (i + 1) + 0.08;
            const lineDelay = statDelay + 0.2;
            const labelDelay = statDelay + 0.38;

            return (
              <motion.div
                key={label}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={
                  inView
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : undefined
                }
                transition={{
                  duration: 1.4,
                  delay: statDelay,
                  ease: easeLuxury,
                }}
                className={cn(
                  "flex flex-col items-start text-left",
                  "transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "md:opacity-100 md:group-hover/stats:opacity-50 md:hover:!opacity-100",
                  alignClasses[stat.align],
                )}
              >
                <div className="font-serif text-[clamp(3.5rem,7vw,7rem)] font-light text-foreground leading-none">
                  <CountUp
                    target={stat.value}
                    suffix={stat.suffix}
                    start={inView}
                    delay={statDelay}
                  />
                </div>

                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={inView ? { width: 48, opacity: 1 } : undefined}
                  transition={{
                    duration: 1.1,
                    delay: lineDelay,
                    ease: easeLuxury,
                  }}
                  className={cn(
                    "h-px bg-foreground/20 my-4 shrink-0",
                    hairlineAlign[stat.align],
                  )}
                />

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{
                    duration: 0.9,
                    delay: labelDelay,
                    ease: easeLuxury,
                  }}
                  className="text-[10px] font-sans uppercase tracking-[0.3em] text-foreground/60"
                >
                  {label}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
