import { MOBILE_HEADER_HEIGHT } from "@/lib/header-metrics";

function headerScrollOffset(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-header-height")
    .trim();
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : MOBILE_HEADER_HEIGHT;
}

/** Scroll to a section id; respects `scroll-margin-top` on the target. */
export function scrollToSection(
  sectionId: string,
  behavior: ScrollBehavior = "smooth"
) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const offset = headerScrollOffset();
  const top =
    el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: Math.max(0, top), behavior });

  if (window.location.hash !== `#${sectionId}`) {
    history.replaceState(null, "", `#${sectionId}`);
  }
}

export function parseSectionId(href: string): string | null {
  if (!href.startsWith("#")) return null;
  const id = href.slice(1);
  return id.length > 0 ? id : null;
}
