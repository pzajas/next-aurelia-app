"use client";

import {
  buildRowDelays,
  EASE_CINEMATIC,
  FILTER_ATMOSPHERIC_REST,
  FILTER_TAP,
  getDisciplineMotionTiming,
  filterAtmosphericIn,
  motionTransition,
  TAP_SPRING,
  type DisciplineMotionTiming,
  type DisciplineRowDelays,
} from "@/lib/discipline-motion";
import {
  ScrollVelocityProvider,
  useScrollVelocityReveal,
} from "@/lib/useScrollVelocity";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const disciplineObjectPositions = [
  "72% 35%",
  "68% 32%",
  "74% 38%",
  "70% 34%",
  "72% 35%",
] as const;

const BREATH_DURATION = [13, 14.5, 12.5, 15, 13.8] as const;

const viewport = { once: true, amount: 0.2, margin: "0px 0px -50px 0px" } as const;

function OrganicRule({
  visible,
  delay,
  timing,
  className,
}: {
  visible: boolean;
  delay: number;
  timing: DisciplineMotionTiming;
  className: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={
        visible
          ? { scaleX: 1, opacity: 1 }
          : { scaleX: 0, opacity: 0 }
      }
      transition={
        reduced
          ? { duration: 0.15, delay }
          : motionTransition(timing, delay, timing.lineDuration)
      }
      style={{ transformOrigin: "center" }}
      aria-hidden
    />
  );
}

function DisciplineTextColumn({
  item,
  visible,
  delays,
  timing,
}: {
  item: MobileDisciplineItem;
  visible: boolean;
  delays: DisciplineRowDelays;
  timing: DisciplineMotionTiming;
}) {
  const reduced = Boolean(useReducedMotion());

  const line = (delay: number) =>
    reduced
      ? { duration: 0.15, delay: visible ? delay : 0 }
      : motionTransition(timing, visible ? delay : 0);

  const hidden = reduced ? { opacity: 0 } : { y: 20, opacity: 0 };
  const shown = reduced ? { opacity: 1 } : { y: 0, opacity: 1 };

  return (
    <div className="relative z-10 flex min-w-0 flex-col px-0 py-6">
      <div className="overflow-hidden">
        <motion.p
          initial={hidden}
          animate={visible ? shown : hidden}
          transition={line(delays.number)}
          className="font-serif text-[3rem] font-light leading-[0.9] tracking-[0.02em] text-foreground"
        >
          {item.id}
        </motion.p>
      </div>

      <div className="mt-2 overflow-hidden">
        <motion.h3
          initial={hidden}
          animate={visible ? shown : hidden}
          transition={line(delays.title)}
          className="font-serif text-[1.95rem] font-light leading-[0.95] tracking-[-0.01em] text-foreground"
        >
          {item.name}
        </motion.h3>
      </div>

      <div className="mt-4 max-w-[14rem] overflow-hidden">
        <motion.p
          initial={hidden}
          animate={visible ? shown : hidden}
          transition={line(delays.desc)}
          className="font-sans text-[10px] font-normal uppercase tracking-[0.38em] leading-[1.65] text-foreground/60"
        >
          {item.desc}
        </motion.p>
      </div>
    </div>
  );
}

