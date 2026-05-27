"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { media } from "@/lib/media";
import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    motion,
    useInView,
    useScroll,
    useTransform,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
    image: media.people.founder.src,
  },
  {
    id: "02",
    name: "Margaux Chen",
    signature: "Margaux Chen",
    image: media.people.employee1.src,
  },
  {
    id: "03",
    name: "Elias Moreau",
    signature: "Elias Moreau",
    image: media.people.employee2.src,
  },
  {
    id: "04",
    name: "Amélie Dubois",
    signature: "Amélie Dubois",
    image: media.people.employee3.src,
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
  const motionConfig = isReveal
    ? buildRevealMotionConfig()
    : switchMotionConfig;

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
        className="text-[12px] font-sans uppercase tracking-[0.55em] text-foreground/38 mb-10"
      >
        {member.label}
      </motion.p>

      <motion.h2
        variants={motionConfig.item}
        className="font-serif text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.01em] text-foreground"
      >
        {member.name}
      </motion.h2>

      <motion.p
        variants={motionConfig.item}
        className="font-serif text-[clamp(1rem,1.6vw,1.3rem)] font-light text-foreground/55 mt-4 tracking-[0.01em]"
      >
        {member.role}
      </motion.p>

      {isReveal ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 48, opacity: 1 }}
          transition={{
            duration: 1.4,
            delay: 0.6,
            ease: easeLuxury,
          }}
          className="h-px bg-foreground/15 my-10"
        />
      ) : (
        <motion.div
          variants={motionConfig.item}
          className="w-12 border-t border-foreground/12 my-10"
        />
      )}

      <motion.p
        variants={motionConfig.item}
        className="font-serif italic text-[clamp(1.15rem,1.8vw,1.45rem)] leading-[1.65] text-foreground/70 max-w-sm"
      >
        {member.quote}
      </motion.p>

      <motion.p
        variants={motionConfig.item}
        className="font-sans text-[12px] uppercase tracking-[0.3em] text-foreground/40 mt-8"
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
  const [founderIsLcp, setFounderIsLcp] = useState(false);

  useLayoutEffect(() => {
    setFounderIsLcp(window.location.hash === "#atelier");
  }, []);
  const [sectionEntered, setSectionEntered] = useState(false);
  const [playedSectionReveal, setPlayedSectionReveal] = useState(false);
  const [active, setActive] = useState(0);
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
    if (!founderIsLcp) return;
    const href = teamNames[0].image;
    if (document.querySelector('link[data-preload-founder-lcp]')) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    link.setAttribute("data-preload-founder-lcp", "");
    document.head.appendChild(link);
  }, [founderIsLcp]);

  useEffect(() => {
    if (!sectionEntered) return;
    const nextIndex = (active + 1) % teamNames.length;
    const img = new window.Image();
    img.src = teamNames[nextIndex].image;
  }, [active, sectionEntered]);

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
      className="relative overflow-hidden mt-8 md:mt-12 lg:mt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Only the active slide is mounted — avoids lazy hidden images becoming LCP */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={teamNames[active].image}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={switchTransition}
            className="absolute inset-0"
          >
            <Image
              src={teamNames[active].image}
              alt={member.name}
              fill
              priority={founderIsLcp}
              loading="eager"
              fetchPriority={founderIsLcp ? "high" : "auto"}
              className="object-cover object-[65%_35%] grayscale"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text overlay on the left */}
      <motion.div
        style={{ y: parallaxY }}
        className="relative z-10 max-w-7xl mx-auto px-10 md:px-10 lg:px-10 py-28 md:py-36 lg:py-44"
      >
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={sectionEntered ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 1.6, ease: easeLuxury }}
          className="max-w-lg"
        >
          <div className="relative h-[400px] sm:h-[440px] md:h-[480px] w-full shrink-0 overflow-hidden">
            <AnimatePresence initial={false}>
              <TeamMemberContent
                key={member.id}
                member={member}
                isReveal={isSectionReveal}
              />
            </AnimatePresence>
          </div>

          {/* Progress indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={sectionEntered ? { opacity: 1 } : undefined}
            transition={{ duration: 1.2, delay: 1, ease: easeLuxury }}
            className="mt-16 flex items-center gap-3"
          >
            {teamNames.map((person, index) => {
              const isActive = index === active;
              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${t(copy.founder.viewMember)} ${person.name}`}
                  aria-current={isActive ? "true" : undefined}
                  className="relative h-6 cursor-pointer flex items-center"
                  style={{ width: isActive ? 48 : 16 }}
                >
                  <span
                    className={cn(
                      "block h-[1px] w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive ? "bg-foreground/20" : "bg-foreground/12"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        className="block h-full bg-foreground/80"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: ROTATE_MS / 1000,
                          ease: "linear",
                        }}
                        key={active}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
