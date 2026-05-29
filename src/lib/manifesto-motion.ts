/** Manifesto — single-pass smooth reveal (no stacked line fades) */

/** Soft landing — less snap than cinematic ease */
export const EASE_MANIFESTO = [0.22, 0.72, 0.28, 1] as const;

export const MANIFESTO_TEXT = {
  driftY: 5,
  labelDriftY: 4,
  label: { duration: 1.45, delay: 0 },
  quote: { duration: 1.75, delay: 0.28 },
  attribution: { duration: 1.35, delayAfterQuote: 0.55 },
  divider: { duration: 1.15, opacity: 0.28, delayAfterAttribution: 0.22 },
} as const;

export type ManifestoMotionScale = {
  duration: number;
  delay: number;
};

export function getManifestoMotionScale(
  velocityNorm: number,
  reduced: boolean
): ManifestoMotionScale {
  if (reduced) {
    return { duration: 1, delay: 1 };
  }
  const v = Math.min(1, Math.max(0, velocityNorm));
  const fast = v * v;
  const compress = 1 - fast * 0.28;
  return {
    duration: compress,
    delay: 1 - fast * 0.32,
  };
}

export function manifestoQuoteDelay(scale: ManifestoMotionScale) {
  return MANIFESTO_TEXT.quote.delay * scale.delay;
}

export function manifestoAttributionDelay(scale: ManifestoMotionScale) {
  return (
    manifestoQuoteDelay(scale) +
    MANIFESTO_TEXT.quote.duration * scale.duration * 0.42 +
    MANIFESTO_TEXT.attribution.delayAfterQuote * scale.delay
  );
}

export function manifestoDividerDelay(scale: ManifestoMotionScale) {
  return (
    manifestoAttributionDelay(scale) +
    MANIFESTO_TEXT.attribution.duration * scale.duration * 0.38 +
    MANIFESTO_TEXT.divider.delayAfterAttribution * scale.delay
  );
}

export function manifestoTransition(
  delay: number,
  duration: number,
  reduced: boolean
) {
  if (reduced) {
    return { duration: 0.22, delay, ease: EASE_MANIFESTO };
  }
  return { duration, delay, ease: EASE_MANIFESTO };
}

export function scaledDuration(
  base: number,
  scale: ManifestoMotionScale
): number {
  return base * scale.duration;
}