function FocusPortrait({
  src,
  alt,
  index,
  visible,
  delay,
  timing,
}: {
  src: string;
  alt: string;
  index: number;
  visible: boolean;
  delay: number;
  timing: DisciplineMotionTiming;
}) {
  const reduced = Boolean(useReducedMotion());
  const [breathing, setBreathing] = useState(false);
  const filterIn = filterAtmosphericIn(timing.blurPx);

  const hidden = reduced
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.985,
        y: 12,
        filter: filterIn,
      };

  const shown = reduced
    ? { opacity: 1 }
    : {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: FILTER_ATMOSPHERIC_REST,
      };

  return (
    <motion.div
      initial={hidden}
      animate={visible ? shown : hidden}
      transition={
        reduced
          ? { duration: 0.2, delay: visible ? delay : 0 }
          : motionTransition(timing, visible ? delay : 0)
      }
      onAnimationComplete={() => {
        if (visible && !reduced) setBreathing(true);
      }}
      className="relative min-h-[148px] overflow-hidden bg-layer-1 will-change-[transform,filter]"
      style={{ transformOrigin: "center 62%" }}
      whileTap={
        reduced
          ? undefined
          : {
              scale: 1.018,
              filter: FILTER_TAP,
              transition: TAP_SPRING,
            }
      }
    >
      <motion.div
        className="absolute inset-0"
        animate={breathing ? { scale: [1, 1.01, 1] } : { scale: 1 }}
        transition={
          breathing
            ? {
                duration: BREATH_DURATION[index] ?? 14,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : undefined
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover grayscale"
          style={{ objectPosition: disciplineObjectPositions[index] }}
          sizes="42vw"
        />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[4.5rem] bg-gradient-to-r from-layer-1 via-layer-1/90 to-transparent"
        aria-hidden
      />
    </motion.div>
  );
}

export type MobileDisciplineItem = {
  id: string;
  name: string;
  desc: string;
  imageSrc: string;
};

export function MobileDisciplinesList({ items }: { items: MobileDisciplineItem[] }) {
  return (
    <ScrollVelocityProvider>
      <div className="md:hidden">
        {items.map((item, index) => (
          <DisciplineRow key={item.id} item={item} index={index} />
        ))}
      </div>
    </ScrollVelocityProvider>
  );
}

function DisciplineRow({
  item,
  index,
}: {
  item: MobileDisciplineItem;
  index: number;
}) {
  const rowRef = useRef<HTMLElement>(null);
  const inView = useInView(rowRef, viewport);
  const sampleRevealVelocity = useScrollVelocityReveal();
  const reduced = Boolean(useReducedMotion());

  const [lockedTiming, setLockedTiming] = useState<DisciplineMotionTiming | null>(
    null
  );
  const [lockedDelays, setLockedDelays] = useState<DisciplineRowDelays | null>(
    null
  );

  useEffect(() => {
    if (!inView || lockedTiming) return;
    const v = sampleRevealVelocity();
    setLockedTiming(getDisciplineMotionTiming(v, reduced));
    setLockedDelays(buildRowDelays(index, v));
  }, [inView, sampleRevealVelocity, reduced, lockedTiming, index]);

  const revealVelocity = sampleRevealVelocity();
  const timing =
    lockedTiming ?? getDisciplineMotionTiming(revealVelocity, reduced);
  const delays = lockedDelays ?? buildRowDelays(index, revealVelocity);

  return (
    <motion.article
      ref={rowRef}
      className="relative mb-4 grid grid-cols-[minmax(0,1fr)_42%] gap-3 bg-layer-1 last:mb-0"
      style={{ WebkitTapHighlightColor: "transparent" }}
      whileTap={
        reduced
          ? undefined
          : {
              backgroundColor: "rgba(250, 248, 244, 0.72)",
              transition: { duration: 0.65, ease: EASE_CINEMATIC },
            }
      }
    >
      {index === 0 ? (
        <OrganicRule
          visible={inView}
          delay={delays.rule}
          timing={timing}
          className="absolute inset-x-0 top-0 h-px bg-foreground/[0.12]"
        />
      ) : null}

      <DisciplineTextColumn
        item={item}
        visible={inView}
        delays={delays}
        timing={timing}
      />

      <FocusPortrait
        src={item.imageSrc}
        alt={item.name}
        index={index}
        visible={inView}
        delay={delays.image}
        timing={timing}
      />

      <OrganicRule
        visible={inView}
        delay={delays.rule}
        timing={timing}
        className="absolute inset-x-0 bottom-0 h-px origin-center bg-foreground/[0.12]"
      />
    </motion.article>
  );
}
