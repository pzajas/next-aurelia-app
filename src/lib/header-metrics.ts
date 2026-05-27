/** Mobile — fixed bar, always compact */
export const MOBILE_HEADER_HEIGHT = 58;

/** Desktop — cinematic expand / compress */
export const DESKTOP_HEADER_EXPANDED = 88;
export const DESKTOP_HEADER_COMPRESSED = 68;

/** @deprecated Use MOBILE_HEADER_HEIGHT — kept for mobile overlay parity */
export const NAV_HEADER_HEIGHT = MOBILE_HEADER_HEIGHT;

export const HEADER_SCROLL_EASE = [0.22, 1, 0.36, 1] as const;

export const headerScrollTransition = {
  duration: 0.8,
  ease: HEADER_SCROLL_EASE,
} as const;

export function resolveHeaderHeight(isDesktop: boolean, _scrolled: boolean): number {
  if (!isDesktop) return MOBILE_HEADER_HEIGHT;
  return DESKTOP_HEADER_EXPANDED;
}
