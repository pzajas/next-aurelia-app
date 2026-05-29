/** Luxury mobile disciplines — scroll-adaptive cinematic timing */

export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

export type DisciplineMotionTiming = {
  duration: number;
  lineDuration: number;
  blurPx: number;
};

export type DisciplineRowDelays = {
  rule: number;
  number: number;
  title: number;
  desc: number;
  image: number;
};

export function getDisciplineMotionTiming(
  velocityNorm: number,
  reduced: boolean
): DisciplineMotionTiming {
  if (reduced) {
    return { duration: 0.2, lineDuration: 0.2, blurPx: 0 };
  }
  const v = Math.min(1, Math.max(0, velocityNorm));
  const fast = v * v;
  return {
    duration: 1.3 - fast * 0.72,
    lineDuration: 0.95 - fast * 0.48,
    blurPx: 4 - fast * 2.5,
  };
}

/** Temporal dead-zones — compress at high scroll velocity */
export function buildRowDelays(
  rowIndex: number,
  velocityNorm = 0
): DisciplineRowDelays {
  const asym = rowIndex * 0.04;
  const v = Math.min(1, Math.max(0, velocityNorm));
  const breath = 1 - v * 0.78;
  return {
    rule: (0 + asym) * breath,
    number: (0.08 + asym) * breath,
    title: (0.22 + asym) * breath,
    desc: (0.34 + asym) * breath,
    image: (0.5 + asym) * breath,
  };
}

export function filterAtmosphericIn(blurPx: number) {
  const b = Math.min(4, Math.max(1, blurPx));
  return `blur(${b}px) brightness(0.985) contrast(0.97)`;
}

export const FILTER_ATMOSPHERIC_REST =
  "blur(0px) brightness(1) contrast(1)";

export const FILTER_TAP =
  "blur(0px) brightness(1.03) contrast(1.02) grayscale(0.9)";

export const TAP_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 34,
  mass: 0.95,
};

export function motionTransition(
  timing: DisciplineMotionTiming,
  delay: number,
  duration?: number
) {
  return {
    duration: duration ?? timing.duration,
    delay,
    ease: EASE_CINEMATIC,
  };
}
