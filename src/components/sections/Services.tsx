"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { MobileDisciplinesList } from "@/components/sections/MobileDisciplines";
import { useEffect, useRef, useState } from "react";

const easeReveal = [0.22, 1, 0.36, 1] as const;
const easeEditorial = [0.19, 1, 0.22, 1] as const;
const hoverTransition = { duration: 0.95, ease: easeEditorial };
const STAGGER = 0.1;

const serviceIds = ["01", "02", "03", "04", "05"] as const;

const microLabelClass =
  "font-sans text-[10px] font-normal uppercase tracking-[0.38em] leading-[1.65] text-foreground/40";

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
  const mobileDisciplineImages = [
    "/images/founder-ok.avif",
    "/images/founder-margaux.avif",
    "/images/founder-elias.avif",
    "/images/founder-amelie.avif",
    "/images/founder-ok.avif",
  ] as const;

  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="cinematic-section bg-layer-1 border-b border-editorial"
    >
      <div className="relative mx-auto max-w-[1200px] px-4 pt-24 pb-24 md:px-10 md:py-28">
        <header className="flex items-center justify-between gap-4 pb-8 md:items-end md:gap-8 md:pb-14">
          <div className="min-w-0 self-center">
            <motion.p
              initial={{ opacity: 0, x: -12, letterSpacing: "0.28em" }}
              animate={
                entered
                  ? { opacity: 1, x: 0, letterSpacing: "0.4em" }
                  : undefined
              }
              transition={{ duration: 1.1, ease: easeReveal }}
              className="mb-0 text-[10px] font-sans uppercase leading-none text-foreground/40"
            >
              {t(copy.disciplines.eyebrow)}
            </motion.p>
          </div>
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={entered ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1.1, delay: 0.15, ease: easeReveal }}
            className="self-center text-right text-[10px] font-sans uppercase leading-none tracking-[0.34em] text-foreground/42 md:pb-2"
          >
            {t(copy.disciplines.aside)}
          </motion.p>
        </header>

        <div>
          <MobileDisciplinesList
            items={services.map((service, index) => ({
              id: service.id,
              name: service.name,
              desc: service.desc,
              imageSrc:
                mobileDisciplineImages[index] ?? mobileDisciplineImages[0],
            }))}
          />

          <div
            className="relative hidden md:block"
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
                  <div className="grid items-center grid-cols-[1fr] gap-x-4 py-8 md:grid-cols-[minmax(24rem,48%)_minmax(0,1fr)_1.6rem] md:gap-x-8 md:py-10">
                    <div className="flex items-baseline gap-6 md:gap-7">
                      <motion.span
                        animate={{
                          opacity: isHovered ? 1 : 0.24,
                          scale: isHovered ? 1.18 : 1,
                          color: isHovered
                            ? "rgba(0,0,0,1)"
                            : "rgba(17,17,17,0.35)",
                        }}
                        transition={hoverTransition}
                        style={{ transformOrigin: "left center" }}
                        className="inline-block font-serif text-[clamp(2rem,3vw,2.8rem)] font-light leading-none tabular-nums tracking-[0.03em]"
                      >
                        {service.id}
                      </motion.span>

                      <motion.h3
                        animate={{
                          x: isHovered ? 3 : 0,
                          letterSpacing: isHovered ? "-0.008em" : "0em",
                          opacity: isHovered ? 1 : 0.96,
                          color: isHovered
                            ? "rgba(0,0,0,0.98)"
                            : "rgba(17,17,17,0.96)",
                        }}
                        transition={hoverTransition}
                        className="max-w-none font-serif text-[clamp(1.8rem,2.55vw,2.65rem)] font-light leading-none tracking-[-0.01em] text-foreground will-change-transform"
                      >
                        {service.name}
                      </motion.h3>
                    </div>

                    <motion.p
                      animate={{
                        opacity: isHovered ? 0.78 : 0.5,
                        color: isHovered
                          ? "rgba(0,0,0,0.9)"
                          : "rgba(17,17,17,0.4)",
                      }}
                      transition={hoverTransition}
                      className={cn(
                        microLabelClass,
                        "mt-3 pr-6 md:mt-0 md:pr-0 md:text-right",
                      )}
                    >
                      {service.desc}
                    </motion.p>

                    <motion.span
                      initial={false}
                      animate={{
                        opacity: isHovered ? 0.85 : 0,
                        x: isHovered ? 0 : -6,
                      }}
                      transition={{ ...hoverTransition, duration: 0.8 }}
                      className="pointer-events-none justify-self-end font-sans text-[10px] text-foreground/80"
                      aria-hidden
                    >
                      →
                    </motion.span>
                  </div>

                  <motion.div
                    className="pointer-events-none absolute bottom-0 left-0 h-px w-[5.2rem] origin-left scale-y-[0.35]"
                    initial={false}
                    animate={{
                      scaleX: isHovered ? 1 : 0,
                      backgroundColor: isHovered
                        ? "rgba(0,0,0,1)"
                        : "rgba(17,17,17,0.4)",
                      opacity: isHovered ? 0.95 : 0.55,
                    }}
                    transition={{ duration: 1.1, ease: easeEditorial }}
                    aria-hidden
                  />
                </motion.article>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={entered ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.05, delay: 0.78, ease: easeReveal }}
            className="relative overflow-visible"
          >
            <div className="relative flex md:hidden items-center pt-1">
              <div className="flex flex-1 items-center justify-center py-4 text-center">
                <p
                  className={cn(
                    microLabelClass,
                    "translate-y-[2px] text-foreground/65",
                  )}
                >
                  {t(copy.disciplines.atelierMenu.link)}
                </p>
              </div>

              <Link
                href="#booking"
                className="group flex flex-1 items-center justify-center gap-2 py-4 text-center"
              >
                <span
                  className={cn(
                    microLabelClass,
                    "translate-y-[2px] text-foreground/60",
                  )}
                >
                  Poznaj usługi
                </span>
                <span
                  className="inline-flex shrink-0 items-center justify-center translate-y-[2px] font-sans text-[10px] text-foreground/55 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[3px]"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </div>

            <div className="relative hidden md:flex md:items-center">
              <div className="flex flex-col justify-center py-10 md:pr-10 lg:pr-14 md:min-w-[220px] lg:min-w-[260px]">
                <p className={cn(microLabelClass, "text-foreground/65")}>
                  {t(copy.disciplines.atelierMenu.link)}
                </p>
              </div>

              <div
                className="h-14 w-px shrink-0 self-center bg-foreground/10 lg:h-16"
                aria-hidden
              />

              <div className="flex flex-1 items-center py-10 md:px-10 lg:px-14">
                <p
                  className={cn(
                    microLabelClass,
                    "text-foreground/50 md:mx-auto md:max-w-[360px] md:text-center",
                  )}
                >
                  {t(copy.disciplines.atelierMenu.description)}
                </p>
              </div>

              <div
                className="h-14 w-px shrink-0 self-center bg-foreground/10 lg:h-16"
                aria-hidden
              />

              <Link
                href="#booking"
                className="group flex cursor-pointer items-center justify-between gap-5 overflow-visible md:min-w-[230px] md:justify-end md:py-10 md:pl-10 md:pr-4 lg:min-w-[290px] lg:pl-14"
              >
                <span
                  className={cn(
                    microLabelClass,
                    "whitespace-nowrap transition-[letter-spacing,color] duration-900 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:tracking-[0.41em] group-hover:text-foreground/72",
                  )}
                >
                  {t(copy.disciplines.atelierMenu.explore)}
                </span>
                <span
                  className="inline-flex min-w-6 shrink-0 items-center justify-end overflow-visible pl-1 font-sans text-[10px] text-foreground/70 will-change-transform"
                  aria-hidden
                >
                  <span className="opacity-[0.45] transition-all duration-900 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[4px] group-hover:opacity-80">
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
