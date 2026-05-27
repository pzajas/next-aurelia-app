/** Editorial ease — slow in, confident out */
export const NAV_EASE = [0.22, 1, 0.36, 1] as const;
export const NAV_EASE_SNAP = [0.19, 1, 0.22, 1] as const;

export const navTimings = {
  headerRuleOpen: 0.68,
  headerRuleClose: 0.38,
  curtainOpenDelay: 0.14,
  /** Menu header overlay — single fade back to page chrome (seconds) */
  headerSurfaceOpen: 0.32,
  headerSurfaceClose: 0.46,
  headerSurfaceCloseDelay: 0,
  /** Text color snaps back faster than the surface fade */
  headerFgClose: 0.28,
  headerFgCloseDelay: 0,
  /** Start header chrome fade before overlay exit finishes */
  headerReleaseLeadSec: 0.75,
} as const;

/** Mobile overlay choreography (seconds) */
export const mobileNavMotion = {
  open: {
    dim: 0.58,
    panel: 0.62,
    panelDelay: 0.04,
    atmosphere: 0.85,
    atmosphereDelay: 0.2,
    accentLine: 0.68,
    accentDelay: 0.42,
    linkDuration: 0.58,
    linkStagger: 0.06,
    linkDelay: 0.46,
    ctaExtraDelay: 0.12,
    editionDelay: 0.18,
  },
  close: {
    dim: 0.28,
    dimDelay: 0,
    panel: 0.32,
    panelDelay: 0,
    atmosphere: 0.2,
    atmosphereDelay: 0,
    linkDuration: 0.16,
    linkStagger: 0.02,
    accent: 0.12,
    edition: 0.12,
  },
} as const;

/** Longest overlay exit phase — header chrome waits until this completes */
export function getMobileNavCloseDurationSec(reducedMotion = false) {
  if (reducedMotion) {
    return 0.24 + 0.04;
  }
  const { close } = mobileNavMotion;
  return Math.max(close.panelDelay + close.panel, close.dimDelay + close.dim);
}
