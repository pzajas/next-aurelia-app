/** Editorial intro exit — pinch → line → roll up → hero image → hero copy */

export const SITE_MAX_WIDTH_PX = 1200;

export const INTRO_LINE_INSET_PX = 80;

export const INTRO_HOLD_MS = 2400;

/** Pinch intro column to site width */
export const INTRO_PINCH_MS = 1250;

export const INTRO_TEXT_EXIT_MS = 650;

export const INTRO_LINE_MS = 900;

export const INTRO_ROLL_UP_MS = 900;

/** Breath after intro curtain is gone, before hero image entrance */
export const HERO_IMAGE_AFTER_INTRO_MS = 50;

/** Hero copy starts after image entrance begins */
export const HERO_COPY_AFTER_IMAGE_MS = 1000;

export const HERO_DESKTOP_IMAGE_ENTRANCE = {
  fromScale: 1.04,
  opacityDurationS: 1.2,
  scaleDurationS: 2.2,
} as const;

/** Hero visible under rolling intro curtain — soft focus before sharp reveal */
export const HERO_INTRO_PEEK = {
  blurPx: 14,
  brightness: 0.92,
  scale: 1.03,
  unblurDurationS: 1.1,
} as const;

export const INTRO_EASE = [0.22, 1, 0.36, 1] as const;

export const TOTAL_INTRO_MS =
  INTRO_HOLD_MS +
  INTRO_PINCH_MS +
  INTRO_TEXT_EXIT_MS +
  INTRO_LINE_MS +
  INTRO_ROLL_UP_MS +
  HERO_COPY_AFTER_IMAGE_MS +
  400;
