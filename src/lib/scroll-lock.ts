const SCROLL_ROOT = ".site-shell";
const MENU_ROOT_ID = "mobile-nav";

let lockedScrollY = 0;
let isLocked = false;

function measureScrollY(root: HTMLElement) {
  const fromRect = Math.round(Math.max(0, -root.getBoundingClientRect().top));
  const fromWindow = Math.round(
    window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0,
  );
  return Math.max(fromRect, fromWindow);
}

function isInsideMenu(target: EventTarget | null) {
  if (!(target instanceof Node)) return false;
  const menu = document.getElementById(MENU_ROOT_ID);
  return menu?.contains(target) ?? false;
}

function preventBackgroundScroll(event: Event) {
  if (isInsideMenu(event.target)) return;
  event.preventDefault();
}

/**
 * Lock background scroll without position:fixed (avoids mobile scroll-to-top jump).
 */
export function lockScroll() {
  const root = document.querySelector<HTMLElement>(SCROLL_ROOT);
  if (!root || isLocked) return;

  lockedScrollY = measureScrollY(root);
  isLocked = true;

  root.dataset.scrollLocked = "true";
  root.dataset.scrollY = String(lockedScrollY);
  document.documentElement.dataset.navScrollY = String(lockedScrollY);
  document.documentElement.style.scrollBehavior = "auto";
  document.documentElement.setAttribute("data-scroll-locked", "");
  document.documentElement.setAttribute("data-nav-open", "");

  document.addEventListener("touchmove", preventBackgroundScroll, {
    passive: false,
  });
  document.addEventListener("wheel", preventBackgroundScroll, {
    passive: false,
  });
}

/** Remove page dim / dark shell while menu panel may still be exiting */
export function releaseNavVisual() {
  document.documentElement.removeAttribute("data-nav-open");
}

export function unlockScroll() {
  const root = document.querySelector<HTMLElement>(SCROLL_ROOT);
  if (!isLocked) return;

  const scrollY = lockedScrollY;
  isLocked = false;
  lockedScrollY = 0;

  document.removeEventListener("touchmove", preventBackgroundScroll);
  document.removeEventListener("wheel", preventBackgroundScroll);

  if (root) {
    delete root.dataset.scrollLocked;
    delete root.dataset.scrollY;
  }

  document.documentElement.removeAttribute("data-scroll-locked");
  document.documentElement.removeAttribute("data-nav-open");
  delete document.documentElement.dataset.navScrollY;
  document.documentElement.style.scrollBehavior = "";

  window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
}

export function isScrollLocked() {
  return isLocked;
}

export function getLockedScrollY() {
  return lockedScrollY;
}
