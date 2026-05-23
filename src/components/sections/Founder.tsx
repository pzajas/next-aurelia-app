"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const easeLuxury = [0.22, 1, 0.36, 1] as const;
const easeEditorial = [0.19, 1, 0.22, 1] as const;
const easeCrossfade = [0.4, 0, 0.2, 1] as const;
const hoverTransition = { duration: 1.25, ease: easeEditorial };
const switchTransition = { duration: 0.4, ease: easeCrossfade };
const ROTATE_MS = 9000;

const teamNames = [
  {
    id: "01",
    name: "Sofia Renault",
    signature: "Sofia Renault",
    image: "/images/founder.png",
  },
  {
    id: "02",
    name: "Margaux Chen",
    signature: "Margaux Chen",
    image: "/images/employee1.png",
  },
  {
    id: "03",
    name: "Elias Moreau",
    signature: "Elias Moreau",
    image: "/images/employee2.png",
  },
  {
    id: "04",
    name: "Amélie Dubois",
    signature: "Amélie Dubois",
    image: "/images/employee3.png",
  },
] as const;

function buildRevealMotionConfig() {
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.35, ease: easeLuxury },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.35, ease: easeCrossfade },
    },
  };

  return {
    container: {
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
      },
      exit: {
        transition: { staggerChildren: 0.03, staggerDirection: -1 },
      },
    },
    item,
  };
}

const switchMotionConfig = {
  container: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04, delayChildren: 0 },
    },
    exit: {
      transition: { staggerChildren: 0.02, staggerDirection: -1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: easeCrossfade },
    },
    exit: {
      opacity: 0,
      y: -4,
      transition: { duration: 0.28, ease: easeCrossfade },
    },
  },
};

type TeamMember = {
  id: string;
  label: string;
  name: string;
  role: string;
  quote: string;
  signature: string;
};

function TeamMemberContent({
  member,
  isReveal,
}: {
  member: TeamMember;
  isReveal: boolean;
}) {
  const motionConfig = isReveal ? buildRevealMotionConfig() : switchMotionConfig;

  return (
    <motion.div
      variants={motionConfig.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 flex flex-col"
    >
      <motion.p
        variants={
          isReveal
            ? {
                hidden: {
                  ...motionConfig.item.hidden,
                  letterSpacing: "0.28em",
                },
                visible: {
                  ...motionConfig.item.visible,
                  letterSpacing: "0.4em",
                },
                exit: motionConfig.item.exit,
              }
            : motionConfig.item
        }
        className="text-[8px] font-sans uppercase tracking-[0.4em] text-foreground/40 mb-10"
      >
        {member.label}
      </motion.p>

      <motion.h2
        variants={motionConfig.item}
        className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] text-foreground"
      >
        {member.name}
      </motion.h2>

      <motion.p
        variants={motionConfig.item}
        className="font-serif text-[clamp(1.1rem,2vw,1.5rem)] font-light text-foreground/80 mt-2"
      >
        {member.role}
      </motion.p>

      {isReveal ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 64, opacity: 1 }}
          transition={{
            duration: 1.1,
            delay: 0.55,
            ease: easeLuxury,
          }}
          className="h-px bg-foreground/20 my-8"
        />
      ) : (
        <motion.div
          variants={motionConfig.item}
          className="w-16 border-t border-foreground/20 my-8"
        />
      )}

      <motion.p
        variants={motionConfig.item}
        className="font-serif text-[clamp(1rem,1.6vw,1.25rem)] leading-relaxed text-foreground/90 max-w-md"
      >
        {member.quote}
      </motion.p>

      <motion.p
        variants={motionConfig.item}
        className="font-serif italic text-[clamp(0.95rem,1.4vw,1.1rem)] text-foreground/70 mt-8"
      >
        — {member.signature}
      </motion.p>
    </motion.div>
  );
}

