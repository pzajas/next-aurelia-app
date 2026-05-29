"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { media } from "@/lib/media";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  type PanInfo,
} from "framer-motion";
import FounderPortraitStage, {
  useFounderPortraitMotion,
} from "@/components/sections/FounderPortraitStage";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;
const ROTATE_MS = 9000;
const SWIPE_THRESHOLD = 52;

const teamNames = [
  {
    id: "01",
    name: "Sofia Renault",
    image: media.people.founder.src,
    mobileObjectPosition: "80% 80%",
    mobileTranslateY: "10%",
  },
  {
    id: "02",
    name: "Margaux Chen",
    image: media.people.employee1.src,
    mobileObjectPosition: "79% 47%",
    mobileTranslateY: "9%",
  },
  {
    id: "03",
    name: "Elias Moreau",
    image: media.people.employee2.src,
    mobileObjectPosition: "84% 47%",
    mobileTranslateY: "9%",
  },
  {
    id: "04",
    name: "Amélie Dubois",
    image: media.people.employee3.src,
    mobileObjectPosition: "82% 47%",
    mobileTranslateY: "9%",
  },
] as const;

const textItem = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.05,
      delay: 0.18 + i * 0.11,
      ease: easeLuxury,
    },
  }),
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(4px)",
    transition: { duration: 0.45, ease: easeLuxury },
  },
};

type FounderMobileProps = {
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
};

export default function FounderMobile({
  paused,
  onPauseChange,
}: FounderMobileProps) {
  const { t, copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8% 0px" });
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [dragX, setDragX] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const dragHandledRef = useRef(false);

  const team = teamNames.map((person, index) => {
    const entry = copy.founder.team[index];
    return {
      id: person.id,
      name: person.name,
      label: t(entry.label),
      role: t(entry.role),
      image: person.image,
      mobileObjectPosition: person.mobileObjectPosition,
      mobileTranslateY: person.mobileTranslateY,
    };
  });

  const member = team[active];
  const nextIndex = (active + 1) % team.length;
  const nextMember = team[nextIndex];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const { revealProgress, imageParallaxY, revealClip } =
    useFounderPortraitMotion(scrollYProgress);

  useMotionValueEvent(revealProgress, "change", (v) => {
    if (v > 0.1) setEntered(true);
  });

  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  const goTo = useCallback(
    (index: number) => {
      const next = (index + team.length) % team.length;
      if (next === active) return;
      setTransitioning(true);
      setActive(next);
      window.setTimeout(() => setTransitioning(false), 900);
    },
    [active, team.length]
  );

  const next = useCallback(() => {
    goTo(active + 1);
  }, [active, goTo]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      onPauseChange(false);
      setDragX(0);
      const { offset, velocity } = info;

      if (offset.x <= -SWIPE_THRESHOLD || velocity.x <= -500) {
        goTo(active + 1);
        return;
      }
      if (offset.x >= SWIPE_THRESHOLD || velocity.x >= 500) {
        goTo(active - 1);
      }
    },
    [active, goTo, onPauseChange]
  );

  const dragOffset = Math.min(0, dragX * 0.22);
  const isDragging = Math.abs(dragX) > 14;
  const peekReveal = Math.min(1, Math.abs(dragX) / 100);

  useEffect(() => {
    if (!entered) return;
    const img = new window.Image();
    img.src = team[nextIndex].image;
  }, [active, entered, nextIndex, team]);

  useEffect(() => {
    if (paused || !entered) return;
    const timer = window.setInterval(next, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, entered, next]);

  return (
    <section
      ref={sectionRef}
      className="founder-mobile relative z-10 h-svh overflow-hidden bg-[#f8f8f8] md:hidden"
      onTouchStart={(e) => {
        touchStartXRef.current = e.changedTouches[0]?.clientX ?? null;
        touchStartYRef.current = e.changedTouches[0]?.clientY ?? null;
      }}
      onTouchEnd={(e) => {
        if (dragHandledRef.current) {
          dragHandledRef.current = false;
          return;
        }
        const startX = touchStartXRef.current;
        const startY = touchStartYRef.current;
        const endX = e.changedTouches[0]?.clientX ?? null;
        const endY = e.changedTouches[0]?.clientY ?? null;
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        if (startX === null || startY === null || endX === null || endY === null) return;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        if (deltaX < 0) goTo(active + 1);
        else goTo(active - 1);
      }}
    >
      <motion.div
        className="absolute inset-0 z-[2]"
        style={{ touchAction: "pan-y" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={() => {
          dragHandledRef.current = true;
          onPauseChange(true);
        }}
        onDrag={(_, info) => {
          setDragX(info.offset.x);
        }}
        onDragEnd={handleDragEnd}
      >
        <FounderPortraitStage
          activeKey={member.image}
          imageSrc={member.image}
          imageAlt={member.name}
          revealClip={revealClip}
          imageParallaxY={imageParallaxY}
          entered={entered}
          transitioning={transitioning}
          priority={active === 0}
          loading={active === 0 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 120vw, 100vw"
          quality={82}
          imageOffsetX={dragOffset}
          objectPosition={member.mobileObjectPosition}
          imageStyle={{
            transform: `translateY(${member.mobileTranslateY}) scale(1.16)`,
          }}
        >
          <AnimatePresence>
            {isDragging && (
              <motion.div
                key="peek"
                className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[28%] overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.35 + peekReveal * 0.5,
                  x: Math.max(0, -dragX * 0.06),
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easeLuxury }}
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#f8f8f8] via-[#f8f8f8]/75 to-transparent" />
                <Image
                  src={nextMember.image}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover grayscale"
                  style={{
                    objectPosition: nextMember.mobileObjectPosition,
                    transform: `translateY(${nextMember.mobileTranslateY}) scale(1.12)`,
                  }}
                  sizes="48vw"
                  quality={78}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </FounderPortraitStage>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[52%] bg-gradient-to-t from-[#f8f8f8] via-[#f8f8f8]/92 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-20 px-7 pb-[max(3.25rem,env(safe-area-inset-bottom))] pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={member.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col"
          >
            <motion.p
              custom={0}
              variants={textItem}
              className="text-[9px] font-sans uppercase tracking-[0.42em] text-foreground/58"
            >
              {member.label}
            </motion.p>

            <motion.div
              custom={1}
              variants={textItem}
              className="mt-3 h-px w-12 origin-left bg-foreground/26"
            />

            <motion.h2
              custom={2}
              variants={textItem}
              className="mt-4 font-serif text-[clamp(2.45rem,12.8vw,3.65rem)] font-light leading-[0.88] tracking-[-0.015em] text-foreground"
            >
              {member.name.split(" ").map((part) => (
                <span key={part} className="block">
                  {part}
                </span>
              ))}
            </motion.h2>

            <motion.p
              custom={3}
              variants={textItem}
              className="mt-3 font-serif text-[1.05rem] font-light text-foreground/72"
            >
              {member.role}
            </motion.p>

            <motion.div
              custom={4}
              variants={textItem}
              className="mt-6 flex items-center gap-3"
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
                    className="relative flex h-6 cursor-pointer items-center"
                    style={{ width: isActive ? 44 : 16 }}
                  >
                    <span
                      className={cn(
                        "block h-px w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isActive ? "bg-foreground/58" : "bg-foreground/20"
                      )}
                    />
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
