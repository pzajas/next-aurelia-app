"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const easeReveal = [0.22, 1, 0.36, 1] as const;
const easeEditorial = [0.19, 1, 0.22, 1] as const;
const hoverTransition = { duration: 1.25, ease: easeEditorial };
const STAGGER = 0.12;

const serviceIds = ["01", "02", "03", "04", "05"] as const;

/** Micro label — matches USŁUGI | RYTUAŁY / POZNAJ USŁUGI | CENNIK */
const microLabelClass =
  "font-sans text-[8px] font-normal uppercase tracking-[0.42em] leading-[1.65] text-foreground/58";

export default function Services() {
  const { t, copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const [entered, setEntered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const services = serviceIds.map((id, index) => ({
    id,
    name: t(copy.disciplines.items[index].name),
    desc: t(copy.disciplines.items[index].desc),
  }));

  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="bg-background border-b border-foreground/10"
    >
      <div className="relative mx-auto max-w-6xl px-8 py-24 md:py-32">
        <header className="flex flex-col gap-6 pb-14 md:flex-row md:items-end md:justify-between md:pb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -12, letterSpacing: "0.28em" }}
              animate={
                entered
                  ? { opacity: 1, x: 0, letterSpacing: "0.4em" }
                  : undefined
              }
              transition={{ duration: 1.1, ease: easeReveal }}
              className="text-[8px] font-sans uppercase text-foreground/48 mb-5"
            >
              {t(copy.disciplines.eyebrow)}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={entered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1.2, delay: 0.08, ease: easeReveal }}
              className="font-serif text-[clamp(2.2rem,4vw,3rem)] font-light text-foreground leading-none"
            >
              {t(copy.disciplines.title)}
            </motion.h2>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={entered ? { width: 56, opacity: 1 } : undefined}
              transition={{ duration: 1.1, delay: 0.22, ease: easeReveal }}
              className="mt-6 h-px bg-foreground/20"
            />
          </div>
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={entered ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1.1, delay: 0.15, ease: easeReveal }}
            className="text-[9px] font-sans uppercase tracking-[0.35em] text-foreground/48 md:pb-1"
          >
            {t(copy.disciplines.aside)}
          </motion.p>
        </header>

        <div className="border-t border-foreground/10">
          <div className="relative overflow-hidden">
            <div
              className="testimonial-grain pointer-events-none absolute inset-0 opacity-[0.035]"
              aria-hidden
            />

            <div
              className="relative"
              onMouseLeave={() => setHoveredId(null)}
            >
              {services.map((service, index) => {
                const rowDelay = 0.32 + index * STAGGER;
                const isHovered = hoveredId === service.id;
                const dimSiblings = hoveredId !== null && !isHovered;

                return (
                  <motion.article
                    key={service.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: entered ? (dimSiblings ? 0.65 : 1) : 0,
                      y: entered ? 0 : 12,
                    }}
                    transition={{
                      opacity: { ...hoverTransition, duration: 1.3 },
                      y: {
                        duration: 1.15,
                        delay: rowDelay,
                        ease: easeReveal,
                      },
                    }}
                    className="relative cursor-pointer"
                    onMouseEnter={() => setHoveredId(service.id)}
                  >
                    <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-5 py-8 md:grid-cols-[3rem_minmax(15rem,38%)_minmax(0,1fr)_1.75rem] md:items-center md:gap-x-9 md:py-12 lg:gap-x-11">
                      <motion.span
                        animate={{
                          opacity: isHovered ? 0.68 : 0.42,
                          scale: isHovered ? 1.38 : 1,
                        }}
                        transition={hoverTransition}
                        style={{ transformOrigin: "left center" }}
                        className="inline-block font-serif text-[0.95rem] tabular-nums md:text-[1rem]"
                      >
                        {service.id}
                      </motion.span>

                      <motion.h3
                        animate={{
                          x: isHovered ? 5 : 0,
                          letterSpacing: isHovered ? "-0.012em" : "0em",
                          opacity: isHovered ? 1 : 0.96,
                        }}
                        transition={hoverTransition}
                        className="max-w-none font-serif text-[clamp(1.25rem,2.2vw,1.9rem)] font-light leading-[1.15] text-foreground will-change-transform lg:text-[2rem]"
                      >
                        {service.name}
                      </motion.h3>

                      <motion.p
                        animate={{
                          opacity: isHovered ? 0.78 : 0.58,
                        }}
                        transition={hoverTransition}
                        className={cn(
                          microLabelClass,
                          "col-span-2 hidden md:col-span-1 md:block md:pl-2 md:text-left lg:pl-3"
                        )}
                      >
                        {service.desc}
                      </motion.p>

                      <motion.span
                        animate={{
                          opacity: isHovered ? 0.38 : 0.05,
                          x: isHovered ? 7 : 0,
                        }}
                        transition={{ ...hoverTransition, duration: 1.35 }}
                        className="justify-self-end font-sans text-[1.05rem] text-foreground will-change-transform md:justify-self-auto"
                        aria-hidden
                      >
                        →
                      </motion.span>
                    </div>

                    <p
                      className={cn(
                        microLabelClass,
                        "-mt-2 pb-8 pl-[3.75rem] pr-10 md:hidden",
                        "transition-opacity duration-[1250ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                        isHovered && "text-foreground/75"
                      )}
                    >
                      {service.desc}
                    </p>

                    <motion.div
                      className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-y-[0.35] bg-foreground/50 opacity-50"
                      initial={false}
                      animate={{
                        scaleX: isHovered ? 1 / 6 : 0,
                      }}
                      transition={{ duration: 1.65, ease: easeEditorial }}
                      aria-hidden
                    />
                  </motion.article>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={entered ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.15, delay: 0.95, ease: easeReveal }}
            className="relative overflow-visible border-t border-foreground/10"
          >
            <div
              className="testimonial-grain pointer-events-none absolute inset-0 opacity-[0.04]"
              aria-hidden
            />

            <div className="relative flex flex-col overflow-visible md:flex-row md:items-center">
              <div className="flex flex-col justify-center py-10 md:py-12 md:pr-10 lg:pr-14 md:min-w-[200px] lg:min-w-[240px]">
                <p className="font-serif text-[clamp(1.75rem,3.2vw,2.35rem)] font-light leading-none text-foreground">
                  {t(copy.disciplines.atelierMenu.link)}
                </p>
              </div>

              <div
                className="hidden md:block w-px shrink-0 self-center h-14 bg-foreground/10 lg:h-16"
                aria-hidden
              />

              <div className="flex flex-1 items-center border-t border-foreground/10 py-8 md:border-t-0 md:py-12 md:px-10 lg:px-14">
                <p
                  className={cn(
                    microLabelClass,
                    "text-foreground/60 md:text-center md:mx-auto md:max-w-[360px]"
                  )}
                >
                  {t(copy.disciplines.atelierMenu.description)}
                </p>
              </div>

              <div
                className="hidden md:block w-px shrink-0 self-center h-14 bg-foreground/10 lg:h-16"
                aria-hidden
              />

              <Link
                href="#contact"
                className="group flex cursor-pointer items-center justify-between gap-5 overflow-visible border-t border-foreground/10 py-8 pr-3 md:border-t-0 md:justify-end md:gap-6 md:py-12 md:pl-10 md:pr-5 lg:pl-14 lg:pr-6 md:min-w-[220px] lg:min-w-[280px]"
              >
                <span
                  className={cn(
                    microLabelClass,
                    "whitespace-nowrap transition-[letter-spacing,color] duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:tracking-[0.44em] group-hover:text-foreground/72"
                  )}
                >
                  {t(copy.disciplines.atelierMenu.explore)}
                </span>
                <span
                  className="inline-flex min-w-[1.5rem] shrink-0 items-center justify-end overflow-visible pl-1 font-sans text-[1.05rem] text-foreground will-change-transform"
                  aria-hidden
                >
                  <span className="opacity-[0.35] transition-all duration-[1250ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[6px] group-hover:opacity-55">
                    →
                  </span>
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
