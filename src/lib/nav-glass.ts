/** Shared frosted surface — header on scroll (desktop) */
export type NavSurfaceStyle = {
  background: string;
  backdropFilter: string;
  WebkitBackdropFilter: string;
  borderBottom: string;
  boxShadow: string;
};

export const NAV_GLASS: NavSurfaceStyle = {
  background: "rgba(250, 248, 245, 0.72)",
  backdropFilter: "blur(20px) saturate(140%)",
  WebkitBackdropFilter: "blur(20px) saturate(140%)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 8px 32px rgba(0, 0, 0, 0.04)",
};

/** Dark frosted glass — desktop header on scroll */
export const NAV_GLASS_DARK: NavSurfaceStyle = {
  background: "rgba(8, 8, 8, 0.58)",
  backdropFilter: "blur(20px) saturate(125%)",
  WebkitBackdropFilter: "blur(20px) saturate(125%)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 8px 32px rgba(0, 0, 0, 0.18)",
};

/** Header surface when mobile menu is open — matches menu sheet */
export const NAV_HEADER_DARK: NavSurfaceStyle = {
  background: "var(--mobile-nav-surface)",
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
  borderBottom: "none",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
};

export type NavChromeTheme = "light" | "dark";

type NavChrome = {
  fg: string;
  rule: string;
  header: NavSurfaceStyle;
};

export const navChrome: Record<NavChromeTheme, NavChrome> = {
  dark: {
    fg: "text-white",
    rule: "bg-white/35",
    header: NAV_GLASS,
  },
  light: {
    fg: "text-[#141210]",
    rule: "bg-[#141210]/25",
    header: NAV_GLASS,
  },
};

/** Mobile nav — always cinematic black */
export const mobileNavPalette = {
  fg: "text-white/92",
  fgMuted: "text-white/34",
  fgCta: "text-white",
  accent: "bg-white/22",
  ctaRule: "bg-white/48",
  edition: "text-white/22",
} as const;

export function resolveNavChromeTheme(
  scrolled: boolean,
  scrollY: number,
  threshold = 50
): NavChromeTheme {
  return scrolled || scrollY > threshold ? "light" : "dark";
}
