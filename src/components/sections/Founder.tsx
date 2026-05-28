"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { media } from "@/lib/media";
import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    motion,
  type PanInfo,
    useInView,
    useScroll,
    useTransform,
} from "framer-motion";
import Image from "next/image";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;
const easeEditorial = [0.19, 1, 0.22, 1] as const;
const easeCrossfade = [0.4, 0, 0.2, 1] as const;
const hoverTransition = { duration: 1.25, ease: easeEditorial };
const switchTransition = { duration: 0.4, ease: easeCrossfade };
const ROTATE_MS = 9000;
const SWIPE_THRESHOLD = 60;

const teamNames = [
  {
    id: "01",
    name: "Sofia Renault",
    signature: "Sofia Renault",
    image: media.people.founder.src,
    mobileObjectPosition: "80% 80%",
    mobileTranslateY: "10%",
  },
  {
    id: "02",
    name: "Margaux Chen",
    signature: "Margaux Chen",
    image: media.people.employee1.src,
    mobileObjectPosition: "79% 47%",
    mobileTranslateY: "9%",
  },
  {
    id: "03",
    name: "Elias Moreau",
    signature: "Elias Moreau",
    image: media.people.employee2.src,
    mobileObjectPosition: "84% 47%",
    mobileTranslateY: "9%",
  },
  {
    id: "04",
    name: "Amélie Dubois",
    signature: "Amélie Dubois",
    image: media.people.employee3.src,
    mobileObjectPosition: "82% 47%",
    mobileTranslateY: "9%",
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
  const [mobileDirection, setMobileDirection] = useState<1 | -1>(1);
  const [mobileSwipeHint, setMobileSwipeHint] = useState<1 | -1 | 0>(0);

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
    if (document.querySelector("link[data-preload-founder-lcp]")) return;
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
    const total = teamNames.length;
    const nextIndex = (index + total) % total;
    if (nextIndex === active) return;
    const forwardSteps = (nextIndex - active + total) % total;
    const backwardSteps = (active - nextIndex + total) % total;
    setMobileDirection(forwardSteps <= backwardSteps ? 1 : -1);
    setActive(nextIndex);
  }, [active]);

  const next = useCallback(() => {
    setMobileDirection(1);
    setActive((i) => (i + 1) % teamNames.length);
  }, []);

  const onMobileDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setPaused(false);
      setMobileSwipeHint(0);
      const { offset, velocity } = info;

      if (offset.x <= -SWIPE_THRESHOLD || velocity.x <= -500) {
        setMobileDirection(1);
        setActive((i) => (i + 1) % teamNames.length);
        return;
      }

      if (offset.x >= SWIPE_THRESHOLD || velocity.x >= 500) {
        setMobileDirection(-1);
        setActive((i) => (i - 1 + teamNames.length) % teamNames.length);
      }
    },
    []
  );

  useEffect(() => {
    if (paused || !sectionEntered) return;
    const timer = window.setInterval(next, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, next, sectionEntered]);

  const previewIndex =
    mobileSwipeHint > 0
      ? (active - 1 + teamNames.length) % teamNames.length
      : (active + 1) % teamNames.length;
  const mobileSlideVariants = {
    hidden: (direction: 1 | -1) => ({
      opacity: 0,
      x: direction > 0 ? 36 : -36,
      scale: 1.02,
    }),
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: (direction: 1 | -1) => ({
      opacity: 0,
      x: direction > 0 ? -28 : 28,
      scale: 0.985,
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden mt-8 md:mt-12 lg:mt-16 bg-[#f8f8f8]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Only the active slide is mounted — avoids lazy hidden images becoming LCP */}
      <div className="absolute inset-0 hidden md:block">
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

      {/* Mobile: fullscreen portrait card (no quote) */}
      <div className="relative z-10 md:hidden h-[100svh] overflow-hidden bg-[#f8f8f8]">
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: mobileSwipeHint === 0 ? 0 : 0.5,
            scale: mobileSwipeHint === 0 ? 1.03 : 1,
          }}
          transition={{ duration: 0.22, ease: easeCrossfade }}
        >
          <Image
            src={teamNames[previewIndex].image}
            alt={team[previewIndex].name}
            fill
            loading="lazy"
            className="object-cover grayscale"
            style={{
              objectPosition: teamNames[previewIndex].mobileObjectPosition,
              transform: `translateY(${teamNames[previewIndex].mobileTranslateY}) scale(1.15)`,
            }}
            sizes="100vw"
          />
        </motion.div>

        <AnimatePresence initial={false}>
          <motion.div
            key={`mobile-${teamNames[active].image}-${active}`}
            custom={mobileDirection}
            variants={mobileSlideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.75, ease: easeCrossfade }}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={() => {
              setPaused(true);
            }}
            onDrag={(_, info) => {
              if (Math.abs(info.offset.x) < 8) {
                setMobileSwipeHint(0);
                return;
              }
              setMobileSwipeHint(info.offset.x > 0 ? 1 : -1);
            }}
            onDragEnd={onMobileDragEnd}
          >
            <Image
              src={teamNames[active].image}
              alt={member.name}
              fill
              loading="eager"
              className="object-cover grayscale"
              style={{
                objectPosition: teamNames[active].mobileObjectPosition,
                transform: `translateY(${teamNames[active].mobileTranslateY}) scale(1.18)`,
              }}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[48%] bg-gradient-to-t from-[#f8f8f8] via-[#f8f8f8]/90 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-20 px-7 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-8 text-[#111]">
          <p className="text-[9px] font-sans uppercase tracking-[0.42em] text-foreground/62">
            {member.label}
          </p>
          <div className="mt-3 h-px w-12 bg-foreground/28" />
          <h2 className="mt-4 font-serif text-[clamp(2.45rem,12.8vw,3.65rem)] font-light leading-[0.88] tracking-[-0.015em] text-foreground">
            {member.name.split(" ").map((part) => (
              <span key={part} className="block">
                {part}
              </span>
            ))}
          </h2>
          <p className="mt-3 font-serif text-[1.08rem] font-light text-foreground/74">
            {member.role}
          </p>

          <div className="mt-6 flex items-center gap-3">
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
                  style={{ width: isActive ? 44 : 16 }}
                >
                  <span
                    className={cn(
                      "block h-px w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive ? "bg-foreground/60" : "bg-foreground/22"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop: text overlay on the left */}
      <motion.div
        style={{ y: parallaxY }}
        className="relative z-10 hidden md:block max-w-7xl mx-auto px-10 md:px-10 lg:px-10 py-28 md:py-36 lg:py-44"
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
                      isActive ? "bg-foreground/20" : "bg-foreground/12",
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
