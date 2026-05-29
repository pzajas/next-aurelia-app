/** Gallery mobile — hero-matched atmospheric image reveal */

import {
  EASE_CINEMATIC,
  HERO_FILTER_REST,
  HERO_FILTER_SETTLE_IN,
  HERO_IMAGE_ENTRANCE,
  HERO_IMAGE_HOLD,
  HERO_IMAGE_SCALE_FROM,
  HERO_TAP,
} from "@/lib/hero-motion";

export {
  EASE_CINEMATIC,
  HERO_FILTER_REST as GALLERY_FILTER_REST,
  HERO_FILTER_SETTLE_IN as GALLERY_FILTER_SETTLE_IN,
  HERO_IMAGE_ENTRANCE as GALLERY_IMAGE_ENTRANCE,
  HERO_IMAGE_HOLD as GALLERY_IMAGE_HOLD,
  HERO_IMAGE_SCALE_FROM as GALLERY_IMAGE_SCALE_FROM,
  HERO_TAP as GALLERY_IMAGE_TAP,
};

export const GALLERY_MOBILE = {
  inViewAmount: 0.32,
  inViewMargin: "0px 0px -6% 0px",
} as const;

export function galleryImageTransition(reduced: boolean) {
  if (reduced) {
    return { duration: 0.25, ease: EASE_CINEMATIC };
  }
  return {
    filter: { ...HERO_IMAGE_ENTRANCE.filter },
    scale: { ...HERO_IMAGE_ENTRANCE.scale },
  };
}

export function galleryQuoteTransition(reduced: boolean) {
  if (reduced) {
    return { duration: 0.2, ease: EASE_CINEMATIC };
  }
  return { duration: 1.05, ease: EASE_CINEMATIC };
}