export default function Founder() {
  const { t, copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const [sectionEntered, setSectionEntered] = useState(false);
  const [playedSectionReveal, setPlayedSectionReveal] = useState(false);
  const [active, setActive] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const team: TeamMember[] = teamNames.map((person, index) => {
    const entry = copy.founder.team[index];
    return {
      id: person.id,
      name: person.name,
      signature: person.signature,
      label: t(entry.label),
      role: t(entry.role),
      quote: t(entry.quote),
    };
  });

  const member = team[active];
  const isSectionReveal = sectionEntered && !playedSectionReveal;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [16, -14]);

  useEffect(() => {
    if (inView) setSectionEntered(true);
  }, [inView]);

  useEffect(() => {
    if (!sectionEntered || playedSectionReveal) return;
    const timer = window.setTimeout(() => setPlayedSectionReveal(true), 2200);
    return () => window.clearTimeout(timer);
  }, [sectionEntered, playedSectionReveal]);

  useEffect(() => {
    teamNames.forEach((person) => {
      const img = new window.Image();
      img.src = person.image;
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setActive((index + teamNames.length) % teamNames.length);
  }, []);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % teamNames.length);
  }, []);

  useEffect(() => {
    if (paused || !sectionEntered) return;
    const timer = window.setInterval(next, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, next, sectionEntered]);

  return (
    <section
      ref={sectionRef}
      className="bg-background border-b border-foreground/10 overflow-hidden"
    >
      <motion.div
        style={{ y: parallaxY }}
        className="max-w-6xl mx-auto px-8 py-20 md:py-28"
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)_auto] gap-12 lg:gap-16 items-start lg:items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={
              sectionEntered ? { opacity: 1, x: 0 } : undefined
            }
            transition={{ duration: 1.4, ease: easeLuxury }}
            className="order-2 lg:order-1 flex flex-col"
          >
            <div className="relative h-[380px] sm:h-[400px] md:h-[420px] w-full shrink-0 overflow-hidden">
              <AnimatePresence initial={false}>
                <TeamMemberContent
                  key={member.id}
                  member={member}
                  isReveal={isSectionReveal}
                />
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={sectionEntered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, delay: 0.85, ease: easeLuxury }}
              className="mt-12 flex shrink-0 items-center gap-8 md:gap-10"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {teamNames.map((person, index) => {
                const isActive = index === active;
                const isHovered = hoveredIndex === index;
                const dimSibling =
                  hoveredIndex !== null && !isActive && !isHovered;

                return (
                  <motion.button
                    key={person.id}
                    type="button"
                    onClick={() => goTo(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    aria-label={`${t(copy.founder.viewMember)} ${person.name}`}
                    aria-current={isActive ? "true" : undefined}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{
                      opacity: sectionEntered ? (dimSibling ? 0.38 : 1) : 0,
                      y: sectionEntered ? 0 : 8,
                    }}
                    transition={{
                      opacity: { ...hoverTransition, duration: 1.2 },
                      y: {
                        duration: 0.9,
                        delay: 0.95 + index * 0.08,
                        ease: easeLuxury,
                      },
                    }}
                    className="group flex h-10 w-10 cursor-pointer flex-col items-center justify-end gap-2"
                  >
                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : isHovered ? 0.78 : 0.48,
                        scale: isActive ? 1.14 : isHovered ? 1.28 : 1,
                      }}
                      transition={hoverTransition}
                      style={{ transformOrigin: "center bottom" }}
                      className="w-full text-center font-sans text-[9px] font-normal tabular-nums uppercase tracking-[0.35em] text-foreground will-change-transform"
                    >
                      {person.id}
                    </motion.span>
                    <motion.span
                      className="block h-px w-6 max-w-full origin-left bg-foreground/65 scale-y-[0.35] will-change-transform"
                      initial={false}
                      animate={{
                        scaleX: isActive ? 1 : isHovered ? 0.55 : 0,
                      }}
                      transition={{ duration: 1.4, ease: easeEditorial }}
                      aria-hidden
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={
              sectionEntered ? { opacity: 1, scale: 1 } : undefined
            }
            transition={{ duration: 1.5, delay: 0.28, ease: easeLuxury }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[420px] aspect-[3/4] overflow-hidden bg-foreground/5">
              {teamNames.map((person, index) => (
                <motion.div
                  key={person.image}
                  animate={{
                    opacity: index === active ? 1 : 0,
                    scale: index === active ? 1 : 1.02,
                  }}
                  transition={switchTransition}
                  className="absolute inset-0"
                  aria-hidden={index !== active}
                >
                  <Image
                    src={person.image}
                    alt={index === active ? member.name : ""}
                    fill
                    priority={index === 0}
                    className="object-cover grayscale"
                    sizes="(max-width: 1024px) 90vw, 420px"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={sectionEntered ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1.2, delay: 0.45, ease: easeLuxury }}
            className="hidden lg:flex order-3 items-center justify-end self-stretch py-4"
          >
            <motion.p
              initial={{ letterSpacing: "0.28em" }}
              animate={sectionEntered ? { letterSpacing: "0.35em" } : undefined}
              transition={{ duration: 1.2, delay: 0.5, ease: easeLuxury }}
              className="text-[9px] font-sans uppercase text-foreground/40 whitespace-nowrap"
              style={{ writingMode: "vertical-rl" }}
            >
              {t(copy.founder.locations)}
            </motion.p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={sectionEntered ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.55, ease: easeLuxury }}
          className="lg:hidden mt-10 text-center text-[9px] font-sans uppercase tracking-[0.35em] text-foreground/40"
        >
          {t(copy.founder.locations)}
        </motion.p>
      </motion.div>
    </section>
  );
}
