/** Luxury mobile hero — atmospheric lens settle, breath, tonal drift */

export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

export const HERO_FILTER_SETTLE_IN =
  "blur(2px) brightness(0.96) contrast(0.94)";

export const HERO_FILTER_REST = "blur(0px) brightness(1) contrast(1)";

export const HERO_FILTER_TAP =
  "blur(0px) brightness(1.02) contrast(1.03)";

/** Slightly tighter zoom — slower settle reads more lens-like than a big punch */
export const HERO_IMAGE_SCALE_FROM = 1.028;

/** Scale lingers; opacity/filter resolve first */
export const HERO_IMAGE_ENTRANCE = {
  opacity: { duration: 2.15, ease: EASE_CINEMATIC },
  filter: { duration: 2.35, ease: EASE_CINEMATIC },
  scale: { duration: 3.2, ease: [0.14, 0.92, 0.2, 1] as const },
} as const;

/** Top-to-bottom on screen (edition → logo → tagline → subtitle) */
export const HERO_TEXT_DELAYS = {
  microEdition: 0.2,
  logo: 0.36,
  title: 0.52,
  microSubtitle: 0.68,
} as const;

export const HERO_TEXT_ENTRANCE = {
  duration: 1.05,
  ease: EASE_CINEMATIC,
} as const;

export const HERO_BREATH_SCALE = [1, 1.008, 1];

export const HERO_BREATH = {
  transition: {
    duration: 18,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
  },
};

export const HERO_TONAL_FILTER = [
  "blur(0px) brightness(1) contrast(1)",
  "blur(0px) brightness(1.015) contrast(1.008)",
  "blur(0px) brightness(1) contrast(1)",
];

export const HERO_TONAL = {
  transition: {
    duration: 17,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
  },
};

export const HERO_TAP = {
  scale: 1.01,
  filter: HERO_FILTER_TAP,
  transition: {
    type: "spring" as const,
    stiffness: 280,
    damping: 32,
    mass: 0.9,
  },
};

export function heroTextTransition(delay: number, reduced: boolean) {
  if (reduced) {
    return { duration: 0.2, delay: delay, ease: EASE_CINEMATIC };
  }
  return {
    ...HERO_TEXT_ENTRANCE,
    delay,
  };
}
