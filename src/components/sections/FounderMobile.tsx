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
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;
const ROTATE_MS = 9000;
const SWIPE_THRESHOLD = 52;
const SWITCH_MS = 560;
/** Single opacity crossfade — no blur/stagger (smoother on mobile). */
const TEXT_CROSSFADE_S = 0.48;

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

type FounderMobileProps = {
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
};

function FounderMobileIndicators({
  active,
  onSelect,
  viewMemberLabel,
}: {
  active: number;
  onSelect: (index: number) => void;
  viewMemberLabel: string;
}) {
  return (
    <div className="mt-6 flex items-center gap-3 pointer-events-auto">
      {teamNames.map((person, index) => {
        const isActive = index === active;
        return (
          <button
            key={person.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`${viewMemberLabel} ${person.name}`}
            aria-current={isActive ? "true" : undefined}
            className="relative flex h-6 cursor-pointer items-center"
            style={{ width: isActive ? 44 : 16 }}
          >
            <span
              className={cn(
                "block h-px w-full transition-[width,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive ? "bg-foreground/58" : "bg-foreground/20"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function MemberCopy({
  label,
  name,
  role,
}: {
  label: string;
  name: string;
  role: string;
}) {
  return (
    <>
      <p className="text-[9px] font-sans uppercase tracking-[0.42em] text-foreground/58">
        {label}
      </p>
      <div className="mt-3 h-px w-12 bg-foreground/26" />
      <h2 className="mt-4 font-serif text-[clamp(2.45rem,12.8vw,3.65rem)] font-light leading-[0.88] tracking-[-0.015em] text-foreground">
        {name.split(" ").map((part) => (
          <span key={part} className="block">
            {part}
          </span>
        ))}
      </h2>
      <p className="mt-3 font-serif text-[1.05rem] font-light text-foreground/72">
        {role}
      </p>
    </>
  );
}

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
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const dragHandledRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);
  const swappingRef = useRef(false);

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

  const preloadAdjacent = useCallback(
    (index: number) => {
      const prev = team[(index - 1 + team.length) % team.length];
      const next = team[(index + 1) % team.length];
      [prev.image, next.image].forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    },
    [team]
  );

  const goTo = useCallback(
    (index: number) => {
      const next = (index + team.length) % team.length;
      if (next === active || swappingRef.current) return;

      swappingRef.current = true;
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }

      setTransitioning(true);
      setActive(next);
      preloadAdjacent(next);

      transitionTimerRef.current = window.setTimeout(() => {
        setTransitioning(false);
        swappingRef.current = false;
        transitionTimerRef.current = null;
      }, SWITCH_MS);
    },
    [active, preloadAdjacent, team.length]
  );

  const next = useCallback(() => {
    goTo(active + 1);
  }, [active, goTo]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      onPauseChange(false);
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

  useEffect(() => {
    if (!entered) return;
    preloadAdjacent(active);
  }, [active, entered, preloadAdjacent]);

  useEffect(() => {
    if (paused || !entered) return;
    const timer = window.setInterval(next, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, entered, next]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

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
        dragElastic={0.06}
        dragMomentum={false}
        onDragStart={() => {
          dragHandledRef.current = true;
          onPauseChange(true);
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
          objectPosition={member.mobileObjectPosition}
          imageStyle={{
            transform: `translateY(${member.mobileTranslateY}) scale(1.16)`,
          }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[52%] bg-gradient-to-t from-[#f8f8f8] via-[#f8f8f8]/92 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-20 px-7 pb-[max(3.25rem,env(safe-area-inset-bottom))] pt-10">
        <motion.div
          className="relative h-[12.75rem]"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: easeLuxury }}
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={member.id}
              className="absolute inset-x-0 top-0 flex flex-col will-change-[opacity]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: TEXT_CROSSFADE_S, ease: easeLuxury }}
            >
              <MemberCopy
                label={member.label}
                name={member.name}
                role={member.role}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <FounderMobileIndicators
          active={active}
          onSelect={goTo}
          viewMemberLabel={t(copy.founder.viewMember)}
        />
      </div>
    </section>
  );
}
